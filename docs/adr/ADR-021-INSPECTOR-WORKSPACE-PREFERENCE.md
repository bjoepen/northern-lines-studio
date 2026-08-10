# ADR-021 – Inspector Width Is a Local Workspace Preference

**Status:** Accepted for Build 023

## Context

The Destination Inspector needs more horizontal room as editorial controls grow, but Inspector geometry is not part of a travel story and must not travel with `.nls` documents.

## Decision

The right Inspector can be resized by dragging its left edge. Studio clamps the width to 320–440 px and may reduce the effective maximum on narrow windows to protect the Canvas. The chosen width is stored locally per user/webview, never in `.nls`.

## Consequences

- the Canvas remains the primary workspace;
- projects remain portable and free of machine-specific chrome state;
- no general pane-layout system is introduced.
