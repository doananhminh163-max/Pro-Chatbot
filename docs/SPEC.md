---
title: Feature Specifications - Pro Chatbot
version: 1.0
date_created: 2026-05-20
last_updated: 2026-05-20
owner: Project maintainers
tags: [design, process, architecture, api, frontend, backend, opencode]
---

# Introduction

This document defines detailed feature specifications for the `report_analizing` repository. It is written for developers and AI coding agents that need a precise, self-contained description of expected behavior before changing code.

The application is a local-first web interface for controlling an OpenCode runtime from a React frontend and Express backend. The backend exposes REST APIs under `/api`, reads runtime data from OpenCode where possible, writes proposed filesystem changes only through preview/apply flows for risky config changes, and keeps preview/apply metadata in memory while file backups remain on disk.

## 1. Purpose & Scope

### 1.1 Purpose

This specification defines:

- The behavior expected from each implemented feature area.
- The backend API and frontend surface associated with each feature.
- Safety, validation, and data-contract requirements.
- Acceptance criteria and test automation strategy for handoff.
- Gaps that current documentation should address.

### 1.2 In Scope

- System health and app-state aggregation.
- Project and OpenCode server connection visibility.
- Config preview, apply, backup, rollback, and instruction file upload.
- Chat runtime, streaming responses, slash commands, file references, and config intent proposals.
- Chat session listing, detail, rename, archive, delete, and export.
- Agent listing, detail, create/update proposals, default agent proposals, and delete behavior.
- Tool and permission listing plus permission update proposals.
- Skill listing, detail, validation, import proposals, external search, global install, marketplace preview/install, status update, and delete behavior.
- MCP server listing, marketplace search, runtime checks, install, create/update proposals, test, and delete behavior.
- Command listing, detail, create, template preview, and delete behavior.
- Audit logs and risk queue presentation.
- Settings modal and config form proposal flow.

### 1.3 Out of Scope

- Adding a local database layer.
- Persisting preview/apply metadata across backend restarts.
- Implementing a full AI planner for natural language config mutation beyond the current keyword-based intent parser.
- Replacing OpenCode as the source of truth for projects, agents, commands, sessions, models, providers, skills, or MCP runtime status.
- Adding authentication or multi-user authorization beyond existing CORS and local server assumptions.

## 2. Definitions

| Term | Definition |
| --- | --- |
| App state | Aggregated dashboard payload returned by `GET /api/app-state`. |
| Config change | In-memory preview record containing diff, target file, risk level, status, and optional before/after content. |
| OpenCode server | Runtime HTTP server used for project, config, agent, command, session, model, provider, and MCP data. |
| Project | Current OpenCode project/worktree. The UI treats the current project as the primary workspace. |
| Preview/apply flow | Safe workflow where a proposed file/config change creates a diff first, then writes only after explicit apply. |
| Risk level | One of `low`, `medium`, `high`, or `critical`, derived from content, target file, permissions, MCP, secrets, and lockfiles. |
| Session | OpenCode chat session exposed through backend session endpoints. |
| Skill | Directory containing a `SKILL.md` file with required frontmatter. |
| MCP | Model Context Protocol server configuration exposed through OpenCode config and runtime. |
| Volatile metadata | In-memory backend state for config changes, backup metadata, marketplace cache, skill overrides, and audit logs. |

## 3. System-Wide Requirements, Constraints & Guidelines

### 3.1 Requirements

- **SYS-REQ-001**: All application APIs shall be mounted under `/api`.
- **SYS-REQ-002**: Successful JSON responses shall use `{ "success": true, "data": ... }` with optional `meta`.
- **SYS-REQ-003**: Error JSON responses shall use `{ "success": false, "error": { "code", "message", "details" }, "meta": { "requestId" } }`.
- **SYS-REQ-004**: The backend shall prefer OpenCode APIs over local files when runtime data is available.
- **SYS-REQ-005**: The frontend API client shall throw a user-readable error when `success` is false, `data` is absent, or HTTP status is non-2xx.
- **SYS-REQ-006**: Risky config mutations shall expose a diff before applying filesystem writes.
- **SYS-REQ-007**: Applied config changes shall create a backup before writing the target file.
- **SYS-REQ-008**: Paths supplied by clients shall resolve inside the current project root unless explicitly designed as trusted global paths.
- **SYS-REQ-009**: Secrets shall not be written as plaintext into OpenCode config, MCP headers, docs, examples, or backend `.env`.
- **SYS-REQ-010**: Backend behavior shall remain usable when OpenCode is temporarily offline if a local filesystem fallback is available.

### 3.2 Constraints

- **SYS-CON-001**: Preview/apply metadata is transient and lost when the backend process restarts.
- **SYS-CON-002**: Backup files persist under `.pro-chatbot/backups`, but backup metadata is volatile.
- **SYS-CON-003**: The current backend default port is `8080`.
- **SYS-CON-004**: The current frontend dev port is `5173`.
- **SYS-CON-005**: The CORS allowlist is explicitly defined in `backend/src/app.ts`.
- **SYS-CON-006**: The Vite proxy forwards `/api` to `http://localhost:8080`.
- **SYS-CON-007**: The backend shall not add a database unless the task explicitly requests it.

### 3.3 Interfaces & Data Contracts

Common success envelope:

```json
{
  "success": true,
  "data": {}
}
```

