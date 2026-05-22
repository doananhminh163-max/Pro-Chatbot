---
goal: OpenCode TUI Native Assignment Parity
version: 1.0
date_created: 2026-05-22
last_updated: 2026-05-22
owner: local
status: 'Planned'
tags: ['feature', 'opencode', 'chat', 'tui-parity']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan implements native OpenCode TUI assignment parity in Pro Chatbot for slash commands, native skill command/tool behavior, and `@file` / `@folder` context references. The implementation must preserve OpenCode as the runtime source of truth and must not silently convert native assignment semantics into plain prompt text.

## 1. Requirements & Constraints

- **REQ-001**: The chat composer must use `/` as the primary palette for both OpenCode commands and OpenCode-native skill commands.
- **REQ-002**: The backend command list must include all command records returned by OpenCode `GET /command`, including records whose `source` is `command`, `skill`, `mcp`, or another OpenCode-provided source.
- **REQ-003**: Submitting a slash item must call OpenCode `POST /session/:sessionID/command` with `command` and `arguments`.
- **REQ-004**: Skill assignment must not read `SKILL.md` and must not inject `## Skill:` blocks into prompt text.
- **REQ-005**: The chat composer must support `@file` and `@folder` autocomplete.
- **REQ-006**: File references must be sent as OpenCode-native file attachments or file parts.
- **REQ-007**: Directory references must be sent as OpenCode-native local references using `PromptReferenceAttachment` with `kind: "local"`.
- **REQ-008**: Non-command chat prompts must use OpenCode v2 `POST /api/session/:sessionID/prompt` with `prompt.text`, `prompt.files`, and `prompt.references`.
- **REQ-009**: Command prompts must continue to use OpenCode `POST /session/:sessionID/command`.
- **REQ-010**: If OpenCode does not support `command + directory reference`, the backend must return a deterministic validation error instead of approximating the directory as text.
- **REQ-011**: The existing `/api/projects/:projectId/chat/files` endpoint must remain available as a file-only compatibility alias.
- **REQ-012**: A new `/api/projects/:projectId/chat/references` endpoint must return both files and directories.
- **SEC-001**: Reference normalization must reject paths outside the project root.
- **SEC-002**: Reference normalization must reject `.git` paths and other paths already hidden by existing chat search visibility rules.
- **CON-001**: Do not revert or overwrite unrelated dirty worktree changes.
- **CON-002**: Do not introduce a local database layer.
- **CON-003**: Keep API response envelopes consistent with existing success and error shapes.
- **PAT-001**: Route changes must follow the existing controller/service split in `backend/src/controllers/api/chat.controller.ts`, `backend/src/routes/api/chat.routes.ts`, and `backend/src/services/opencode-control.service.ts`.
- **PAT-002**: Frontend API calls must go through `frontend/src/services/appDataService.ts`.
- **PAT-003**: Frontend payload types must be defined in `frontend/src/types/appData.ts`.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Add native reference and command/skill data contracts without changing UI behavior.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | In `frontend/src/types/appData.ts`, add `ChatContextReference` with fields `path: string`, `name?: string`, `mime?: string`, and `type: "file" \| "directory"`. Keep `ChatFileReference` as a compatibility alias or separate legacy type. | | |
| TASK-002 | In `frontend/src/types/appData.ts`, extend `ChatSubmitOptions` with `references?: ChatContextReference[]` while keeping `files?: ChatFileReference[]` accepted for compatibility. | | |
| TASK-003 | In `backend/src/services/opencode-control.service.ts`, replace backend `ChatRequestFile` with `ChatContextReferenceInput` that accepts `path`, `name`, `mime`, and `type`. Preserve `files` compatibility by mapping legacy file inputs to `type: "file"`. | | |
| TASK-004 | In `backend/src/services/opencode-control.service.ts`, update `listOpenCodeCommands` so it does not filter out commands by `source === "command"`. It must map every OpenCode command record with a non-empty `name`. | | |
| TASK-005 | In `backend/src/services/workspace.service.ts`, update `collectOpenCodeCommands` with the same no-source-filter behavior so app-state exposes native skill command records. | | |

### Implementation Phase 2

