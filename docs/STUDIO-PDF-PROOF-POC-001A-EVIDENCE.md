# Studio PDF Proof PoC 001A — Evidence Checklist

## macOS print dialog

Set explicitly:

```text
Paper Size: A5
Scale: 100 %
Fit/Scale to paper: Off
```

Save as PDF and compare against the same Golden Build 040 page in Studio.

PASS requires:

- A5 page in the saved PDF;
- no A4 canvas around the Studio page;
- title/body/accent/quiet colors materially match Studio;
- identical line breaks;
- identical hero/image geometry;
- identical companion and footer positions;
- unchanged safe zones.

This is a visual proof, not production/prepress output.