Common error envelope:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": {}
  },
  "meta": {
    "requestId": "req_..."
  }
}
```

Config change contract:

```json
{
  "id": "chg_...",
  "projectId": "prj_...",
  "type": "config.update",
  "summary": "Update OpenCode config",
  "targetFile": "opencode.json",
  "diff": "--- before\n+++ after\n...",
  "riskLevel": "medium",
  "status": "previewed",
  "warnings": [],
  "createdAt": "2026-05-20T00:00:00.000Z",
  "appliedAt": "2026-05-20T00:00:00.000Z"
}
```

## 4. Feature Specifications

## 4.1 FEA-01: System Health & App State

### Purpose

Provide a single low-latency status surface for the frontend shell and dashboard-derived UI.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-01-REQ-001 | `GET /api/health` shall return service status, version, and server time. |
| FEA-01-REQ-002 | `GET /api/app-state` shall return current project metadata, navigation badges, dashboard metrics, config files, agents, permissions, skills, marketplace items, MCP servers, commands, models, providers, sessions, audit, and settings. |
| FEA-01-REQ-003 | App-state aggregation shall collect OpenCode runtime data where available and fall back to filesystem scanning where supported. |
| FEA-01-REQ-004 | App-state aggregation shall include risk queue items derived from config health, high-risk permissions, MCP server risk, and git working tree status. |
| FEA-01-REQ-005 | The frontend shall use app state as the initial source for shell navigation, page data, badges, settings, and dashboard-like metrics. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check. |
| GET | `/api/app-state` | Full app-state snapshot. |

### Acceptance Criteria

- **FEA-01-AC-001**: Given the backend is running, when `GET /api/health` is called, then the response has `success: true` and `data.status: "ok"`.
- **FEA-01-AC-002**: Given the frontend loads, when `fetchAppData()` succeeds, then navigation, page data, and settings render from `AppState`.
- **FEA-01-AC-003**: Given OpenCode is offline but project files are readable, when app-state is collected, then file-derived sections still return without crashing.

### Test Automation Strategy

- Unit test `getWorkspaceAppState()` with mocked OpenCode success and failure.
- Integration test `GET /api/health` and `GET /api/app-state`.
- Frontend smoke test app shell loading, refresh action, and global error rendering.

## 4.2 FEA-02: Project & OpenCode Server Connection

### Purpose

Expose the current OpenCode project and local server connection status without maintaining a separate project database.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-02-REQ-001 | Project listing shall prefer OpenCode `/project` and fall back to the current workspace record. |
| FEA-02-REQ-002 | Project creation and deletion through this UI shall return `405` because projects are managed by OpenCode. |
| FEA-02-REQ-003 | Server connection creation through this UI shall return `405` because connection settings come from `opencode.json`. |
| FEA-02-REQ-004 | Server health testing shall call OpenCode health and return status, base URL, latency, and version. |
| FEA-02-REQ-005 | The backend shall start a local OpenCode server when the configured URL is local and offline. |
| FEA-02-REQ-006 | Authentication failures from OpenCode shall be surfaced as `OPENCODE_AUTH_FAILED`. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/projects` | List OpenCode projects. |
| POST | `/api/projects` | Unsupported mutation endpoint. |
| GET | `/api/projects/:projectId/status` | Project config and server status. |
| DELETE | `/api/projects/:projectId` | Unsupported mutation endpoint. |
| GET | `/api/projects/:projectId/server-connections` | List derived server connection records. |
| POST | `/api/projects/:projectId/server-connections` | Unsupported mutation endpoint. |
| POST | `/api/projects/:projectId/server-connections/:connectionId/test` | Test OpenCode connection. |

### Acceptance Criteria

- **FEA-02-AC-001**: Given OpenCode is online, when listing projects, then OpenCode project data is returned.
- **FEA-02-AC-002**: Given OpenCode is offline, when listing projects, then the current workspace still appears.
- **FEA-02-AC-003**: Given a user attempts to create or delete a project, then the API returns `PROJECT_MUTATION_UNSUPPORTED`.

### Test Automation Strategy

- Integration test project listing with mocked OpenCode.
- Integration test unsupported mutation status codes.
- Unit test local OpenCode base URL derivation from `opencode.json`.

## 4.3 FEA-03: Config Preview, Apply, Backup, Rollback, and Instructions

### Purpose