- GOAL-002: Implement backend reference search and native OpenCode prompt/command payload builders.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-006 | Add `normalizeChatReference(project, input)` in `backend/src/services/opencode-control.service.ts`. It must resolve project-relative paths, reject paths outside `project.rootPath`, read `fs.stat`, infer missing `type`, and return `{ absolutePath, relativePath, type, name, mime }`. | | |
| TASK-007 | Add `normalizeChatReferences(project, message, options)` that combines `options.references`, legacy `options.files`, and explicit `@path` tokens from message text. It must dedupe by lowercased relative path and type. | | |
| TASK-008 | Add `searchChatReferences(projectId, query)` in `backend/src/services/opencode-control.service.ts`. It must call OpenCode `/find/file` once with `type=directory` and once with `type=file`, merge directories before files, apply visibility filters, and cap results by `limit`. | | |
| TASK-009 | Keep `searchChatFiles(projectId, query)` as file-only compatibility by delegating to the new reference search and filtering `type === "file"`. | | |
| TASK-010 | Add `buildPromptFileAttachments(project, references)` that reads file content through OpenCode-native `PromptFileAttachment` shape using `uri`, `mime`, `name`, and `source: { start, end, text }`. | | |
| TASK-011 | Add `buildPromptReferenceAttachments(project, references)` for directories using `{ name, kind: "local", uri, target, targetUri, source }` based on `PromptReferenceAttachment`. | | |
| TASK-012 | Add `buildCommandFileParts(project, references)` for command requests. It must emit only file references in legacy `FilePartInput` shape and must reject directory references with a validation error code such as `COMMAND_DIRECTORY_REFERENCE_UNSUPPORTED`. | | |
| TASK-013 | Replace `buildPromptParts`, `buildOpenCodePromptText`, `buildPromptText`, `selectedSkillBlocks`, and `selectedFileMentions` usage in chat dispatch with native prompt attachment builders. | | |

### Implementation Phase 3

- GOAL-003: Route chat requests through native OpenCode prompt and command APIs.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-014 | Update `promptOpenCodeSession` to call `POST /api/session/:sessionID/prompt` with body `{ prompt: { text, files, references } }`. Keep model and agent behavior only if accepted by the v2 API; otherwise preserve current session-level model/agent behavior. | | |
| TASK-015 | Update `promptOpenCodeSessionAsync` to use the same v2 prompt endpoint and payload as the non-streaming path. | | |
| TASK-016 | Update `commandOpenCodeSession` and `commandOpenCodeSessionAsync` to include `parts: buildCommandFileParts(...)` when file references are present. | | |
| TASK-017 | Ensure command requests with directory references return a 400 error before calling OpenCode. The error message must state that directory references are supported for normal prompts but not command execution. | | |
| TASK-018 | Ensure the user message displayed in the UI remains the original text the user submitted and does not include generated file or skill instruction text. | | |

### Implementation Phase 4

- GOAL-004: Update frontend composer behavior for native commands, skills, and references.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-019 | In `frontend/src/services/appDataService.ts`, add `searchChatReferences(projectId, query, options?)` for `/api/projects/:projectId/chat/references`. Keep `searchChatFiles` unchanged as a compatibility wrapper. | | |
| TASK-020 | In `frontend/src/features/chat/ChatComposer.tsx`, change `ActiveToken.marker` from `"/" \| "$" \| "@"` to `"/" \| "@"` and remove `$` matching. | | |
| TASK-021 | In `ChatComposer`, build slash palette from `commands` only. Display each item with `item.source` label, including `command`, `skill`, and `mcp`. | | |
| TASK-022 | In `ChatComposer`, remove `$skill` submit parsing. `parseChatOptions` must only detect `/name arguments` for slash commands present in the unified command list. | | |
| TASK-023 | In `ChatComposer`, rename selected file state to selected references and support `type: "directory"` with a folder icon. | | |
| TASK-024 | In `ChatComposer`, change placeholder to `Ask OpenCode...  / for commands and skills, @ for files/folders`. | | |
| TASK-025 | In `ChatPage.tsx` and parent call sites, pass `onSearchReferences` or adapt the existing `onSearchFiles` prop so the composer receives both file and folder results. | | |
| TASK-026 | Ensure submit payload sends `references` and only sends legacy `files` if compatibility code explicitly requires it. | | |

### Implementation Phase 5

- GOAL-005: Update API documentation and verification assets.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-027 | Update `docs/API_SPEC.md` chat section to document `references` with `type: "file" \| "directory"` and the new `/chat/references` endpoint. | | |
| TASK-028 | Update `docs/API_SPEC.md` to state that `command + directory reference` returns a deterministic unsupported-combination validation error. | | |
| TASK-029 | Update `README.md` chat workflow to state that file/folder references are sent as OpenCode-native attachments/references. | | |
| TASK-030 | Add focused backend tests for command list source inclusion, native file attachment building, directory reference building, outside-root rejection, and no skill inline injection. | | |
| TASK-031 | Add focused frontend tests for `/` skill command visibility, `@folder` chip rendering, and payload using `references`. | | |

## 3. Alternatives

- **ALT-001**: Keep `$skill` and inline `SKILL.md` content. Rejected because it bypasses OpenCode native skill tool visibility, permissions, and command source of truth.
- **ALT-002**: Keep file references as prompt text instructions such as `Use the read tool for...`. Rejected because OpenCode API does not convert raw `@path` text into native file parts.
- **ALT-003**: Expand selected directories into many file attachments. Rejected because the selected behavior is folder as native reference root, matching the TUI reference-root model more closely.
- **ALT-004**: Route all slash commands through `/tui/execute-command`. Rejected because this app targets headless session execution and already has session-level command flow with response capture.

