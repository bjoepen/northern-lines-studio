use lopdf::{dictionary, Dictionary, Document, Object, ObjectId, Stream, StringFormat};
use sha2::{Digest, Sha256};
use std::{
    collections::{BTreeMap, BTreeSet},
    fs,
    path::Path,
};

const A5_WIDTH_PT: f64 = 148.0 / 25.4 * 72.0;
const A5_HEIGHT_PT: f64 = 210.0 / 25.4 * 72.0;
const PDF_BOX_TOLERANCE_PT: f64 = 0.01;

#[derive(Debug, Clone)]
pub struct StudioPdfA2bExportResult {
    pub page_count: usize,
    pub profile: &'static str,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PdfAIntegrityEvidence {
    page_count: usize,
    page_boxes: Vec<PageBoxEvidence>,
    decoded_page_content_hashes: Vec<Vec<String>>,
    image_stream_hashes: BTreeMap<ObjectId, String>,
    font_resources: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct PageBoxEvidence {
    media_box: String,
    crop_box: String,
}

pub fn convert_to_pdfa2b(
    source_path: &Path,
    output_path: &Path,
) -> Result<StudioPdfA2bExportResult, String> {
    if !source_path.exists() {
        return Err("PDF_A_EXPORT_FAILED: Das Standard-PDF wurde nicht gefunden.".into());
    }
    if output_path
        .extension()
        .and_then(|extension| extension.to_str())
        != Some("pdf")
    {
        return Err(
            "PDF_A_WRITE_FAILED: Das PDF/A-Travelbook muss als .pdf gespeichert werden.".into(),
        );
    }

    let source_bytes = fs::read(source_path).map_err(|error| {
        format!("PDF_A_EXPORT_FAILED: Standard-PDF konnte nicht gelesen werden: {error}")
    })?;
    let mut document = Document::load_mem(&source_bytes).map_err(|error| {
        format!("PDF_A_EXPORT_FAILED: Standard-PDF konnte nicht gelesen werden: {error}")
    })?;
    let before = collect_pdfa_integrity(&document)?;

    add_pdfa_xmp_metadata(&mut document)?;
    add_deterministic_trailer_id(&mut document, &source_bytes);
    let profile_id = find_suitable_srgb_icc_profile(&document)?;
    add_rgb_output_intent(&mut document, profile_id)?;
    normalize_interpolate_flags(&mut document)?;
    validate_pdfa2b_structure(&document)?;

    document.save(output_path).map_err(|error| {
        format!("PDF_A_WRITE_FAILED: PDF/A-Travelbook konnte nicht geschrieben werden: {error}")
    })?;

    let written = Document::load(output_path).map_err(|error| {
        format!(
            "PDF_A_VALIDATION_FAILED: PDF/A-Travelbook konnte nicht erneut gelesen werden: {error}"
        )
    })?;
    validate_pdfa2b_structure(&written)?;
    let after = collect_pdfa_integrity(&written)?;
    assert_pdfa_integrity_unchanged(&before, &after)?;

    Ok(StudioPdfA2bExportResult {
        page_count: after.page_count,
        profile: "PDF/A-2b",
    })
}

pub fn validate_pdfa2b_structure(document: &Document) -> Result<(), String> {
    if document.version != "1.7" {
        return Err(format!(
            "PDF_A_VALIDATION_FAILED: PDF-Version {} ist nicht die erwartete PDF/A-2b-Quelle 1.7.",
            document.version
        ));
    }
    let catalog = catalog_dict(document)?;
    let metadata = catalog
        .get(b"Metadata")
        .map_err(|_| "PDF_A_METADATA_FAILED: PDF/A-Metadaten fehlen.".to_string())
        .and_then(|object| dereference_stream(document, object))?;
    let xmp = String::from_utf8_lossy(&metadata.content);
    if !xmp.contains("<pdfaid:part>2</pdfaid:part>")
        || !xmp.contains("<pdfaid:conformance>B</pdfaid:conformance>")
    {
        return Err("PDF_A_METADATA_FAILED: PDF/A-2b-Kennung fehlt in den Metadaten.".into());
    }
    match document.trailer.get(b"ID") {
        Ok(Object::Array(ids)) if ids.len() == 2 && ids.iter().all(valid_file_id_object) => {}
        _ => return Err("PDF_A_VALIDATION_FAILED: PDF/A-Dateikennung fehlt.".into()),
    }
    let output_intents = catalog
        .get(b"OutputIntents")
        .map_err(|_| "PDF_A_OUTPUT_INTENT_UNAVAILABLE: Farbprofil für PDF/A fehlt.".to_string())?
        .as_array()
        .map_err(|_| {
            "PDF_A_OUTPUT_INTENT_UNAVAILABLE: Farbprofil-Eintrag ist nicht lesbar.".to_string()
        })?;
    let has_rgb_output_intent = output_intents.iter().any(|object| {
        dereference_dict(document, object)
            .and_then(|dict| {
                dict.get(b"DestOutputProfile")
                    .map_err(|error| error.to_string())
            })
            .and_then(|profile| dereference_stream(document, profile))
            .map(is_suitable_srgb_icc_stream)
            .unwrap_or(false)
    });
    if !has_rgb_output_intent {
        return Err(
            "PDF_A_OUTPUT_INTENT_UNAVAILABLE: Es wurde kein geeignetes RGB-Farbprofil gefunden."
                .into(),
        );
    }
    if has_interpolate_true(document) {
        return Err("PDF_A_INTERPOLATE_FAILED: PDF/A-Bildglättung ist noch aktiv.".into());
    }
    collect_pdfa_integrity(document)?;
    Ok(())
}

pub fn collect_pdfa_integrity(document: &Document) -> Result<PdfAIntegrityEvidence, String> {
    let pages = document.get_pages();
    if pages.is_empty() {
        return Err("PDF_A_INTEGRITY_FAILED: Das Travelbook enthält keine Seiten.".into());
    }
    let mut page_boxes = Vec::new();
    let mut content_hashes = Vec::new();
    let mut font_resources = Vec::new();

    for page_id in pages.values() {
        let page = document
            .get_object(*page_id)
            .map_err(|error| {
                format!("PDF_A_INTEGRITY_FAILED: PDF-Seite konnte nicht gelesen werden: {error}")
            })?
            .as_dict()
            .map_err(|_| "PDF_A_INTEGRITY_FAILED: PDF-Seite ist nicht lesbar.".to_string())?;
        let media_box = page
            .get(b"MediaBox")
            .map_err(|_| "PDF_A_INTEGRITY_FAILED: MediaBox fehlt.".to_string())
            .and_then(assert_a5_box)?;
        let crop_box = page
            .get(b"CropBox")
            .map_err(|_| "PDF_A_INTEGRITY_FAILED: CropBox fehlt.".to_string())
            .and_then(assert_a5_box)?;
        page_boxes.push(PageBoxEvidence {
            media_box: format!("{media_box:?}"),
            crop_box: format!("{crop_box:?}"),
        });
        content_hashes.push(page_content_hashes(document, page)?);
        font_resources.push(page_font_resources(document, page)?);
    }

    Ok(PdfAIntegrityEvidence {
        page_count: pages.len(),
        page_boxes,
        decoded_page_content_hashes: content_hashes,
        image_stream_hashes: image_stream_hashes(document),
        font_resources,
    })
}

fn add_pdfa_xmp_metadata(document: &mut Document) -> Result<(), String> {
    let metadata_id = document.new_object_id();
    let xmp = pdfa_xmp_packet();
    let stream = Stream::new(
        dictionary! {
            "Type" => "Metadata",
            "Subtype" => "XML"
        },
        xmp.into_bytes(),
    );
    document.objects.insert(metadata_id, Object::Stream(stream));
    catalog_dict_mut(document)?.set("Metadata", Object::Reference(metadata_id));
    Ok(())
}

fn add_deterministic_trailer_id(document: &mut Document, source_bytes: &[u8]) {
    let digest = Sha256::digest(source_bytes);
    let id = digest[..16].to_vec();
    document.trailer.set(
        "ID",
        Object::Array(vec![
            Object::String(id.clone(), StringFormat::Hexadecimal),
            Object::String(id, StringFormat::Hexadecimal),
        ]),
    );
}

fn add_rgb_output_intent(document: &mut Document, profile_id: ObjectId) -> Result<(), String> {
    let output_intent_id = document.new_object_id();
    document.objects.insert(
        output_intent_id,
        Object::Dictionary(dictionary! {
            "Type" => "OutputIntent",
            "S" => "GTS_PDFA1",
            "OutputConditionIdentifier" => Object::string_literal("sRGB IEC61966-2.1"),
            "Info" => Object::string_literal("sRGB IEC61966-2.1"),
            "DestOutputProfile" => Object::Reference(profile_id)
        }),
    );
    catalog_dict_mut(document)?.set(
        "OutputIntents",
        Object::Array(vec![Object::Reference(output_intent_id)]),
    );
    Ok(())
}

fn normalize_interpolate_flags(document: &mut Document) -> Result<usize, String> {
    let mut changed = 0;
    for object in document.objects.values_mut() {
        if let Object::Stream(stream) = object {
            if is_image_stream(stream) {
                match stream.dict.get(b"Interpolate") {
                    Ok(Object::Boolean(true)) => {
                        stream.dict.set("Interpolate", false);
                        changed += 1;
                    }
                    Ok(Object::Boolean(false)) | Err(_) => {}
                    Ok(_) => {
                        return Err(
                            "PDF_A_INTERPOLATE_FAILED: Bildglättungseintrag ist nicht lesbar."
                                .into(),
                        );
                    }
                }
            }
        }
    }
    Ok(changed)
}

fn find_suitable_srgb_icc_profile(document: &Document) -> Result<ObjectId, String> {
    let mut candidates = document
        .objects
        .iter()
        .filter_map(|(id, object)| match object {
            Object::Stream(stream) if is_suitable_srgb_icc_stream(stream) => Some(*id),
            _ => None,
        })
        .collect::<Vec<_>>();
    candidates.sort();
    candidates.into_iter().next().ok_or_else(|| {
        "PDF_A_OUTPUT_INTENT_UNAVAILABLE: Kein geeignetes eingebettetes sRGB-Profil gefunden."
            .to_string()
    })
}

fn is_suitable_srgb_icc_stream(stream: &Stream) -> bool {
    let n_is_rgb = matches!(stream.dict.get(b"N"), Ok(Object::Integer(3)));
    let alternate_is_rgb = stream
        .dict
        .get(b"Alternate")
        .ok()
        .and_then(|object| object.as_name().ok())
        .is_some_and(|name| name == b"DeviceRGB");
    n_is_rgb && (alternate_is_rgb || String::from_utf8_lossy(&stream.content).contains("sRGB"))
}

fn has_interpolate_true(document: &Document) -> bool {
    document.objects.values().any(|object| match object {
        Object::Stream(stream) if is_image_stream(stream) => {
            matches!(stream.dict.get(b"Interpolate"), Ok(Object::Boolean(true)))
        }
        _ => false,
    })
}

fn is_image_stream(stream: &Stream) -> bool {
    stream
        .dict
        .get(b"Subtype")
        .ok()
        .and_then(|object| object.as_name().ok())
        .is_some_and(|name| name == b"Image")
}

fn assert_pdfa_integrity_unchanged(
    before: &PdfAIntegrityEvidence,
    after: &PdfAIntegrityEvidence,
) -> Result<(), String> {
    if before.page_count != after.page_count {
        return Err("PDF_A_INTEGRITY_FAILED: Seitenzahl wurde verändert.".into());
    }
    if before.page_boxes != after.page_boxes {
        return Err("PDF_A_INTEGRITY_FAILED: A5-Seitenboxen wurden verändert.".into());
    }
    if before.decoded_page_content_hashes != after.decoded_page_content_hashes {
        return Err("PDF_A_INTEGRITY_FAILED: Seiteninhalt wurde verändert.".into());
    }
    if before.image_stream_hashes != after.image_stream_hashes {
        return Err("PDF_A_INTEGRITY_FAILED: Bilddaten wurden verändert.".into());
    }
    if before.font_resources != after.font_resources {
        return Err("PDF_A_INTEGRITY_FAILED: Schriften wurden verändert.".into());
    }
    Ok(())
}

fn page_content_hashes(document: &Document, page: &Dictionary) -> Result<Vec<String>, String> {
    let contents = page
        .get(b"Contents")
        .map_err(|_| "PDF_A_INTEGRITY_FAILED: Seiteninhalt fehlt.".to_string())?;
    let mut streams = Vec::new();
    collect_content_streams(document, contents, &mut streams)?;
    if streams.is_empty() {
        return Err("PDF_A_INTEGRITY_FAILED: Seiteninhalt fehlt.".into());
    }
    Ok(streams.iter().map(|content| sha256_hex(content)).collect())
}

fn collect_content_streams(
    document: &Document,
    object: &Object,
    streams: &mut Vec<Vec<u8>>,
) -> Result<(), String> {
    match object {
        Object::Reference(id) => {
            let object = document.get_object(*id).map_err(|error| {
                format!("PDF_A_INTEGRITY_FAILED: Seiteninhalt konnte nicht gelesen werden: {error}")
            })?;
            collect_content_streams(document, object, streams)
        }
        Object::Array(items) => {
            for item in items {
                collect_content_streams(document, item, streams)?;
            }
            Ok(())
        }
        Object::Stream(stream) => {
            let content = stream.decompressed_content().map_err(|error| {
                format!(
                    "PDF_A_INTEGRITY_FAILED: Seiteninhalt konnte nicht dekodiert werden: {error}"
                )
            })?;
            streams.push(content);
            Ok(())
        }
        _ => Err("PDF_A_INTEGRITY_FAILED: Seiteninhalt ist nicht lesbar.".into()),
    }
}

fn image_stream_hashes(document: &Document) -> BTreeMap<ObjectId, String> {
    document
        .objects
        .iter()
        .filter_map(|(id, object)| match object {
            Object::Stream(stream) if is_image_stream(stream) => {
                Some((*id, sha256_hex(&stream.content)))
            }
            _ => None,
        })
        .collect()
}

fn page_font_resources(document: &Document, page: &Dictionary) -> Result<String, String> {
    let resources = match page.get(b"Resources") {
        Ok(object) => dereference_dict(document, object)?,
        Err(_) => return Ok(String::new()),
    };
    let fonts = match resources.get(b"Font") {
        Ok(object) => dereference_dict(document, object)?,
        Err(_) => return Ok(String::new()),
    };
    let mut entries = Vec::new();
    let mut embedded_objects = BTreeSet::new();
    for (name, font_object) in fonts.iter() {
        entries.push(format!(
            "{}={:?}",
            String::from_utf8_lossy(name),
            font_object
        ));
        collect_font_file_references(document, font_object, &mut embedded_objects)?;
    }
    for object_id in embedded_objects {
        let object = document.get_object(object_id).map_err(|error| {
            format!("PDF_A_INTEGRITY_FAILED: Schrift konnte nicht gelesen werden: {error}")
        })?;
        match object {
            Object::Stream(stream) => {
                entries.push(format!("{object_id:?}:{}", sha256_hex(&stream.content)))
            }
            _ => entries.push(format!("{object_id:?}:{object:?}")),
        }
    }
    entries.sort();
    Ok(entries.join("|"))
}

fn collect_font_file_references(
    document: &Document,
    object: &Object,
    refs: &mut BTreeSet<ObjectId>,
) -> Result<(), String> {
    let object = match object {
        Object::Reference(id) => {
            let resolved = document.get_object(*id).map_err(|error| {
                format!(
                    "PDF_A_INTEGRITY_FAILED: Schriftressource konnte nicht gelesen werden: {error}"
                )
            })?;
            collect_font_file_references(document, resolved, refs)?;
            return Ok(());
        }
        other => other,
    };
    match object {
        Object::Dictionary(dict) => {
            for key in [
                b"FontFile".as_slice(),
                b"FontFile2".as_slice(),
                b"FontFile3".as_slice(),
            ] {
                if let Ok(font_file) = dict.get(key).and_then(Object::as_reference) {
                    refs.insert(font_file);
                }
            }
            for value in dict.iter().map(|(_, value)| value) {
                collect_font_file_references(document, value, refs)?;
            }
        }
        Object::Array(items) => {
            for item in items {
                collect_font_file_references(document, item, refs)?;
            }
        }
        _ => {}
    }
    Ok(())
}

fn catalog_dict(document: &Document) -> Result<&Dictionary, String> {
    let root = document
        .trailer
        .get(b"Root")
        .map_err(|_| "PDF_A_VALIDATION_FAILED: PDF-Katalog fehlt.".to_string())?
        .as_reference()
        .map_err(|_| "PDF_A_VALIDATION_FAILED: PDF-Katalog ist nicht referenziert.".to_string())?;
    document
        .get_object(root)
        .map_err(|error| {
            format!("PDF_A_VALIDATION_FAILED: PDF-Katalog konnte nicht gelesen werden: {error}")
        })?
        .as_dict()
        .map_err(|_| "PDF_A_VALIDATION_FAILED: PDF-Katalog ist nicht lesbar.".to_string())
}

fn catalog_dict_mut(document: &mut Document) -> Result<&mut Dictionary, String> {
    let root = document
        .trailer
        .get(b"Root")
        .map_err(|_| "PDF_A_VALIDATION_FAILED: PDF-Katalog fehlt.".to_string())?
        .as_reference()
        .map_err(|_| "PDF_A_VALIDATION_FAILED: PDF-Katalog ist nicht referenziert.".to_string())?;
    document
        .get_object_mut(root)
        .map_err(|error| {
            format!("PDF_A_VALIDATION_FAILED: PDF-Katalog konnte nicht gelesen werden: {error}")
        })?
        .as_dict_mut()
        .map_err(|_| "PDF_A_VALIDATION_FAILED: PDF-Katalog ist nicht lesbar.".to_string())
}

fn dereference_stream<'a>(
    document: &'a Document,
    object: &'a Object,
) -> Result<&'a Stream, String> {
    let object = match object {
        Object::Reference(id) => document.get_object(*id).map_err(|error| {
            format!("PDF_A_VALIDATION_FAILED: PDF-Stream konnte nicht gelesen werden: {error}")
        })?,
        other => other,
    };
    object
        .as_stream()
        .map_err(|_| "PDF_A_VALIDATION_FAILED: PDF-Stream ist nicht lesbar.".to_string())
}