Allow users to inspect OpenCode config, propose changes, review diffs, apply confirmed changes, and recover from backups.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-03-REQ-001 | Config read shall support `project`, `global`, and `effective` scopes. |
| FEA-03-REQ-002 | Config preview shall accept either raw `content` or a JSON object `patch`. |
| FEA-03-REQ-003 | Patch preview shall deep-merge the patch into current config and remove undefined values before diffing. |
| FEA-03-REQ-004 | Preview shall create a `ConfigChange` with status `previewed`, a unified diff, risk level, and warnings. |
| FEA-03-REQ-005 | Apply shall only accept config changes with status `previewed`. |
| FEA-03-REQ-006 | High and critical risk apply operations shall require explicit confirmation. |
| FEA-03-REQ-007 | Apply shall parse JSON/JSONC target content before writing JSON/JSONC files. |
| FEA-03-REQ-008 | Apply shall create a backup before writing the target file. |
| FEA-03-REQ-009 | Apply shall sync OpenCode project config and restart OpenCode when the change type requires it. |
| FEA-03-REQ-010 | Instruction upload shall accept only `.md` and `.txt`, max 20 files, max 3 MB per file, and write to `.opencode/instructions`. |
| FEA-03-REQ-011 | Rollback shall restore a file from backup content and emit audit metadata. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/projects/:projectId/config` | Read config files by scope. |
| POST | `/api/projects/:projectId/config/preview` | Create preview diff. |
| POST | `/api/projects/:projectId/config/instructions/upload-files` | Upload instruction files. |
| POST | `/api/config-changes/:configChangeId/apply` | Apply previewed config change. |
| GET | `/api/projects/:projectId/config/backups` | List backup metadata. |
| POST | `/api/projects/:projectId/config/rollback` | Restore from backup. |
| GET | `/api/config-changes/:configChangeId` | Get preview/apply record. |
| GET | `/api/projects/:projectId/config-changes` | List current in-memory changes. |

### Acceptance Criteria

- **FEA-03-AC-001**: Given a valid patch, when preview is requested, then no target file is written and a diff is returned.
- **FEA-03-AC-002**: Given a high-risk preview, when apply is requested without confirmation, then the API returns `RISK_CONFIRMATION_REQUIRED`.
- **FEA-03-AC-003**: Given invalid proposed JSON content, when apply is requested for a JSON/JSONC file, then the change becomes failed and no invalid config is written.
- **FEA-03-AC-004**: Given uploaded instruction files with duplicate names, when upload succeeds, then filenames are sanitized and de-duplicated.
- **FEA-03-AC-005**: Given a backup exists, when rollback is requested, then the target file content is replaced with backup content.

### Test Automation Strategy

- Unit test JSONC parsing, patch merge, risk detection, secret detection, and filename sanitization.
- Integration test preview/apply/rollback with a temporary project root.
- Frontend test `ChangePreviewModal` apply behavior and error handling.

## 4.4 FEA-04: Chat Runtime & Natural Language Proposals

### Purpose

Provide a ChatGPT-like interface for sending prompts and commands to OpenCode, including streaming, file references, skills, agents, models, and config proposals.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-04-REQ-001 | Chat page shall create an OpenCode session automatically when a user sends a message without an active session. |
| FEA-04-REQ-002 | Chat messages shall support model and agent selection from app state. |
| FEA-04-REQ-003 | Slash command input shall detect configured commands and pass `command` plus `arguments` to the backend. |
| FEA-04-REQ-004 | Skill slash input shall add selected skills to message options and instruct OpenCode to load them. |
| FEA-04-REQ-005 | File mentions using `@path` shall resolve to project-relative files, read their contents, and send file parts to OpenCode. |
| FEA-04-REQ-006 | File search shall prefer OpenCode `/find/file` and fall back to `rg --files` excluding `node_modules`, `.git`, and `dist`. |
| FEA-04-REQ-007 | Non-streaming send shall return user message, assistant message, OpenCode parts, and optional config proposal. |
| FEA-04-REQ-008 | Streaming send shall expose SSE events: `user`, `assistant_start`, `thinking_delta`, `text_delta`, `done`, and `error`. |
| FEA-04-REQ-009 | Natural language config proposals shall be created only when the message appears to request config mutation. |
| FEA-04-REQ-010 | Current config intent parsing is heuristic and shall be documented as keyword-based until replaced. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/chat/config-intents` | Parse a natural language config intent and create optional preview. |
| GET | `/api/projects/:projectId/chat/files` | Search project files for chat references. |
| POST | `/api/projects/:projectId/chat/sessions/:sessionId/messages` | Send non-streaming prompt or command. |
| POST | `/api/projects/:projectId/chat/sessions/:sessionId/messages/stream` | Send streaming prompt or command. |

### Acceptance Criteria

- **FEA-04-AC-001**: Given no active session, when a message is submitted, then a new OpenCode session is created and navigation updates to that session.
- **FEA-04-AC-002**: Given a message references `@docs/SPEC.md`, when sent, then the backend validates the file is inside the project and includes it as a file part.
- **FEA-04-AC-003**: Given a streaming response, when OpenCode emits text deltas, then the frontend appends deltas without duplicating the assistant message.
- **FEA-04-AC-004**: Given a mutation-like prompt such as "allow bash permission", when sent, then the response includes a `configChangeId` and the preview modal can open.

### Test Automation Strategy

- Unit test slash command parsing and file mention parsing.
- Integration test file search fallback.
- Integration test streaming endpoint with mocked OpenCode SSE.
- Browser test chat submit, streaming render, model/agent selectors, and proposal modal.

## 4.5 FEA-05: Session Management

### Purpose

