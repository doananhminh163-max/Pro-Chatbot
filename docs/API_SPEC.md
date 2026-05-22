# API_SPEC.md

# REST API Specification - Pro Chatbot

<!-- TOC:START -->
## Mục lục

- [1. Tổng quan](#1-tổng-quan)
- [2. Common conventions](#2-common-conventions)
  - [2.1 Response envelope](#21-response-envelope)
  - [2.2 HTTP status codes](#22-http-status-codes)
  - [2.3 Pagination](#23-pagination)
  - [2.4 Risk confirmation](#24-risk-confirmation)
- [3. Health & system](#3-health-system)
  - [`GET /health`](#get-health)
  - [`GET /app-state`](#get-app-state)
- [4. Project APIs](#4-project-apis)
  - [`GET /projects`](#get-projects)
  - [`POST /projects`](#post-projects)
  - [`GET /projects/:projectId/status`](#get-projectsprojectidstatus)
  - [`DELETE /projects/:projectId`](#delete-projectsprojectid)
- [5. Server connection APIs](#5-server-connection-apis)
  - [`GET /projects/:projectId/server-connections`](#get-projectsprojectidserver-connections)
  - [`POST /projects/:projectId/server-connections`](#post-projectsprojectidserver-connections)
  - [`POST /projects/:projectId/server-connections/:connectionId/test`](#post-projectsprojectidserver-connectionsconnectionidtest)
- [6. Config APIs](#6-config-apis)
  - [`GET /projects/:projectId/config`](#get-projectsprojectidconfig)
  - [`POST /projects/:projectId/config/preview`](#post-projectsprojectidconfigpreview)
  - [`POST /projects/:projectId/config/instructions/upload-files`](#post-projectsprojectidconfiginstructionsupload-files)
  - [`GET /projects/:projectId/changes/review`](#get-projectsprojectidchangesreview)
  - [`POST /projects/:projectId/changes/review/clear`](#post-projectsprojectidchangesreviewclear)
  - [`POST /projects/:projectId/changes/backup`](#post-projectsprojectidchangesbackup)
  - [`POST /config-changes/:configChangeId/apply`](#post-config-changesconfigchangeidapply)
  - [`GET /projects/:projectId/config/backups`](#get-projectsprojectidconfigbackups)
  - [`POST /projects/:projectId/config/rollback`](#post-projectsprojectidconfigrollback)
- [7. Agent APIs](#7-agent-apis)
  - [`GET /projects/:projectId/agents`](#get-projectsprojectidagents)
  - [`POST /projects/:projectId/agents`](#post-projectsprojectidagents)
  - [`GET /projects/:projectId/agents/:agentName`](#get-projectsprojectidagentsagentname)
  - [`PATCH /projects/:projectId/agents/:agentName`](#patch-projectsprojectidagentsagentname)
  - [`DELETE /projects/:projectId/agents/:agentName`](#delete-projectsprojectidagentsagentname)
  - [`POST /projects/:projectId/agents/default`](#post-projectsprojectidagentsdefault)
- [8. Tool & permission APIs](#8-tool-permission-apis)
  - [`GET /projects/:projectId/tools`](#get-projectsprojectidtools)
  - [`GET /projects/:projectId/permissions`](#get-projectsprojectidpermissions)
  - [`PATCH /projects/:projectId/permissions`](#patch-projectsprojectidpermissions)
- [9. Skill APIs](#9-skill-apis)
  - [`GET /projects/:projectId/skills`](#get-projectsprojectidskills)
  - [`POST /skills/find`](#post-skillsfind)
  - [`POST /skills/install-global`](#post-skillsinstall-global)
  - [`GET /projects/:projectId/skills/:skillName`](#get-projectsprojectidskillsskillname)
  - [`POST /projects/:projectId/skills/validate`](#post-projectsprojectidskillsvalidate)
  - [`POST /projects/:projectId/skills/import`](#post-projectsprojectidskillsimport)
  - [`PATCH /projects/:projectId/skills/:skillName`](#patch-projectsprojectidskillsskillname)
  - [`DELETE /projects/:projectId/skills/:skillName`](#delete-projectsprojectidskillsskillname)
- [10. Skill Marketplace APIs](#10-skill-marketplace-apis)
  - [`GET /skills/marketplace`](#get-skillsmarketplace)
  - [`GET /skills/marketplace/:marketplaceSkillId/preview`](#get-skillsmarketplacemarketplaceskillidpreview)
  - [`POST /projects/:projectId/skills/install`](#post-projectsprojectidskillsinstall)
  - [`POST /skills/marketplace/refresh`](#post-skillsmarketplacerefresh)
- [11. MCP APIs](#11-mcp-apis)
  - [`GET /mcp-marketplace`](#get-mcp-marketplace)
  - [`GET /projects/:projectId/mcp-servers`](#get-projectsprojectidmcp-servers)
  - [`POST /projects/:projectId/mcp-servers/check`](#post-projectsprojectidmcp-serverscheck)
  - [`POST /projects/:projectId/mcp-servers/install`](#post-projectsprojectidmcp-serversinstall)
  - [`POST /projects/:projectId/mcp-servers`](#post-projectsprojectidmcp-servers)
  - [`POST /projects/:projectId/mcp-servers/:name/test`](#post-projectsprojectidmcp-serversnametest)
  - [`PATCH /projects/:projectId/mcp-servers/:name`](#patch-projectsprojectidmcp-serversname)
  - [`DELETE /projects/:projectId/mcp-servers/:name`](#delete-projectsprojectidmcp-serversname)
- [12. Command APIs](#12-command-apis)
  - [`GET /projects/:projectId/commands`](#get-projectsprojectidcommands)
  - [`POST /projects/:projectId/commands`](#post-projectsprojectidcommands)
  - [`POST /projects/:projectId/commands/preview-template`](#post-projectsprojectidcommandspreview-template)
  - [`GET /projects/:projectId/commands/:name`](#get-projectsprojectidcommandsname)
  - [`DELETE /projects/:projectId/commands/:name`](#delete-projectsprojectidcommandsname)
- [13. Chatbot automation APIs](#13-chatbot-automation-apis)
  - [`POST /chat/config-intents`](#post-chatconfig-intents)
  - [`GET /projects/:projectId/chat/files`](#get-projectsprojectidchatfiles)
  - [`GET /projects/:projectId/chat/references`](#get-projectsprojectidchatreferences)
  - [`GET /projects/:projectId/chat/sessions`](#get-projectsprojectidchatsessions)
  - [`POST /projects/:projectId/chat/sessions`](#post-projectsprojectidchatsessions)
  - [`GET /projects/:projectId/chat/sessions/:sessionId`](#get-projectsprojectidchatsessionssessionid)
  - [`PATCH /projects/:projectId/chat/sessions/:sessionId`](#patch-projectsprojectidchatsessionssessionid)
  - [`DELETE /projects/:projectId/chat/sessions/:sessionId`](#delete-projectsprojectidchatsessionssessionid)
  - [`GET /projects/:projectId/chat/sessions/:sessionId/export`](#get-projectsprojectidchatsessionssessionidexport)
  - [`PATCH /projects/:projectId/chat/sessions/:sessionId/context`](#patch-projectsprojectidchatsessionssessionidcontext)
  - [`POST /projects/:projectId/chat/sessions/:sessionId/messages`](#post-projectsprojectidchatsessionssessionidmessages)
  - [`POST /projects/:projectId/chat/sessions/:sessionId/messages/stream`](#post-projectsprojectidchatsessionssessionidmessagesstream)
- [14. Audit APIs](#14-audit-apis)
  - [`GET /projects/:projectId/audit-logs`](#get-projectsprojectidaudit-logs)
  - [`GET /config-changes/:configChangeId`](#get-config-changesconfigchangeid)
  - [`GET /projects/:projectId/config-changes`](#get-projectsprojectidconfig-changes)
- [15. Error codes](#15-error-codes)
- [16. Security rules](#16-security-rules)
- [17. OpenAPI skeleton](#17-openapi-skeleton)

<!-- TOC:END -->

## 1. Tổng quan

Backend của Pro Chatbot cung cấp RESTful API bằng **Node.js + Express + TypeScript**. Frontend React Vite gọi API này để quản lý OpenCode project, config, agent, tool/permission, skill, Skill Marketplace, MCP, command, session và audit log.

Base URL mặc định trong local development:

```txt
http://localhost:8080/api
```

All endpoint headings in this document omit the `/api` prefix for readability. For example, `GET /health` maps to the real local URL `GET /api/health`.

Runtime data such as project, agents, commands, chat sessions, models, providers, and MCP status comes from the OpenCode API server whenever possible. Preview/apply metadata, backup indexes, skill overrides, marketplace cache, and audit logs are in-memory backend state; after a backend restart, old `configChangeId` values are no longer valid even though backup files may still exist under `.pro-chatbot/backups`.

API response uses JSON, except chat streaming endpoints that use `text/event-stream`.

---

## 2. Common conventions

### 2.1 Response envelope

#### Success

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

#### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": []
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

### 2.2 HTTP status codes

| Code | Ý nghĩa |
|---:|---|
| `200` | OK. |
| `201` | Created. |
| `202` | Accepted, xử lý async hoặc chờ apply. |
| `204` | No content. |
| `400` | Request không hợp lệ. |
| `401` | Chưa xác thực. |
| `403` | Không đủ quyền hoặc blocked by policy. |
| `404` | Không tìm thấy resource. |
| `409` | Conflict, ví dụ agent/skill đã tồn tại. |
| `422` | Semantic validation failed. |
| `500` | Lỗi server. |
| `502` | Lỗi khi gọi OpenCode server/upstream. |

### 2.3 Pagination

```txt
?page=1&pageSize=20
```

Response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 128
  }
}
```

### 2.4 Risk confirmation

Các endpoint tạo thay đổi rủi ro cao trả về `ConfigChange` ở trạng thái `previewed`. Client phải gọi endpoint apply sau khi user xác nhận.

---

## 3. Health & system

### `GET /health`

Kiểm tra backend API.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "0.1.0",
    "time": "2026-05-13T00:00:00.000Z"
  }
}
```

### `GET /app-state`

Returns the full application snapshot used by the React shell. This endpoint aggregates current project metadata, dashboard metrics, config files, agents, permissions, skills, marketplace items, MCP servers, commands, models, providers, sessions, audit rows, and settings.

The backend prefers OpenCode runtime APIs and falls back to local filesystem or git-derived data where supported.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "generatedAt": "2026-05-20T00:00:00.000Z",
    "project": {
      "id": "prj_01",
      "name": "report_analizing",
      "rootPath": "D:\\Projects\\report_analizing",
      "configPath": "D:\\Projects\\report_analizing\\opencode.json",
      "tuiConfigPath": null,
      "platform": "win32 x64",
      "packageName": "report-analyzing-root",
      "packageVersion": null
    },
    "navBadges": {
      "permissions": 0,
      "audit": 0
    },
    "dashboard": {
      "metrics": [],
      "projectStatus": [],
      "riskQueue": [],
      "recentAudit": []
    },
    "agents": [],
    "permissions": [],
    "skills": [],
    "mcpServers": [],
    "commands": [],
    "models": [],
    "providers": [],
    "sessions": []
  }
}
```

---

## 4. Project APIs

### `GET /projects`

Lấy danh sách project đã đăng ký.

#### Query

| Param | Type | Required | Ghi chú |
|---|---|---:|---|
| `q` | string | No | Tìm theo tên hoặc root path. |
| `page` | number | No | Default `1`. |
| `pageSize` | number | No | Default `20`. |

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "prj_01",
      "name": "Pro Chatbot Demo",
      "rootPath": "/Users/minh/projects/demo",
      "configPath": "/Users/minh/projects/demo/opencode.jsonc",
      "tuiConfigPath": "/Users/minh/projects/demo/tui.json",
      "platform": "macos",
      "createdAt": "2026-05-13T00:00:00.000Z",
      "updatedAt": "2026-05-13T00:00:00.000Z"
    }
  ]
}
```

### `POST /projects`

Unsupported mutation endpoint. Projects are managed by the OpenCode server/current workspace, not by a local project database.

#### Request

```json
{
  "name": "Pro Chatbot Demo",
  "rootPath": "/Users/minh/projects/demo"
}
```

#### Response `405`

```json
{
  "success": false,
  "error": {
    "code": "PROJECT_MUTATION_UNSUPPORTED",
    "message": "Projects are managed by the OpenCode server. Open the directory in OpenCode instead of creating a local database record."
  }
}
```

### `GET /projects/:projectId/status`

Lấy trạng thái project, config và OpenCode server.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "projectId": "prj_01",
    "config": {
      "exists": true,
      "path": "/Users/minh/projects/demo/opencode.jsonc",
      "valid": true
    },
    "tuiConfig": {
      "exists": false,
      "path": null,
      "valid": null
    },
    "openCodeServer": {
      "status": "online",
      "baseUrl": "http://localhost:4096",
      "lastCheckedAt": "2026-05-13T00:00:00.000Z"
    }
  }
}
```

### `DELETE /projects/:projectId`

Unsupported mutation endpoint. Projects are managed by OpenCode and cannot be deleted from this UI.

#### Response `405`

```json
{
  "success": false,
  "error": {
    "code": "PROJECT_MUTATION_UNSUPPORTED",
    "message": "Projects are managed by the OpenCode server and cannot be deleted from this UI."
  }
}
```

---

## 5. Server connection APIs

### `GET /projects/:projectId/server-connections`

Danh sách OpenCode server connections của project.

### `POST /projects/:projectId/server-connections`

Unsupported mutation endpoint. The OpenCode server connection is configured through `opencode.json`, not stored in a local database.

#### Request

```json
{
  "baseUrl": "http://localhost:4096",
  "authMode": "basic",
  "username": "opencode",
  "passwordRef": "{env:OPENCODE_SERVER_PASSWORD}",
  "isDefault": true
}
```

#### Response `405`

```json
{
  "success": false,
  "error": {
    "code": "SERVER_CONNECTION_MUTATION_UNSUPPORTED",
    "message": "The OpenCode server connection is configured through opencode.json, not stored in a local database."
  }
}
```

### `POST /projects/:projectId/server-connections/:connectionId/test`

Test kết nối OpenCode server.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "status": "online",
    "baseUrl": "http://localhost:4096",
    "latencyMs": 35,
    "serverInfo": {
      "version": "unknown"
    }
  }
}
```

---

## 6. Config APIs

### `GET /projects/:projectId/config`

Đọc cấu hình hiện tại.

#### Query

| Param | Type | Required | Ghi chú |
|---|---|---:|---|
| `scope` | string | No | `project`, `global`, `effective`. Default `project`. |

#### Response `200`

```json
{
  "success": true,
  "data": {
    "projectId": "prj_01",
    "scope": "project",
    "files": [
      {
        "path": "opencode.jsonc",
        "kind": "opencode",
        "exists": true,
        "valid": true,
        "content": {
          "model": "opencode/gpt-5",
          "permission": {
            "bash": "ask"
          }
        }
      }
    ]
  }
}
```

### `POST /projects/:projectId/config/preview`

Tạo preview và diff cho một thay đổi config.

#### Request

```json
{
  "type": "permission.update",
  "targetFile": "opencode.jsonc",
  "patch": {
    "permission": {
      "bash": "ask",
      "edit": "ask"
    }
  }
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "configChangeId": "chg_01",
    "type": "permission.update",
    "summary": "Update tool permissions",
    "riskLevel": "high",
    "status": "previewed",
    "targetFile": "opencode.jsonc",
    "diff": "--- opencode.jsonc\n+++ opencode.jsonc\n...",
    "warnings": [
      {
        "code": "HIGH_RISK_PERMISSION",
        "message": "edit permission allows file modification. Confirmation is required."
      }
    ]
  }
}
```

### `POST /projects/:projectId/config/instructions/upload-files`

Upload instruction files vào project để dùng trong `instructions`. Chỉ chấp nhận file `.md` và `.txt`.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "paths": [
      "AGENTS.md",
      "docs/guidelines.md"
    ]
  }
}
```

### `GET /projects/:projectId/changes/review`

Returns OpenCode snapshot diffs for recent project chat messages. This endpoint does not use git worktree status or `/vcs/status`; it reads snapshot data from OpenCode message summaries and `/session/:id/diff?messageID=...`.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "projectId": "prj_01",
    "generatedAt": "2026-05-21T15:00:00.000Z",
    "source": "opencode_snapshot",
    "files": [
      {
        "id": "ses_01:msg_01:src/app.ts",
        "path": "src/app.ts",
        "status": "modified",
        "statusCode": "snapshot",
        "backupEligible": true,
        "diff": "--- src/app.ts\n+++ src/app.ts\n...",
        "warnings": [],
        "sessionId": "ses_01",
        "messageId": "msg_01",
        "additions": 3,
        "deletions": 1
      }
    ],
    "summary": {
      "total": 1,
      "modified": 1,
      "deleted": 0,
      "added": 0,
      "untracked": 0,
      "highRisk": 0
    }
  }
}
```

### `POST /projects/:projectId/changes/review/clear`

Clears OpenCode snapshot review entries while preserving OpenCode sessions and messages. For selected entries it records durable local dismissals under `.pro-chatbot` so cleared snapshots stay hidden after backend restart, and it removes matching `storage/session_diff/ses_*.json` files when available. If the request clears every currently visible snapshot entry for the project, it also removes the project snapshot git repo under `snapshot/:projectId`.

#### Request

```json
{
  "snapshotIds": ["ses_01:msg_01:src/app.ts"]
}
```

If `snapshotIds` is omitted, all currently visible snapshot review entries are deleted.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "projectId": "prj_01",
    "cleared": 1,
    "snapshotIds": ["ses_01:msg_01:src/app.ts"],
    "cleanup": {
      "deletedPaths": [
        "C:\\Users\\Admin\\.local\\share\\opencode\\storage\\session_diff\\ses_01.json"
      ],
      "missingPaths": [],
      "failedPaths": []
    },
    "generatedAt": "2026-05-21T15:01:00.000Z"
  }
}
```

### `POST /projects/:projectId/changes/backup`

Creates a manual backup for selected OpenCode snapshot review entries. When `restore` is `true`, the backend backs up the current files first and then asks OpenCode to revert the earliest selected snapshot message per session.

#### Request

```json
{
  "snapshotIds": ["ses_01:msg_01:src/app.ts"],
  "restore": true
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "backupRoot": ".pro-chatbot/manual-backups/snapshot-review-2026-05-21T15-02-00-000Z",
    "createdAt": "2026-05-21T15:02:00.000Z",
    "backups": [
      {
        "id": "bak_01",
        "snapshotId": "ses_01:msg_01:src/app.ts",
        "filePath": "src/app.ts",
        "status": "modified",
        "currentBackupPath": ".../current-working-tree/src/app.ts",
        "headBackupPath": ".../git-head-original/src/app.ts",
        "patchBackupPath": ".../snapshot-patches/src/app.ts.patch"
      }
    ],
    "restore": {
      "restored": [
        {
          "sessionId": "ses_01",
          "messageId": "msg_01",
          "messageCreatedAt": "2026-05-21T15:00:00.000Z"
        }
      ],
      "failed": []
    }
  }
}
```

### `POST /config-changes/:configChangeId/apply`

Apply thay đổi đã preview.

#### Request

```json
{
  "confirmed": true,
  "confirmationText": "I understand the risk"
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "configChangeId": "chg_01",
    "status": "applied",
    "backups": [
      {
        "id": "bak_01",
        "filePath": "opencode.jsonc",
        "backupPath": ".pro-chatbot/backups/opencode.jsonc.20260513.bak"
      }
    ],
    "verifyResult": {
      "ok": true
    },
    "openCodeSync": {
      "ok": true
    }
  }
}
```

### `GET /projects/:projectId/config/backups`

Danh sách backup.

### `POST /projects/:projectId/config/rollback`

Rollback từ backup.

#### Request

```json
{
  "backupId": "bak_01"
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "status": "rolled_back",
    "backupId": "bak_01"
  }
}
```

---

## 7. Agent APIs

### `GET /projects/:projectId/agents`

Danh sách agent.

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "name": "build",
      "mode": "primary",
      "description": "Default build agent",
      "source": "builtin",
      "enabled": true
    },
    {
      "name": "review",
      "mode": "subagent",
      "description": "Code review without edits",
      "source": "project",
      "filePath": ".opencode/agents/review.md",
      "enabled": true
    }
  ]
}
```

### `POST /projects/:projectId/agents`

Tạo agent mới. Trả về config change preview, chưa ghi file ngay nếu cần xác nhận.

#### Request

```json
{
  "name": "review",
  "description": "Code review without edits",
  "mode": "subagent",
  "model": "opencode/gpt-5",
  "permission": {
    "read": "allow",
    "grep": "allow",
    "glob": "allow",
    "edit": "deny",
    "bash": "deny"
  },
  "prompt": "You are a code reviewer. Do not modify files."
}
```

#### Response `202`

```json
{
  "success": true,
  "data": {
    "configChangeId": "chg_agent_01",
    "status": "previewed",
    "riskLevel": "low",
    "targetFile": ".opencode/agents/review.md",
    "diff": "--- /dev/null\n+++ .opencode/agents/review.md\n..."
  }
}
```

### `GET /projects/:projectId/agents/:agentName`

Chi tiết agent.

### `PATCH /projects/:projectId/agents/:agentName`

Sửa agent.

### `DELETE /projects/:projectId/agents/:agentName`

Xoá agent project/global nếu được phép.

### `POST /projects/:projectId/agents/default`

Đặt default agent.

#### Request

```json
{
  "agentName": "build"
}
```

---

## 8. Tool & permission APIs

### `GET /projects/:projectId/tools`

Danh sách built-in tools, MCP tools và custom tools nếu phát hiện được.

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "name": "bash",
      "source": "builtin",
      "description": "Execute shell commands",
      "riskLevel": "high"
    },
    {
      "name": "skill",
      "source": "builtin",
      "description": "Load an agent skill",
      "riskLevel": "medium"
    }
  ]
}
```

### `GET /projects/:projectId/permissions`

Lấy permission effective/project.

### `PATCH /projects/:projectId/permissions`

Tạo preview cập nhật permission.

#### Request

```json
{
  "scope": "project",
  "permission": {
    "bash": "ask",
    "edit": "ask",
    "skill": "allow"
  }
}
```

#### Response `202`

```json
{
  "success": true,
  "data": {
    "configChangeId": "chg_perm_01",
    "riskLevel": "high",
    "status": "previewed",
    "warnings": [
      {
        "code": "EDIT_PERMISSION_ENABLED",
        "message": "edit permission can modify files."
      }
    ]
  }
}
```

---

## 9. Skill APIs

### `GET /projects/:projectId/skills`

Danh sách skill đang có.

#### Query

| Param | Type | Required | Ghi chú |
|---|---|---:|---|
| `scope` | string | No | `project`, `global`, `claude_compat`, `all`. |
| `q` | string | No | Search theo name/description. |
| `status` | string | No | `valid`, `invalid`, `disabled`, `unknown`. |

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "skl_01",
      "name": "doc-coauthoring",
      "description": "Guide users through a structured workflow for co-authoring documentation.",
      "scope": "project",
      "sourcePath": ".opencode/skills/doc-coauthoring/SKILL.md",
      "status": "valid",
      "hash": "sha256:abc123"
    }
  ]
}
```

### `POST /skills/find`

Searches external skill packages through the local `skills` CLI. The backend validates `skillName`, runs the CLI, strips ANSI output, and parses package rows when possible.

#### Request

```json
{
  "skillName": "doc-coauthoring"
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "query": "doc-coauthoring",
    "command": "npx skills find doc-coauthoring",
    "stdout": "owner/repo@doc-coauthoring  12 installs\nhttps://example.com/repo",
    "stderr": "",
    "items": [
      {
        "package": "owner/repo@doc-coauthoring",
        "name": "doc-coauthoring",
        "installs": "12 installs",
        "url": "https://example.com/repo"
      }
    ]
  }
}
```

### `POST /skills/install-global`

Installs a global skill through the local `skills` CLI. `packageId` must use `owner/repo@skill` format.

#### Request

```json
{
  "packageId": "owner/repo@doc-coauthoring"
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "packageId": "owner/repo@doc-coauthoring",
    "command": "npx skills add owner/repo@doc-coauthoring -g -y",
    "stdout": "Installed",
    "stderr": ""
  }
}
```

### `GET /projects/:projectId/skills/:skillName`

Chi tiết skill.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "name": "doc-coauthoring",
    "frontmatter": {
      "name": "doc-coauthoring",
      "description": "Guide users through a structured workflow for co-authoring documentation."
    },
    "bodyPreview": "# Doc Co-Authoring Workflow\n...",
    "validation": {
      "valid": true,
      "errors": []
    }
  }
}
```

### `POST /projects/:projectId/skills/validate`

Validate nội dung `SKILL.md` trước khi import/install.

#### Request

```json
{
  "content": "---\nname: test-skill\ndescription: Test skill\n---\n# Test Skill\n"
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "valid": true,
    "frontmatter": {
      "name": "test-skill",
      "description": "Test skill"
    },
    "errors": [],
    "warnings": []
  }
}
```

### `POST /projects/:projectId/skills/import`

Import skill từ nội dung do user cung cấp.

#### Request

```json
{
  "scope": "project",
  "directoryName": "test-skill",
  "content": "---\nname: test-skill\ndescription: Test skill\n---\n# Test Skill\n"
}
```

#### Response `202`

```json
{
  "success": true,
  "data": {
    "configChangeId": "chg_skill_import_01",
    "status": "previewed",
    "targetFile": ".opencode/skills/test-skill/SKILL.md",
    "riskLevel": "medium",
    "diff": "--- /dev/null\n+++ .opencode/skills/test-skill/SKILL.md\n..."
  }
}
```

### `PATCH /projects/:projectId/skills/:skillName`

Enable/disable hoặc chỉnh metadata local của skill.

#### Request

```json
{
  "status": "disabled"
}
```

### `DELETE /projects/:projectId/skills/:skillName`

Xoá skill khỏi project/global scope sau xác nhận.

---

## 10. Skill Marketplace APIs

### `GET /skills/marketplace`

Search marketplace candidates. Current implementation builds candidates primarily from global skill directories and cached marketplace records; it is not yet a full public online registry search.

#### Query

| Param | Type | Required | Ghi chú |
|---|---|---:|---|
| `q` | string | Yes | Từ khoá tìm kiếm. |
| `source` | string | No | `github`, `registry`, `web`, `all`. |
| `trustLevel` | string | No | Filter trust level. |
| `page` | number | No | Default `1`. |
| `pageSize` | number | No | Default `20`. |

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "mkt_01",
      "name": "doc-coauthoring",
      "description": "Workflow for collaborative documentation.",
      "sourceUrl": "https://example.com/skills/doc-coauthoring/SKILL.md",
      "author": "example-org",
      "version": "1.0.0",
      "trustLevel": "community",
      "license": "MIT",
      "cachedAt": "2026-05-13T00:00:00.000Z"
    }
  ]
}
```

### `GET /skills/marketplace/:marketplaceSkillId/preview`

Preview skill online trước khi cài.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "mkt_01",
    "name": "doc-coauthoring",
    "sourceUrl": "https://example.com/skills/doc-coauthoring/SKILL.md",
    "trustLevel": "community",
    "content": "---\nname: doc-coauthoring\ndescription: Workflow...\n---\n# Workflow\n...",
    "validation": {
      "valid": true,
      "errors": [],
      "warnings": [
        {
          "code": "UNVERIFIED_SOURCE",
          "message": "This skill comes from a community source. Review before install."
        }
      ]
    }
  }
}
```

### `POST /projects/:projectId/skills/install`

Tạo change set cài skill từ marketplace.

#### Request

```json
{
  "marketplaceSkillId": "mkt_01",
  "scope": "project",
  "directoryName": "doc-coauthoring"
}
```

#### Response `202`

```json
{
  "success": true,
  "data": {
    "configChangeId": "chg_install_01",
    "status": "previewed",
    "riskLevel": "high",
    "targetFile": ".opencode/skills/doc-coauthoring/SKILL.md",
    "diff": "--- /dev/null\n+++ .opencode/skills/doc-coauthoring/SKILL.md\n...",
    "warnings": [
      {
        "code": "MARKETPLACE_INSTALL_REQUIRES_REVIEW",
        "message": "Review SKILL.md content before applying."
      }
    ]
  }
}
```

### `POST /skills/marketplace/refresh`

Refresh cache marketplace. Có thể giới hạn nguồn.

#### Request

```json
{
  "source": "all",
  "force": false
}
```

---

## 11. MCP APIs

### `GET /mcp-marketplace`

Searches curated MCP entries plus the official MCP Registry. Registry responses may be cached briefly by the backend. If the registry is unavailable, curated entries can still be returned.

#### Query

| Param | Type | Required | Ghi chú |
|---|---|---:|---|
| `q` | string | No | Search text. |
| `limit` | number | No | Default `24`, max `60`. |

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "context7",
      "name": "Context7",
      "description": "Documentation MCP server.",
      "url": "https://example.com/mcp",
      "transport": "remote",
      "installable": true,
      "apiKeyEnvVar": "CONTEXT7_API_KEY",
      "apiKeyHeader": "Authorization",
      "risk": "high"
    }
  ]
}
```

### `GET /projects/:projectId/mcp-servers`

Danh sách MCP server.

### `POST /projects/:projectId/mcp-servers/check`

Checks OpenCode runtime MCP status. The backend ensures the configured OpenCode server is online before requesting MCP status.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "health": {
      "status": "online",
      "baseUrl": "http://127.0.0.1:4096",
      "version": "unknown"
    },
    "status": {}
  }
}
```

### `POST /projects/:projectId/mcp-servers/install`

Installs an MCP server from marketplace data. This endpoint creates and applies a config patch immediately, then attempts runtime registration with OpenCode.

Persisted config must use env/file references for secrets. If `apiKey` is supplied, it can be used for current runtime registration but must not be written as plaintext to config.

#### Request

```json
{
  "marketplaceId": "context7",
  "name": "context7",
  "url": "https://example.com/mcp",
  "apiKey": "runtime-only-key",
  "apiKeyEnvVar": "CONTEXT7_API_KEY"
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "change": {
      "id": "chg_01",
      "status": "applied",
      "riskLevel": "high"
    },
    "applyResult": {
      "configChangeId": "chg_01",
      "status": "applied"
    },
    "server": {
      "name": "context7",
      "config": {
        "type": "remote",
        "url": "https://example.com/mcp",
        "enabled": true,
        "headers": {
          "Authorization": "Bearer {env:CONTEXT7_API_KEY}"
        }
      }
    },
    "runtimeStatus": {},
    "runtimeError": null
  }
}
```

### `POST /projects/:projectId/mcp-servers`

Tạo MCP server config preview.

#### Request - remote MCP

```json
{
  "name": "context7",
  "type": "remote",
  "url": "https://context7.example.com/mcp",
  "enabled": false,
  "headers": {
    "Authorization": "{env:CONTEXT7_TOKEN}"
  }
}
```

#### Request - local MCP

```json
{
  "name": "local-docs",
  "type": "local",
  "command": ["node", "./mcp/local-docs.js"],
  "env": {
    "DOCS_PATH": "./docs"
  },
  "enabled": true
}
```

#### Response `202`

```json
{
  "success": true,
  "data": {
    "configChangeId": "chg_mcp_01",
    "status": "previewed",
    "riskLevel": "high",
    "diff": "--- opencode.jsonc\n+++ opencode.jsonc\n..."
  }
}
```

### `POST /projects/:projectId/mcp-servers/:name/test`

Test MCP connection nếu OpenCode SDK/API hỗ trợ.

### `PATCH /projects/:projectId/mcp-servers/:name`

Sửa/bật/tắt MCP server.

### `DELETE /projects/:projectId/mcp-servers/:name`

Xoá MCP server config.

---

## 12. Command APIs

### `GET /projects/:projectId/commands`

Danh sách custom command.

### `POST /projects/:projectId/commands`

Tạo command mới.

#### Request

```json
{
  "name": "test",
  "description": "Run tests with coverage",
  "agent": "build",
  "model": "opencode/gpt-5",
  "template": "Run the full test suite with coverage report and show any failures."
}
```

#### Response `201`

```json
{
  "success": true,
  "data": {
    "name": "test",
    "description": "Run tests with coverage",
    "sourcePath": "D:\\Projects\\report_analizing\\.opencode\\commands\\test.md",
    "preview": "---\ndescription: \"Run tests with coverage\"\n---\nRun the full test suite with coverage report and show any failures.",
    "source": "project",
    "builtIn": false,
    "agent": "build",
    "model": "opencode/gpt-5",
    "template": "Run the full test suite with coverage report and show any failures."
  }
}
```

Note: unlike agent, permission, config, skill import, and MCP create/update flows, current command create writes the project command file directly and records an audit item. Change this endpoint to return a `ConfigChange` first if command writes must follow the same preview/apply policy.

### `POST /projects/:projectId/commands/preview-template`

Preview command template với arguments.

#### Request

```json
{
  "template": "Create a component named $1 in $2",
  "arguments": ["Button", "src/components"]
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "rendered": "Create a component named Button in src/components"
  }
}
```

### `GET /projects/:projectId/commands/:name`

Returns one built-in, global, or project command by name.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "name": "test",
    "description": "Run tests with coverage",
    "sourcePath": ".opencode/commands/test.md",
    "preview": "Run the full test suite...",
    "source": "project",
    "builtIn": false,
    "agent": "build",
    "model": "opencode/gpt-5",
    "frontmatter": {},
    "template": "Run the full test suite..."
  }
}
```

### `DELETE /projects/:projectId/commands/:name`

Deletes only project commands under `.opencode/commands`. Built-in commands and non-project command files are blocked.

#### Response `204`

No response body.

---

## 13. Chatbot automation APIs

### `POST /chat/config-intents`

Parse yêu cầu tự nhiên thành config change proposal.

#### Request

```json
{
  "projectId": "prj_01",
  "message": "Tạo agent review code chỉ được đọc file, không được sửa code và không chạy bash"
}
```

#### Response `202`

```json
{
  "success": true,
  "data": {
    "intent": "agent.create",
    "confidence": 0.91,
    "missingFields": [],
    "configChangeId": "chg_agent_01",
    "proposal": {
      "name": "review",
      "mode": "subagent",
      "permission": {
        "read": "allow",
        "grep": "allow",
        "glob": "allow",
        "edit": "deny",
        "bash": "deny"
      }
    },
    "diff": "--- /dev/null\n+++ .opencode/agents/review.md\n..."
  }
}
```

### `GET /projects/:projectId/chat/files`

Compatibility alias that searches workspace files only for legacy chat `@` references. New clients should use `/chat/references` so directories can be returned alongside files.

#### Query

| Param | Type | Required | Ghi chu |
|---|---|---:|---|
| `q` | string | No | Fuzzy file query. Empty query returns a small file list. |
| `limit` | number | No | Default `30`, max `80`. |

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "path": "docs/openapi.md",
      "name": "openapi.md",
      "mime": "text/markdown"
    }
  ]
}
```

### `GET /projects/:projectId/chat/references`

Search workspace files and directories for chat `@` references. The backend queries OpenCode `/find/file` once with `type=directory` and once with `type=file`, merges directories before files, applies chat visibility filters, and falls back to local path search if OpenCode search is unavailable.

#### Query

| Param | Type | Required | Ghi chu |
|---|---|---:|---|
| `q` | string | No | Fuzzy path query. Empty query returns a small reference list. |
| `limit` | number | No | Default `30`, max `80`. |

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "path": "docs",
      "name": "docs",
      "type": "directory"
    },
    {
      "path": "docs/openapi.md",
      "name": "openapi.md",
      "mime": "text/markdown",
      "type": "file"
    }
  ]
}
```

### `GET /projects/:projectId/chat/sessions`

Lay danh sach chat sessions truc tiep tu OpenCode API server.

#### Query

| Param | Type | Required | Ghi chu |
|---|---|---:|---|
| `status` | string | No | `all`, `active`, `archived`. Default `all`. |

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "sess_01",
      "projectId": "prj_01",
      "openCodeSessionId": "ses_remote_01",
      "title": "Investigate config issue",
      "agent": "build",
      "model": "opencode/gpt-5",
      "skills": ["doc-coauthoring"],
      "mcps": ["context7"],
      "status": "active",
      "messageCount": 4,
      "lastMessageAt": "2026-05-13T00:12:00.000Z",
      "lastMessagePreview": "Current config has one readonly agent..."
    }
  ]
}
```

### `POST /projects/:projectId/chat/sessions`

Tạo session chat/OpenCode.

#### Request

```json
{
  "title": "Investigate config issue",
  "agent": "build",
  "model": "opencode/gpt-5",
  "skills": ["doc-coauthoring", "webapp-testing"],
  "mcps": ["context7", "playwright"]
}
```

#### Response `201`

```json
{
  "success": true,
  "data": {
    "id": "sess_01",
    "projectId": "prj_01",
    "openCodeSessionId": "oc_sess_123",
    "title": "Investigate config issue",
    "agent": "build",
    "model": "opencode/gpt-5",
    "skills": ["doc-coauthoring", "webapp-testing"],
    "mcps": ["context7", "playwright"],
    "status": "active"
  }
}
```

### `GET /projects/:projectId/chat/sessions/:sessionId`

Lay chi tiet mot session va toan bo message tu OpenCode API server.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "sess_01",
      "projectId": "prj_01",
      "openCodeSessionId": "ses_remote_01",
      "title": "Investigate config issue",
      "status": "active",
      "messageCount": 4
    },
    "messages": [
      {
        "id": "msg_01",
        "sessionId": "sess_01",
        "role": "user",
        "content": "Explain current agent configuration",
        "createdAt": "2026-05-13T00:10:00.000Z"
      }
    ]
  }
}
```

### `PATCH /projects/:projectId/chat/sessions/:sessionId`

Cap nhat metadata session thong qua OpenCode API server. `title` va trang thai archive duoc day thang toi remote session.

#### Request

```json
{
  "title": "Review backend session flow",
  "status": "archived",
  "agent": "review",
  "model": "openai/gpt-5.4",
  "skills": ["doc-coauthoring"],
  "mcps": ["context7"]
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "sess_01",
    "title": "Review backend session flow",
    "status": "archived",
    "updatedAt": "2026-05-13T00:14:00.000Z"
  }
}
```

### `DELETE /projects/:projectId/chat/sessions/:sessionId`

Xoa local session va messages tuong ung. Neu session co `openCodeSessionId`, backend co gang xoa remote OpenCode session nhung khong kill OpenCode server.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "deleted": true,
    "id": "sess_01"
  }
}
```

### `GET /projects/:projectId/chat/sessions/:sessionId/export`

Export session thanh payload JSON gom metadata va messages.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "exportedAt": "2026-05-13T00:15:00.000Z",
    "session": {
      "id": "sess_01",
      "title": "Review backend session flow"
    },
    "messages": []
  }
}
```

### `PATCH /projects/:projectId/chat/sessions/:sessionId/context`

Compatibility endpoint for session context updates. Current OpenCode persistence does not expose a general context patch endpoint, so the backend accepts the request body and returns the live OpenCode session source of truth without mutating agent/model/skills/MCP context.

#### Request

```json
{
  "agent": "review",
  "model": "openai/gpt-5.4",
  "skills": ["doc-coauthoring"],
  "mcps": ["context7"]
}
```

#### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "sess_01",
    "agent": "review",
    "model": "openai/gpt-5.4",
    "skills": ["doc-coauthoring"],
    "mcps": ["context7"],
    "updatedAt": "2026-05-13T00:10:00.000Z"
  }
}
```

### `POST /projects/:projectId/chat/sessions/:sessionId/messages`

Runtime fallback: if the current OpenCode runtime rejects the v2 prompt with the response-validation bug `Expected Session.Message, got {}`, text/file-only prompts fall back to legacy `POST /session/:sessionID/message`. Directory references require the v2 prompt endpoint and are not silently downgraded.

Gửi prompt đến OpenCode session. Normal chat prompts use OpenCode v2 `POST /api/session/:sessionID/prompt` with native `prompt.text`, `prompt.files`, and `prompt.references`. Slash commands use OpenCode `POST /session/:sessionID/command` with `command`, `arguments`, and native file parts when file references are present. Legacy `files` is still accepted as file-only compatibility input, but new clients should send `references`.

#### Request

```json
{
  "message": "Explain current agent configuration",
  "attachments": [],
  "agent": "build",
  "model": "openai/gpt-5.4",
  "references": [
    { "path": "docs/openapi.md", "type": "file" },
    { "path": "docs", "type": "directory" }
  ],
  "command": "test",
  "arguments": "backend"
}
```

If `command` is supplied with a directory reference, the backend returns `400` with code `COMMAND_DIRECTORY_REFERENCE_UNSUPPORTED`. Directory references are supported for normal prompts through the OpenCode v2 prompt endpoint, but not command execution or legacy fallback.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "sessionId": "sess_01",
    "openCodeSessionId": "ses_remote_01",
    "userMessage": {
      "role": "user",
      "content": "Explain current agent configuration"
    },
    "assistantMessage": {
      "role": "assistant",
      "content": "Current config has one default model and one review agent..."
    },
    "parts": [
      {
        "type": "text",
        "text": "Current config has one default model and one review agent..."
      }
    ],
    "configChangeId": "chg_agent_01"
  }
}
```

### `POST /projects/:projectId/chat/sessions/:sessionId/messages/stream`

Runtime fallback matches the non-stream endpoint, using legacy `POST /session/:sessionID/prompt_async` for text/file-only prompts when OpenCode rejects the v2 prompt with `Expected Session.Message, got {}`.

Gui prompt den OpenCode session va stream ket qua qua Server-Sent Events. Endpoint nay dung `text/event-stream`, khong dung JSON envelope cho tung chunk. The same request options as the non-stream endpoint are supported. The stream separates reasoning chunks (`thinking_delta`) from main answer chunks (`text_delta`).

#### Request

```json
{
  "message": "Explain current agent configuration",
  "attachments": [],
  "agent": "build",
  "model": "openai/gpt-5.4",
  "references": [
    { "path": "docs/openapi.md", "type": "file" },
    { "path": "docs", "type": "directory" }
  ]
}
```

#### Stream events

Moi SSE event gui mot JSON object trong `data:`:

```json
{ "type": "user", "message": { "role": "user", "content": "Explain current agent configuration" } }
{ "type": "assistant_start", "message": { "role": "assistant", "content": "", "parts": [{ "type": "reasoning", "text": "" }, { "type": "text", "text": "" }] } }
{ "type": "thinking_delta", "delta": "Inspecting current config..." }
{ "type": "text_delta", "delta": "Current config has..." }
{ "type": "done", "response": { "sessionId": "sess_01", "assistantMessage": { "role": "assistant", "content": "Current config has..." } } }
```

Neu co loi sau khi stream da bat dau, backend gui:

```json
{ "type": "error", "error": { "message": "OpenCode chat stream failed" } }
```

---

## 14. Audit APIs

### `GET /projects/:projectId/audit-logs`

Danh sách audit logs.

#### Query

| Param | Type | Required | Ghi chú |
|---|---|---:|---|
| `targetType` | string | No | `config`, `skill`, `agent`, `mcp`, ... |
| `targetId` | string | No | ID target. |
| `page` | number | No | Default `1`. |
| `pageSize` | number | No | Default `20`. |

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "audit_01",
      "actor": "local-user",
      "action": "apply",
      "targetType": "skill",
      "targetId": "skl_01",
      "metadata": {
        "configChangeId": "chg_install_01"
      },
      "createdAt": "2026-05-13T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

### `GET /config-changes/:configChangeId`

Chi tiết một config change.

### `GET /projects/:projectId/config-changes`

Danh sách config changes.

---

## 15. Error codes

| Code | HTTP | Ý nghĩa |
|---|---:|---|
| `VALIDATION_ERROR` | 400 | Request body/query sai schema. |
| `PROJECT_NOT_FOUND` | 404 | Không tìm thấy project. |
| `CONFIG_NOT_FOUND` | 404 | Không tìm thấy config file. |
| `CONFIG_PARSE_ERROR` | 422 | JSON/JSONC parse lỗi. |
| `CONFIG_SCHEMA_ERROR` | 422 | Config sai schema. |
| `RISK_CONFIRMATION_REQUIRED` | 403 | Thay đổi rủi ro cần xác nhận. |
| `SECRET_PLAINTEXT_BLOCKED` | 403 | Phát hiện secret thô. |
| `SKILL_INVALID` | 422 | `SKILL.md` không hợp lệ. |
| `MARKETPLACE_SOURCE_BLOCKED` | 403 | Nguồn marketplace bị block. |
| `OPENCODE_CONNECTION_FAILED` | 502 | Không gọi được OpenCode server. |
| `FILE_WRITE_FAILED` | 500 | Ghi file thất bại. |
| `ROLLBACK_FAILED` | 500 | Rollback thất bại. |

---

## 16. Security rules

1. Không nhận hoặc lưu secret thô nếu chưa có secret store.
2. Các request chứa `apiKey`, `token`, `password` phải được redact trong log.
3. Các thay đổi liên quan `bash`, `edit`, `write`, wildcard `*`, remote MCP, marketplace install phải yêu cầu confirmation.
4. Không cho phép path traversal trong `rootPath`, `targetFile`, `backupPath`, `sourcePath`.
5. File write chỉ được thực hiện trong project root hoặc external directory đã allow.
6. Marketplace source cần allowlist/blocklist và trust metadata.
7. Audit log phải ghi mọi apply/rollback/delete.

---

## 17. OpenAPI skeleton

```yaml
openapi: 3.0.3
info:
  title: Pro Chatbot API
  version: 0.1.0
servers:
  - url: http://localhost:8080/api
paths:
  /health:
    get:
      summary: Health check
      responses:
        '200':
          description: OK
  /app-state:
    get:
      summary: Aggregated frontend app state
  /projects:
    get:
      summary: List projects
    post:
      summary: Register project
  /projects/{projectId}/config:
    get:
      summary: Read project config
  /projects/{projectId}/config/preview:
    post:
      summary: Preview config change
  /projects/{projectId}/changes/review:
    get:
      summary: Review OpenCode snapshot changes
  /projects/{projectId}/changes/review/clear:
    post:
      summary: Clear visible OpenCode snapshot review entries
  /projects/{projectId}/changes/backup:
    post:
      summary: Back up selected OpenCode snapshot changes
  /config-changes/{configChangeId}/apply:
    post:
      summary: Apply previewed config change
  /projects/{projectId}/agents:
    get:
      summary: List agents
    post:
      summary: Create agent proposal
  /projects/{projectId}/tools:
    get:
      summary: List available tools
  /projects/{projectId}/permissions:
    get:
      summary: Read permissions
    patch:
      summary: Update permissions proposal
  /projects/{projectId}/skills:
    get:
      summary: List local skills
  /skills/find:
    post:
      summary: Find external skills through skills CLI
  /skills/install-global:
    post:
      summary: Install global skill through skills CLI
  /skills/marketplace:
    get:
      summary: Search Skill Marketplace
  /skills/marketplace/{marketplaceSkillId}/preview:
    get:
      summary: Preview marketplace skill
  /projects/{projectId}/skills/install:
    post:
      summary: Install marketplace skill proposal
  /projects/{projectId}/mcp-servers:
    get:
      summary: List MCP servers
    post:
      summary: Create MCP server proposal
  /mcp-marketplace:
    get:
      summary: Search MCP marketplace
  /projects/{projectId}/mcp-servers/check:
    post:
      summary: Check OpenCode MCP runtime status
  /projects/{projectId}/mcp-servers/install:
    post:
      summary: Install marketplace MCP server
  /projects/{projectId}/commands/{name}:
    get:
      summary: Get command detail
    delete:
      summary: Delete project command
  /chat/config-intents:
    post:
      summary: Convert natural language request into config proposal
  /projects/{projectId}/chat/files:
    get:
      summary: Search files for legacy chat @ references
  /projects/{projectId}/chat/references:
    get:
      summary: Search files and directories for chat @ references
  /projects/{projectId}/chat/sessions/{sessionId}/messages/stream:
    post:
      summary: Stream OpenCode chat response over SSE
```