fn dereference_dict<'a>(
    document: &'a Document,
    object: &'a Object,
) -> Result<&'a Dictionary, String> {
    let object = match object {
        Object::Reference(id) => document.get_object(*id).map_err(|error| {
            format!("PDF_A_VALIDATION_FAILED: PDF-Objekt konnte nicht gelesen werden: {error}")
        })?,
        other => other,
    };
    object
        .as_dict()
        .map_err(|_| "PDF_A_VALIDATION_FAILED: PDF-Objekt ist nicht lesbar.".to_string())
}

fn valid_file_id_object(object: &Object) -> bool {
    matches!(object, Object::String(bytes, StringFormat::Hexadecimal) if bytes.len() == 16)
}

fn assert_a5_box(object: &Object) -> Result<Object, String> {
    let values = object
        .as_array()
        .map_err(|_| "PDF_A_INTEGRITY_FAILED: Seitenbox ist nicht lesbar.".to_string())?;
    if values.len() < 4 {
        return Err("PDF_A_INTEGRITY_FAILED: Seitenbox ist unvollständig.".into());
    }
    let number = |value: &Object| -> Result<f64, String> {
        match value {
            Object::Integer(value) => Ok(*value as f64),
            Object::Real(value) => Ok(*value as f64),
            _ => Err("PDF_A_INTEGRITY_FAILED: Seitenbox enthält keinen numerischen Wert.".into()),
        }
    };
    let x0 = number(&values[0])?;
    let y0 = number(&values[1])?;
    let x1 = number(&values[2])?;
    let y1 = number(&values[3])?;
    let width = (x1 - x0).abs();
    let height = (y1 - y0).abs();
    if (width - A5_WIDTH_PT).abs() > PDF_BOX_TOLERANCE_PT
        || (height - A5_HEIGHT_PT).abs() > PDF_BOX_TOLERANCE_PT
    {
        return Err(format!(
            "PDF_A_INTEGRITY_FAILED: Seitenbox ist {:.3} x {:.3} pt statt A5 {:.3} x {:.3} pt.",
            width, height, A5_WIDTH_PT, A5_HEIGHT_PT
        ));
    }
    Ok(object.clone())
}