Let users list, inspect, rename, archive, delete, open, and export OpenCode chat sessions.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-05-REQ-001 | Session list shall be sourced from OpenCode `/session?scope=project&limit=100`. |
| FEA-05-REQ-002 | Session list shall support status filter `all`, `active`, and `archived`. |
| FEA-05-REQ-003 | Session detail shall include the mapped session and mapped messages sorted by creation time. |
| FEA-05-REQ-004 | Rename shall patch the OpenCode session title. |
| FEA-05-REQ-005 | Archive and unarchive shall patch OpenCode session archived time. |
| FEA-05-REQ-006 | Session context update endpoint shall remain compatible but return live OpenCode session data because OpenCode does not expose a generic context patch endpoint. |
| FEA-05-REQ-007 | Delete shall call OpenCode session delete and return `{ deleted: true, id }`. |
| FEA-05-REQ-008 | Export shall return current session detail plus `exportedAt`. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/projects/:projectId/chat/sessions` | List sessions. |
| POST | `/api/projects/:projectId/chat/sessions` | Create session. |
| GET | `/api/projects/:projectId/chat/sessions/:sessionId` | Get session detail. |
| PATCH | `/api/projects/:projectId/chat/sessions/:sessionId` | Rename/archive/unarchive. |
| DELETE | `/api/projects/:projectId/chat/sessions/:sessionId` | Delete session. |
| GET | `/api/projects/:projectId/chat/sessions/:sessionId/export` | Export session JSON. |
| PATCH | `/api/projects/:projectId/chat/sessions/:sessionId/context` | Compatibility no-op returning live session. |

### Acceptance Criteria

- **FEA-05-AC-001**: Given OpenCode has sessions, when the sessions page loads, then sessions are sorted by updated time descending.
- **FEA-05-AC-002**: Given a session is renamed, when the API returns, then the UI refreshes and shows the new title.
- **FEA-05-AC-003**: Given export is clicked, when the API returns detail, then the browser downloads a JSON file.

### Test Automation Strategy

- Integration test list/detail/update/delete/export against mocked OpenCode.
- Frontend component test filters and search.
- Browser test rename/archive/delete/export flows.

## 4.6 FEA-06: Agent Management

### Purpose

Show available OpenCode agents and allow project-level agent changes through safe preview/apply flows where applicable.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-06-REQ-001 | Agent list shall merge OpenCode runtime agents with local project/global agent files and avoid duplicate names. |
| FEA-06-REQ-002 | When OpenCode is unavailable, agent list shall fall back to built-in and local file agents. |
| FEA-06-REQ-003 | Agent detail shall expose mode, description, source path, built-in status, enabled status, model, tools, permission, task permission, sampling fields, and prompt. |
| FEA-06-REQ-004 | Agent create shall sanitize the name and produce a preview change for `.opencode/agents/:name.md`. |
| FEA-06-REQ-005 | Agent update shall produce a preview change, overriding built-in agents through a project file when needed. |
| FEA-06-REQ-006 | Agent delete shall only delete agent files with a file path and shall reject read-only built-ins. |
| FEA-06-REQ-007 | Agent delete shall backup the deleted file and restart OpenCode. |
| FEA-06-REQ-008 | Set default agent shall create a config preview patch `{ agent: agentName }`. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/projects/:projectId/agents` | List agents. |
| POST | `/api/projects/:projectId/agents` | Create agent preview. |
| GET | `/api/projects/:projectId/agents/:agentName` | Agent detail. |
| PATCH | `/api/projects/:projectId/agents/:agentName` | Update agent preview. |
| DELETE | `/api/projects/:projectId/agents/:agentName` | Delete project/global agent file directly with backup. |
| POST | `/api/projects/:projectId/agents/default` | Preview default agent config change. |

### Acceptance Criteria

- **FEA-06-AC-001**: Given a new agent form is submitted, when the backend returns, then a config change diff is shown before writing.
- **FEA-06-AC-002**: Given a built-in agent has no file path, when delete is requested, then the API returns `BUILTIN_AGENT_READONLY`.
- **FEA-06-AC-003**: Given an agent file is deleted, when operation completes, then an audit record and backup path exist in metadata.

### Test Automation Strategy

- Unit test agent markdown frontmatter generation/parsing.
- Integration test create/update preview and delete restrictions.
- Browser test agent create/edit modal and preview modal.

## 4.7 FEA-07: Tool & Permission Management

### Purpose

