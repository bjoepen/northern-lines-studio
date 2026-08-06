# `.nls` project format 0.1

## Purpose

Version 0.1 contains only the information required by Build 001. It is not a complete publishing schema.

## Package structure

```text
Project.nls/
├── project.json
└── content/
    └── *.md
```

## Manifest

```json
{
  "format": "northern-lines-studio-project",
  "formatVersion": "0.1",
  "title": "Norwegen Fieldbook",
  "pageSize": {
    "widthMillimetres": 148,
    "heightMillimetres": 210
  },
  "pages": [
    {
      "id": "bergen",
      "title": "Bergen",
      "type": "destination",
      "content": "content/bergen.md"
    }
  ]
}
```

## Rules in 0.1

- `project.json` is mandatory.
- `format` must equal `northern-lines-studio-project`.
- `formatVersion` must equal `0.1`.
- at least one page is required.
- page IDs must be unique.
- page order is the array order.
- paths are relative to the package root.

Content files are referenced but not rendered in Build 001.
