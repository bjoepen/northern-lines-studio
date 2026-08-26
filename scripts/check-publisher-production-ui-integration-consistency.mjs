import fs from 'node:fs';

const app = fs.readFileSync('src/App.svelte', 'utf8');
const pdfProof = fs.readFileSync('src/lib/pdf-proof.ts', 'utf8');

const must = (condition, message) => {
  if (!condition) throw new Error(`Publisher Production UI integration: FAIL — ${message}`);
};

must(app.includes("profile === 'pdfa2b' ? 'document-pdfa2b' : 'document-standard'"), 'Travelbook UI does not delegate to production document modes');
must(app.includes("const isDocumentProduction = mode !== 'reference-pages';"), 'document production mode guard missing');
must(app.includes("visible: isDocumentProduction"), 'document render host is not explicitly onscreen');
must(app.includes("invoke('attach_production_cover_native'"), 'native AppKit cover attach missing');
must(app.includes("invoke('production_cover_progress_direct'"), 'direct Cover progress bridge missing');
must(app.includes("await currentWebview.emitTo(backgroundProofPocReturnTo, eventName, payload);"), 'interactive relay fallback missing');
must(!app.includes("if (relayed) return;\n      await emitBackgroundProofReturnEvent(eventName, payload);"), 'recursive relay fallback remains');
must(app.includes("backgroundProofPocMode !== 'reference-pages'"), 'full document host does not accept standard and PDF/A production modes');
must(app.includes("backgroundProofPocMode === 'document-pdfa2b'\n            ? backgroundProofPoc001BackgroundStandardOutputPath"), 'PDF/A bounded postprocess split missing');
must(pdfProof.includes("mode: 'reference-pages' | 'document-standard' | 'document-pdfa2b';"), 'host mode contract missing document-standard');
must(pdfProof.includes("rawMode === 'document-standard'"), 'host parser missing document-standard');
must(app.includes("curated-cover-preview"), 'Build 042 curated cover marker missing');

console.log('Publisher Production UI Integration Consistency Gate: PASS');
console.log('Studio UI → onscreen Production Host → native Cover → shared Studio renderer → Standard/PDF-A');