Display effective tool permissions and allow permission changes through preview/apply.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-07-REQ-001 | Tool list shall include built-in tools and MCP-derived tools from config. |
| FEA-07-REQ-002 | Permission list shall parse `permission` or `permissions` from OpenCode config. |
| FEA-07-REQ-003 | Permission rows shall include tool, project value, global value placeholder, effective value, and risk. |
| FEA-07-REQ-004 | Permission update shall require a plain object `permission`. |
| FEA-07-REQ-005 | Permission update shall create a preview config patch and not write immediately. |
| FEA-07-REQ-006 | Critical permission values shall be surfaced in nav badges and risk queue. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/projects/:projectId/tools` | List available tools. |
| GET | `/api/projects/:projectId/permissions` | List permissions. |
| PATCH | `/api/projects/:projectId/permissions` | Preview permission update. |

### Acceptance Criteria

- **FEA-07-AC-001**: Given config contains `permission.bash = "allow"`, when permissions are listed, then the row risk is high or critical.
- **FEA-07-AC-002**: Given a permission update is submitted, when the API returns, then a diff is shown and the file is not written until apply.
- **FEA-07-AC-003**: Given invalid permission body, when patch is requested, then the API returns `VALIDATION_ERROR`.

### Test Automation Strategy

- Unit test permission risk mapping.
- Integration test permission preview.
- Browser test permission action opens preview modal.

## 4.8 FEA-08: Skill Management & Marketplace

### Purpose

Manage local and global skills, validate `SKILL.md`, search external skill packages, and install marketplace skills safely.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-08-REQ-001 | Skill list shall scan project `.opencode/skills`, project `.agents/skills`, user OpenCode skills, and user `.agents/skills`. |
| FEA-08-REQ-002 | Skill list shall support `scope`, `q`, and `status` filters. |
| FEA-08-REQ-003 | Skill detail shall return frontmatter, body preview, validation result, and source path. |
| FEA-08-REQ-004 | Skill validation shall require non-empty content, `frontmatter.name`, and `frontmatter.description`. |
| FEA-08-REQ-005 | Skill import shall validate content and create a preview change for `.opencode/skills/:directoryName/SKILL.md`. |
| FEA-08-REQ-006 | Skill status update shall update volatile override state, audit the change, and restart OpenCode. |
| FEA-08-REQ-007 | Skill delete shall only remove project skills and user global skills from removable roots. |
| FEA-08-REQ-008 | Skill delete shall copy the skill directory to backup before deletion and restart OpenCode. |
| FEA-08-REQ-009 | External skill find shall run the `skills` CLI and parse package IDs, install counts, URLs, and names. |
| FEA-08-REQ-010 | Global skill install shall require package IDs matching `owner/repo@skill` format and run `skills add ... -g -y`. |
| FEA-08-REQ-011 | Marketplace preview shall return content and validation before project install. |
| FEA-08-REQ-012 | Marketplace install shall import the selected skill as a preview change scoped to the project by default. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/projects/:projectId/skills` | List skills. |
| POST | `/api/skills/find` | Search external skill packages through CLI. |
| POST | `/api/skills/install-global` | Install global skill through CLI. |
| GET | `/api/projects/:projectId/skills/:skillName` | Skill detail. |
| POST | `/api/projects/:projectId/skills/validate` | Validate skill content. |
| POST | `/api/projects/:projectId/skills/import` | Preview project skill import. |
| PATCH | `/api/projects/:projectId/skills/:skillName` | Update volatile skill status. |
| DELETE | `/api/projects/:projectId/skills/:skillName` | Delete removable skill directory. |
| GET | `/api/skills/marketplace` | Search local marketplace candidates. |
| GET | `/api/skills/marketplace/:marketplaceSkillId/preview` | Preview marketplace skill content. |
| POST | `/api/projects/:projectId/skills/install` | Preview install marketplace skill. |
| POST | `/api/skills/marketplace/refresh` | Audit marketplace refresh. |

### Acceptance Criteria

- **FEA-08-AC-001**: Given a skill lacks description frontmatter, when validated, then `DESCRIPTION_REQUIRED` is returned.
- **FEA-08-AC-002**: Given a valid project skill import, when requested, then a preview diff is returned and no skill file is written until apply.
- **FEA-08-AC-003**: Given a non-removable skill source, when delete is requested, then `DELETE_SCOPE_BLOCKED` is returned.
- **FEA-08-AC-004**: Given external CLI fails, when searching skills, then `SKILL_FIND_FAILED` is returned with sanitized stdout/stderr details.

### Test Automation Strategy

- Unit test frontmatter parsing, validation, CLI result parsing, and removable root detection.
- Integration test import preview, delete backup, and marketplace preview/install.
- Browser test skill search, detail modal, import, global install result, and remove behavior.

## 4.9 FEA-09: MCP Server Management & Marketplace Install

### Purpose

List, install, create, update, test, and remove MCP server config while avoiding plaintext secret storage.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-09-REQ-001 | MCP list shall parse `mcp` or `mcpServers` from project config. |
| FEA-09-REQ-002 | MCP marketplace shall merge curated entries with official registry entries and de-duplicate by ID. |
| FEA-09-REQ-003 | Registry search shall cache results for five minutes. |
| FEA-09-REQ-004 | MCP runtime check shall ensure OpenCode is online and return OpenCode MCP status. |
| FEA-09-REQ-005 | Marketplace install shall validate remote URL, create/apply config patch, then try to register runtime MCP with OpenCode. |
| FEA-09-REQ-006 | MCP API keys shall be referenced through environment variables in persisted config. |
| FEA-09-REQ-007 | If an API key is provided during install, it may be used for current runtime registration but shall not be written as plaintext to config. |
| FEA-09-REQ-008 | MCP create shall reject plaintext secret-like header values unless they use `{env:...}` or `{file:...}` references. |
| FEA-09-REQ-009 | MCP create/update shall create preview config patches. |
| FEA-09-REQ-010 | MCP delete shall backup config, remove the MCP key, write config, audit the operation, and restart OpenCode. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/mcp-marketplace` | Search MCP marketplace. |
| GET | `/api/projects/:projectId/mcp-servers` | List project MCP servers. |
| POST | `/api/projects/:projectId/mcp-servers/check` | Check runtime MCP status. |
| POST | `/api/projects/:projectId/mcp-servers/install` | Install marketplace MCP and apply immediately. |
| POST | `/api/projects/:projectId/mcp-servers` | Preview MCP server creation. |
| POST | `/api/projects/:projectId/mcp-servers/:name/test` | Test one MCP server. |
| PATCH | `/api/projects/:projectId/mcp-servers/:name` | Preview MCP update. |
| DELETE | `/api/projects/:projectId/mcp-servers/:name` | Delete MCP config directly with backup. |

### Acceptance Criteria

- **FEA-09-AC-001**: Given a marketplace remote MCP with API key header, when installed with key and env var name, then persisted config contains an env reference and runtime registration can receive the plaintext key only for that request.
- **FEA-09-AC-002**: Given a create request with header value `my-api-key-secret`, when requested, then `SECRET_PLAINTEXT_BLOCKED` is returned.
- **FEA-09-AC-003**: Given a disabled MCP, when tested, then status is `disabled` and no remote fetch is attempted.
- **FEA-09-AC-004**: Given an MCP exists in config, when deleted, then it is removed from config and a backup path is returned.

### Test Automation Strategy

- Unit test registry mapping, env var normalization, secret header rejection, and config key removal.
- Integration test marketplace install with mocked registry/OpenCode.
- Browser test marketplace search/install, runtime check, and remove server.

## 4.10 FEA-10: Command Management

### Purpose

Expose OpenCode and file-based commands and allow project command creation, preview rendering, detail inspection, and deletion.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-10-REQ-001 | Command list shall merge OpenCode runtime commands, project `.opencode/commands`, project `.agents/commands`, and user OpenCode commands. |
| FEA-10-REQ-002 | File commands shall parse frontmatter for description, agent, and model. |
| FEA-10-REQ-003 | Built-in OpenCode commands shall be shown before file commands. |
| FEA-10-REQ-004 | Command create shall sanitize name, require non-empty template, reject duplicates, write `.opencode/commands/:name.md`, and audit create. |
| FEA-10-REQ-005 | Template preview shall replace `$1`, `$2`, and `{0}`, `{1}` style placeholders from provided arguments. |
| FEA-10-REQ-006 | Command detail shall return built-in or file command data by name. |
| FEA-10-REQ-007 | Command delete shall only remove project `.opencode/commands/:name.md`. |
| FEA-10-GAP-001 | Command create/delete currently write directly; if product policy requires preview/apply for all file mutations, these endpoints should be changed to return `ConfigChange` first. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/projects/:projectId/commands` | List commands. |
| POST | `/api/projects/:projectId/commands` | Create project command directly. |
| POST | `/api/projects/:projectId/commands/preview-template` | Render template preview. |
| GET | `/api/projects/:projectId/commands/:name` | Command detail. |
| DELETE | `/api/projects/:projectId/commands/:name` | Delete project command. |