fn sha256_hex(bytes: &[u8]) -> String {
    let digest = Sha256::digest(bytes);
    digest.iter().map(|byte| format!("{byte:02x}")).collect()
}

fn pdfa_xmp_packet() -> String {
    r#"<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/"
      xmlns:pdf="http://ns.adobe.com/pdf/1.3/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/">
      <pdfaid:part>2</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
      <pdf:Producer>Northern Lines Studio</pdf:Producer>
      <xmp:CreatorTool>Northern Lines Studio</xmp:CreatorTool>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>"#.into()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn a5_box() -> Object {
        Object::Array(vec![
            Object::Real(0.0),
            Object::Real(0.0),
            Object::Real(A5_WIDTH_PT as f32),
            Object::Real(A5_HEIGHT_PT as f32),
        ])
    }

    fn test_document(include_profile: bool, interpolate: bool) -> Document {
        let mut document = Document::with_version("1.7");
        let catalog_id = document.new_object_id();
        let pages_id = document.new_object_id();
        let page_id = document.new_object_id();
        let content_id = document.new_object_id();
        let image_id = document.new_object_id();
        let font_id = document.new_object_id();
        let font_file_id = document.new_object_id();

        let mut image_dict = dictionary! {
            "Type" => "XObject",
            "Subtype" => "Image",
            "Width" => 1,
            "Height" => 1,
            "ColorSpace" => "DeviceRGB",
            "BitsPerComponent" => 8
        };
        image_dict.set("Interpolate", interpolate);
        document.objects.insert(
            image_id,
            Object::Stream(Stream::new(image_dict, vec![1, 2, 3])),
        );
        document.objects.insert(
            content_id,
            Object::Stream(Stream::new(
                Dictionary::new(),
                b"q 1 0 0 1 10 20 cm /Im1 Do Q".to_vec(),
            )),
        );
        document.objects.insert(
            font_file_id,
            Object::Stream(Stream::new(Dictionary::new(), b"font-bytes".to_vec())),
        );
        document.objects.insert(
            font_id,
            Object::Dictionary(dictionary! {
                "Type" => "Font",
                "Subtype" => "Type1",
                "BaseFont" => "Helvetica",
                "FontDescriptor" => dictionary! {
                    "Type" => "FontDescriptor",
                    "FontName" => "Helvetica",
                    "FontFile" => Object::Reference(font_file_id)
                }
            }),
        );
        document.objects.insert(
            page_id,
            Object::Dictionary(dictionary! {
                "Type" => "Page",
                "Parent" => Object::Reference(pages_id),
                "MediaBox" => a5_box(),
                "CropBox" => a5_box(),
                "Resources" => dictionary! {
                    "XObject" => dictionary! { "Im1" => Object::Reference(image_id) },
                    "Font" => dictionary! { "F1" => Object::Reference(font_id) }
                },
                "Contents" => Object::Reference(content_id)
            }),
        );
        document.objects.insert(
            pages_id,
            Object::Dictionary(dictionary! {
                "Type" => "Pages",
                "Kids" => vec![Object::Reference(page_id)],
                "Count" => 1
            }),
        );
        document.objects.insert(
            catalog_id,
            Object::Dictionary(dictionary! {
                "Type" => "Catalog",
                "Pages" => Object::Reference(pages_id)
            }),
        );
        document.trailer.set("Root", Object::Reference(catalog_id));
        if include_profile {
            let profile_id = document.new_object_id();
            document.objects.insert(
                profile_id,
                Object::Stream(Stream::new(
                    dictionary! {
                        "N" => 3,
                        "Alternate" => "DeviceRGB"
                    },
                    b"sRGB IEC61966-2.1 profile".to_vec(),
                )),
            );
        }
        document
    }

    fn save_document(path: &Path, mut document: Document) {
        document.save(path).expect("save test pdf");
    }

    #[test]
    fn adds_xmp_pdfa_identification_and_trailer_id() {
        let temp = tempfile::tempdir().expect("tempdir");
        let source = temp.path().join("source.pdf");
        let output = temp.path().join("output.pdf");
        save_document(&source, test_document(true, false));

        convert_to_pdfa2b(&source, &output).expect("convert");

        let document = Document::load(&output).expect("load output");
        let catalog = catalog_dict(&document).expect("catalog");
        let metadata = catalog
            .get(b"Metadata")
            .and_then(Object::as_reference)
            .expect("metadata ref");
        let metadata = document
            .get_object(metadata)
            .expect("metadata")
            .as_stream()
            .expect("metadata stream");
        let xmp = String::from_utf8_lossy(&metadata.content);
        assert!(xmp.contains("<pdfaid:part>2</pdfaid:part>"));
        assert!(xmp.contains("<pdfaid:conformance>B</pdfaid:conformance>"));
        assert!(matches!(document.trailer.get(b"ID"), Ok(Object::Array(ids)) if ids.len() == 2));
    }

    #[test]
    fn trailer_id_uses_source_sha256_first_16_bytes() {
        let mut document = test_document(true, false);
        let source = b"source-pdf-bytes";
        add_deterministic_trailer_id(&mut document, source);
        let expected = Sha256::digest(source)[..16].to_vec();
        match document.trailer.get(b"ID").expect("id") {
            Object::Array(ids) => {
                assert_eq!(
                    ids[0],
                    Object::String(expected.clone(), StringFormat::Hexadecimal)
                );
                assert_eq!(ids[1], Object::String(expected, StringFormat::Hexadecimal));
            }
            other => panic!("unexpected ID object {other:?}"),
        }
    }

    #[test]
    fn finds_suitable_embedded_srgb_without_fixed_object_id() {
        let document = test_document(true, false);
        let id = find_suitable_srgb_icc_profile(&document).expect("profile");
        assert!(id.0 > 1);
    }

    #[test]
    fn missing_suitable_profile_fails_truthfully() {
        let document = test_document(false, false);
        let error = find_suitable_srgb_icc_profile(&document).expect_err("missing profile");
        assert!(error.starts_with("PDF_A_OUTPUT_INTENT_UNAVAILABLE"));
    }

    #[test]
    fn adds_rgb_output_intent() {
        let mut document = test_document(true, false);
        let profile_id = find_suitable_srgb_icc_profile(&document).expect("profile");
        add_rgb_output_intent(&mut document, profile_id).expect("intent");

        let catalog = catalog_dict(&document).expect("catalog");
        assert!(catalog.get(b"OutputIntents").is_ok());
    }

    #[test]
    fn normalizes_interpolate_true_without_touching_image_bytes() {
        let mut document = test_document(true, true);
        let before = image_stream_hashes(&document);
        assert!(has_interpolate_true(&document));

        let changed = normalize_interpolate_flags(&mut document).expect("normalize");

        assert_eq!(changed, 1);
        assert!(!has_interpolate_true(&document));
        assert_eq!(image_stream_hashes(&document), before);
    }

    #[test]
    fn conversion_preserves_content_image_pagebox_font_and_page_count_integrity() {
        let temp = tempfile::tempdir().expect("tempdir");
        let source = temp.path().join("source.pdf");
        let output = temp.path().join("output.pdf");
        let document = test_document(true, true);
        let before = collect_pdfa_integrity(&document).expect("before");
        save_document(&source, document);

        let result = convert_to_pdfa2b(&source, &output).expect("convert");
        let after_document = Document::load(&output).expect("load output");
        let after = collect_pdfa_integrity(&after_document).expect("after");

        assert_eq!(result.page_count, 1);
        assert_eq!(result.profile, "PDF/A-2b");
        assert_pdfa_integrity_unchanged(&before, &after).expect("integrity");
    }

    #[test]
    fn invalid_pdf_fails() {
        let temp = tempfile::tempdir().expect("tempdir");
        let source = temp.path().join("invalid.pdf");
        let output = temp.path().join("output.pdf");
        fs::write(&source, b"not pdf").expect("invalid");

        assert!(convert_to_pdfa2b(&source, &output)
            .expect_err("invalid")
            .starts_with("PDF_A_EXPORT_FAILED"));
    }

    #[test]
    fn wrong_geometry_fails() {
        let mut document = test_document(true, false);
        let page_id = *document.get_pages().values().next().expect("page");
        document
            .get_object_mut(page_id)
            .expect("page")
            .as_dict_mut()
            .expect("page dict")
            .set(
                "MediaBox",
                Object::Array(vec![0.into(), 0.into(), 595.into(), 842.into()]),
            );

        let error = collect_pdfa_integrity(&document).expect_err("wrong geometry");
        assert!(error.starts_with("PDF_A_INTEGRITY_FAILED"));
    }
}
