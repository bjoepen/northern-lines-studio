# ADR-005 – Editorial Grammar Library

## Status

Accepted for Build 005.

## Context

Build 004 established Fjord as Reference World 001, but Studio still understood pages mainly through their page type and role. Northern Lines requires a stronger editorial model: a Destination page is not merely a technical page type, but a story with expected editorial components and a recurring Editorial Frame.

## Decision

Studio introduces a dedicated **Editorial Grammar Library**.

A grammar defines:

- the editorial purpose of a page;
- required and optional Story components;
- recurring Editorial Frame components;
- author-facing labels for validation;
- deterministic editorial completeness.

The first grammar registry contains the nine page grammars already declared by Reference World Fjord:

- Cover
- Welcome
- Contents
- Destination
- Light
- Weather
- Workflow
- Notes
- Closing Memory

Grammar evaluation is deterministic. Build 005 does not use AI scoring.

## Editorial layers

Northern Lines distinguishes responsibilities rather than arbitrary DTP layers:

1. **Editorial Frame** – Header, Footer, dynamic page number and Editorial Companion.
2. **Story** – Hero, titles, text, Knowledge, photography, QR and other page-specific editorial content.
3. **Annotations** – future editing aids; not publication content and not part of Build 005.

## Consequences

- Studio can explain what a page still needs without exposing technical regions or render jobs.
- Reference Worlds own the set of available grammars.
- `.nls` projects record which Story components are present; they do not duplicate grammar definitions.
- Publisher integration remains separate and is not introduced by this ADR.