### Acceptance Criteria

- **FEA-10-AC-001**: Given a duplicate project command name, when create is requested, then `COMMAND_ALREADY_EXISTS` is returned.
- **FEA-10-AC-002**: Given template `Run $1 in {1}`, when preview arguments are `["tests", "ci"]`, then placeholders are replaced.
- **FEA-10-AC-003**: Given a built-in command, when delete is requested, then `COMMAND_DELETE_BLOCKED` is returned.

### Test Automation Strategy

- Unit test command markdown generation and template rendering.
- Integration test list/create/detail/delete with temporary command directory.
- Browser test command create and detail/remove actions.

## 4.11 FEA-11: Audit Logs & Risk Queue

### Purpose

Give users traceability for high-impact actions and visible risk indicators in the UI.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-11-REQ-001 | Audit API shall return volatile audit logs filtered by project-associated config changes. |
| FEA-11-REQ-002 | Audit API shall support `targetType`, `targetId`, `page`, and `pageSize`. |
| FEA-11-REQ-003 | Audit records shall be created for apply, rollback, skill status update, skill delete, marketplace refresh, MCP delete, command create, and command delete. |
| FEA-11-REQ-004 | App-state dashboard shall include recent audit derived from git status and commits. |
| FEA-11-REQ-005 | Risk queue shall include config missing/invalid state, high-risk permissions, high-risk MCP servers, and current git working-tree items. |