## 4. Dependencies

- **DEP-001**: Running OpenCode server configured by `opencode.json` at `http://127.0.0.1:4096` for integration probes.
- **DEP-002**: OpenCode OpenAPI schemas in `docs/openapi.md` for `Prompt`, `PromptFileAttachment`, `PromptReferenceAttachment`, `FilePartInput`, and `session.command`.
- **DEP-003**: Existing Express route/controller/service structure under `backend/src/routes/api/chat.routes.ts`, `backend/src/controllers/api/chat.controller.ts`, and `backend/src/services/opencode-control.service.ts`.
- **DEP-004**: Existing React chat composer and service client under `frontend/src/features/chat/ChatComposer.tsx` and `frontend/src/services/appDataService.ts`.

## 5. Files

- **FILE-001**: `backend/src/services/opencode-control.service.ts` - Add native reference search, normalization, payload builders, v2 prompt dispatch, and command file parts.
- **FILE-002**: `backend/src/services/workspace.service.ts` - Preserve OpenCode `/command` source records in app-state.
- **FILE-003**: `backend/src/controllers/api/chat.controller.ts` - Add `references` controller action.
- **FILE-004**: `backend/src/routes/api/chat.routes.ts` - Add `GET /projects/:projectId/chat/references`.
- **FILE-005**: `frontend/src/types/appData.ts` - Add `ChatContextReference` and update chat submit options.
- **FILE-006**: `frontend/src/services/appDataService.ts` - Add `searchChatReferences` and compatibility mapping.
- **FILE-007**: `frontend/src/features/chat/ChatComposer.tsx` - Replace `$skill` UI with native `/` command/skill palette and file/folder reference chips.
- **FILE-008**: `frontend/src/features/chat/ChatPage.tsx` - Wire reference search into the composer.
- **FILE-009**: `docs/API_SPEC.md` - Document new reference request/response behavior.
- **FILE-010**: `README.md` - Update chat workflow summary.
- **FILE-011**: `backend/src/services/opencode-control/*.test.ts` - Add or update focused backend tests.
- **FILE-012**: `frontend/src/features/chat/*.test.ts` - Add or update focused frontend tests.

## 6. Testing

- **TEST-001**: Backend command list includes an OpenCode command fixture with `source: "skill"` and does not filter it out.
- **TEST-002**: Backend skill submission does not include `## Skill:` in any prompt payload and does not call the skill file inline path.
- **TEST-003**: Backend file reference builder produces native file attachment or file part payload with correct `mime`, `name`, `uri`, and source text.
- **TEST-004**: Backend directory reference builder produces `PromptReferenceAttachment` with `kind: "local"`.
- **TEST-005**: Backend rejects references outside `project.rootPath`.
- **TEST-006**: Backend rejects `command + directory reference` with `COMMAND_DIRECTORY_REFERENCE_UNSUPPORTED`.
- **TEST-007**: Frontend `/` palette shows native skill command records returned through unified commands.
- **TEST-008**: Frontend `@docs` search result can render as a directory chip.
- **TEST-009**: Frontend submit payload contains `references` and does not append generated reference instructions to message text.
- **TEST-010**: Runtime smoke test: `GET /api/health` returns success.
- **TEST-011**: Runtime smoke test: `GET /api/app-state` includes command records whose source is not only `command` when OpenCode exposes them.
- **TEST-012**: Runtime smoke test: normal prompt with one file and one directory reference reaches OpenCode v2 prompt endpoint without synthetic prompt text.

## 7. Risks & Assumptions

- **RISK-001**: OpenCode v2 prompt endpoint may return response/event shapes different from legacy `/session/:id/message`. Mitigation: adapt message mapping only after probing the actual response shape.
- **RISK-002**: OpenCode may not support directory references for command execution. Mitigation: return a deterministic validation error and document it.
- **RISK-003**: Existing dirty worktree contains related changes. Mitigation: read current file contents before editing and preserve unrelated modifications.
- **RISK-004**: Frontend tests may not already cover `ChatComposer`. Mitigation: add focused tests at the nearest existing frontend test seam.
- **ASSUMPTION-001**: `http://127.0.0.1:4096` is available for integration verification.
- **ASSUMPTION-002**: Native exact means no fallback that silently changes semantics into plain prompt text.
- **ASSUMPTION-003**: Legacy `files` request payload remains accepted, but new UI sends `references`.
- **ASSUMPTION-004**: The new plan file itself is the only planned artifact created before implementation begins.

## 8. Related Specifications / Further Reading

- **SPEC-001**: `docs/openapi.md` - OpenCode endpoints and schemas for command, skill, prompt, file parts, and references.
- **SPEC-002**: `docs/opencode-doc.md` - OpenCode TUI behavior for slash commands, file references, and agent skills.
- **SPEC-003**: `docs/API_SPEC.md` - Pro Chatbot API contract to update during implementation.
- **SPEC-004**: `README.md` - Pro Chatbot chat workflow overview.