### Interfaces

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/projects/:projectId/audit-logs` | List volatile audit logs. |

### Acceptance Criteria

- **FEA-11-AC-001**: Given an apply operation succeeds, when audit logs are requested, then an apply record exists for that config change.
- **FEA-11-AC-002**: Given git working tree has modified files, when app-state loads, then recent audit and risk queue can include working-tree items.
- **FEA-11-AC-003**: Given `targetType=skill`, when audit logs are requested, then only skill logs are returned.

### Test Automation Strategy

- Unit test audit filtering.
- Integration test operations that produce audit records.
- Frontend test risk queue and nav badge display.

## 4.12 FEA-12: Settings Modal & Config Forms

### Purpose

Provide form-based config editing for common OpenCode settings while preserving preview/apply.

### Requirements

| ID | Requirement |
| --- | --- |
| FEA-12-REQ-001 | Settings modal shall render only when opened from the header and app state is available. |
| FEA-12-REQ-002 | Config forms shall read current effective config and build editable cards. |
| FEA-12-REQ-003 | Dirty form sections shall be converted into a merged config patch. |
| FEA-12-REQ-004 | Saving settings shall call config preview and open the change preview modal instead of writing immediately. |
| FEA-12-REQ-005 | JSON object fields shall validate with `JSON.parse` before preview is requested. |
| FEA-12-REQ-006 | Provider disable forms shall preserve hidden disabled providers not present in the provider list. |

### Interfaces

| Frontend Module | Backend Interface |
| --- | --- |
| `SettingsModal` / `ConfigSettingsPage` | `POST /api/projects/:projectId/config/preview` |
| `ChangePreviewModal` | `POST /api/config-changes/:configChangeId/apply` |

### Acceptance Criteria

- **FEA-12-AC-001**: Given a settings field changes, when save is clicked, then a config preview opens and the settings modal closes.
- **FEA-12-AC-002**: Given invalid JSON in a JSON field, when save is attempted, then the user sees a validation error and no API request is made.
- **FEA-12-AC-003**: Given multiple dirty cards, when preview is requested, then patches are deep-merged into a single config change.

### Test Automation Strategy

- Unit test patch builders and JSON field parsing.
- Frontend component test dirty state and save behavior.
- Browser test settings modal to preview to apply.

## 5. Cross-Feature Interfaces & Data Contracts

### 5.1 Frontend Navigation

Current route-level pages:

| Nav ID | Path | Page |
| --- | --- | --- |
| `chat` | `/chat`, `/chat/new`, `/chat/:sessionId` | Chat runtime. |
| `agents` | `/agents` | Agent management. |
| `permissions` | `/permissions` | Tools and permissions. |
| `skills` | `/skills` | Skills and external skill search. |
| `mcp` | `/mcp` | MCP servers and marketplace. |
| `commands` | `/commands` | Commands. |
| `sessions` | `/sessions` | Session management. |

Settings are exposed through a modal, not a route-level page.

### 5.2 High-Risk Confirmation

Apply request:

```json
{
  "confirmed": true,
  "confirmationText": "I understand the risk"
}
```

High and critical risk changes shall reject apply when neither explicit confirmation nor the exact confirmation text is provided.

### 5.3 Chat Stream Events

Backend-to-frontend SSE payloads:

```json
{ "type": "user", "message": {} }
{ "type": "assistant_start", "message": {} }
{ "type": "thinking_delta", "delta": "..." }
{ "type": "text_delta", "delta": "..." }
{ "type": "done", "response": {} }
{ "type": "error", "error": { "message": "..." } }
```

### 5.4 File and Secret Handling

- File references shall be project-relative after resolution.
- File references outside project root shall be rejected.
- Chat search shall hide `node_modules`, `.git`, and `dist`.
- MCP secret-like header values shall use `{env:NAME}` or `{file:path}`.
- Docs and examples shall not include real tokens, passwords, API keys, or personal secrets.

## 6. Test Automation Strategy

### 6.1 Unit Tests

Recommended focus:

- JSONC stripping and parsing.
- Config patch merge and diff generation.
- Risk and warning detection.
- Secret detection and MCP header validation.
- Frontmatter parsing and Markdown generation for agents, skills, and commands.
- Skill validation and external skill result parsing.
- Chat file mention and slash command parsing.
- Settings patch builder functions.

### 6.2 Integration Tests

Recommended focus:

- Health and app-state endpoints.
- Config preview/apply/rollback with temporary filesystem.
- Agent create/update preview and delete restrictions.
- Permission preview.
- Skill import/delete and marketplace preview/install.
- MCP marketplace search, create preview, install, check, delete.
- Command create/detail/delete.
- Chat sessions and messages with mocked OpenCode.

### 6.3 End-to-End Tests

Recommended smoke flows:

1. Load app, verify app-state renders.
2. Start new chat, send message, receive response.
3. Send config mutation prompt, verify preview appears, apply preview.
4. Create read-only agent proposal, review diff, apply.
5. Update permission proposal, review diff, apply.
6. Search/install skill and verify preview.
7. Search/install MCP and verify runtime status.
8. Create command, run slash command, delete command.
9. Rename/archive/export/delete session.

## 7. Rationale & Context

- OpenCode is the source of truth for runtime state. The backend should avoid inventing a competing project/session/model/provider store.
- Preview/apply protects users from accidental destructive config changes and gives AI agents a stable handoff workflow.
- Volatile metadata is acceptable for MVP because the source files and backups are the durable artifacts. Documentation must state this clearly to avoid incorrect assumptions.
- Direct write endpoints exist for some lower-level operations. They should be reviewed against the safe-flow rule before expanding behavior.
- Natural language config proposal is currently heuristic. Product language should not imply robust AI planning until the implementation changes.

## 8. Dependencies & External Integrations

### External Systems

- **EXT-001**: OpenCode API server - source of truth for runtime project, config, agents, commands, sessions, models, providers, and MCP status.
- **EXT-002**: Git CLI - used for app-state audit/risk context.
- **EXT-003**: ripgrep (`rg`) - fallback file search for chat references.

### Third-Party Services

- **SVC-001**: Official MCP Registry - used by MCP marketplace search and install resolution.
- **SVC-002**: `skills` CLI package - used by external skill search and global skill install.

### Infrastructure Dependencies

- **INF-001**: Local filesystem - stores OpenCode config, agent files, command files, skill directories, instruction uploads, and backup files.
- **INF-002**: Node.js runtime - required for Express backend and Vite frontend.

### Technology Platform Dependencies

- **PLT-001**: React 19 + Vite + TypeScript frontend.
- **PLT-002**: Express 5 + TypeScript backend.

## 9. Examples & Edge Cases

### 9.1 Config Preview Patch Example

```json
{
  "type": "permission.update",
  "summary": "Update tool permissions",
  "patch": {
    "permission": {
      "bash": "ask"
    }
  }
}
```

### 9.2 Skill Frontmatter Minimum

```md
---
name: project-helper
description: Project-specific workflow helper.
---

# Project Helper

Use this skill for project-specific workflows.
```

### 9.3 MCP Secret Reference

```json
{
  "mcp": {
    "example": {
      "type": "remote",
      "url": "https://example.com/mcp",
      "headers": {
        "Authorization": "Bearer {env:EXAMPLE_MCP_API_KEY}"
      }
    }
  }
}
```

### 9.4 Edge Cases

- OpenCode returns `401`: return `OPENCODE_AUTH_FAILED` and instruct restart/config review.
- OpenCode offline and remote URL is not local: return `OPENCODE_CONNECTION_FAILED`.
- Backend restart after preview: `configChangeId` no longer exists because metadata is volatile.
- Backup file exists but metadata is gone after restart: rollback API cannot list it unless metadata is reconstructed in future work.
- User mentions a file outside project root: reject with `PATH_OUTSIDE_PROJECT`.
- User deletes built-in agent or command: reject because only project files can be removed.
- Skill directory name differs from frontmatter name: validation warning, not necessarily fatal.
- MCP marketplace registry unavailable: curated entries should still be returned.

## 10. Validation Criteria

Before handoff, the following shall be true:

- `npm run dev` starts OpenCode, backend, and frontend.
- `GET /api/health` returns `success: true`.
- `GET /api/app-state` returns a complete `AppState`.
- Config preview returns a diff and does not write files.
- Config apply writes after confirmation and creates backup metadata plus backup file.
- Chat send and streaming endpoints work with the current OpenCode server.
- At least one representative flow from each feature group has been smoke-tested when that group is changed.
- `git diff` contains no plaintext secrets.

## 11. Current Documentation Gap Analysis

This section answers whether existing specification documents need additions.

### 11.1 `docs/API_SPEC.md`

Add or correct the following:

- Document `GET /api/app-state`; it is used by the frontend but absent from the API spec.
- Make the `/api` prefix explicit for all endpoints. The spec currently lists many paths without showing whether `/api` is included.
- Add `POST /api/skills/find` and `POST /api/skills/install-global`.
- Add `GET /api/mcp-marketplace`.
- Add `POST /api/projects/:projectId/mcp-servers/check`.
- Add `POST /api/projects/:projectId/mcp-servers/install`.
- Add `GET /api/projects/:projectId/commands/:name`.
- Add `DELETE /api/projects/:projectId/commands/:name`.
- Clarify that `POST /api/projects/:projectId/commands` writes directly today, while agent/permission/MCP create/update often return preview changes.
- Clarify that `PATCH /api/projects/:projectId/chat/sessions/:sessionId/context` is a compatibility endpoint and currently returns live OpenCode session data without patching OpenCode context.
- Clarify that preview/apply metadata is in-memory and config change IDs are not durable across backend restarts.

### 11.2 `docs/OVERVIEW.md`

Add or correct the following:

- Split feature scope into `implemented MVP`, `partial`, and `future` because the overview contains broad FRs that exceed the current UI/API.
- Mark natural language config automation as heuristic keyword parsing, not a general AI planning engine.
- Mark model/provider management as read/select-oriented in current implementation; full provider CRUD is not implemented.
- Mark TUI config, formatter/LSP/watcher/snapshot management as settings-form or future scope depending on current UI support.
- Clarify that chat sessions are OpenCode sessions, not local database records.
- Clarify that import/export/backup/rollback is partial: config backups exist, session export exists, but durable metadata and full project export are not implemented.

### 11.3 `docs/ARCHITECTURE.md`

Add or correct the following:

- State explicitly that backend state for config changes, backup metadata, skill overrides, marketplace cache, and audit logs is volatile in memory.
- State that backup files persist under `.pro-chatbot/backups`, but metadata does not survive backend restart.
- Add the modular route/controller/service layout now present under `backend/src/routes/api/*` and `backend/src/controllers/api/*`.
- Add OpenCode startup behavior from `runtime.ts`: local server auto-start, auth failure handling, health cache, and restart via `/global/dispose`.
- Add direct-write exceptions for command create/delete, MCP delete, skill delete, and agent delete so architecture diagrams do not imply every mutation uses preview/apply.

### 11.4 `docs/UI_UX.md`

Add or correct the following:

- Align page-level IA with actual navigation: `chat`, `agents`, `permissions`, `skills`, `mcp`, `commands`, and `sessions`.
- Mark Dashboard, standalone Config page, standalone Audit Logs page, and standalone Settings page as future or alternate IA unless routes are added.
- Clarify that Settings is currently a modal and config forms open preview before apply.
- Merge Skill Marketplace expectations into current Skills page behavior or define a future separate marketplace route.
- Merge MCP Marketplace expectations into current MCP page behavior.
- Add streaming states for `thinking_delta`, `text_delta`, done, and stream error.
- Add UX rule for volatile previews: if the backend restarts, stale preview apply should show a clear not-found/error state.

### 11.5 `README.md`

Add or correct the following:

- Add a link to this `docs/SPEC.md`.
- Ensure quick start mentions the three dev processes started by `npm run dev`: OpenCode, backend, and frontend.
- Clarify "upload tài liệu" as instruction file upload to `.opencode/instructions`, not a general document ingestion pipeline.
- Clarify that project creation/deletion and server connection creation are unsupported from this UI because OpenCode owns them.

## 12. Related Specifications / Further Reading

- [API_SPEC.md](./API_SPEC.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [OVERVIEW.md](./OVERVIEW.md)
- [UI_UX.md](./UI_UX.md)
- [README.md](../README.md)
