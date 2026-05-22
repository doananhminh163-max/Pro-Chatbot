# Report Analyzing

A full-stack web application for managing and controlling OpenCode through an intuitive interface. Chat with OpenCode runtime, view workspace state, manage agents, permissions, skills, MCP servers, and apply configuration changes through a safe preview → review → apply workflow.

## Features

- **Chat Interface** - Interact with OpenCode runtime with streaming support, model/agent selection, native slash commands/skills, and file or folder references (`@path`)
- **Configuration Management** - Preview configuration changes as diffs before applying them safely with automatic backups
- **Agent Management** - View, create, edit, and set default agents for your workspace
- **Skills Marketplace** - Browse, install, and manage skills from the OpenCode marketplace
- **MCP Server Management** - Configure and manage Model Context Protocol servers
- **Session Management** - Create, track, and export OpenCode chat sessions
- **Health & Monitoring** - Real-time workspace state aggregation and risk assessment
- **Safe Preview/Apply Flow** - Risk classification, automatic backups, and rollback capabilities

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenCode CLI installed globally

### Installation

```bash
npm run install:all
```

### Configuration

Create a `backend/.env` file if needed (copy from `backend/.env.example`):

```env
PORT=8080
PROJECT_ROOT=/path/to/workspace  # optional, defaults to repo root
```

> **Note:** OpenCode server configuration (host, port, CORS) is read from `opencode.json`, not from `.env`.

### Start Development

```bash
npm run dev
```

This command starts three processes concurrently:
- **OpenCode Server** - Listens on `opencode.json` configured port (default: 4097)
- **Backend API** - Runs on `http://localhost:8080`
- **Frontend UI** - Runs on `http://localhost:5173`

The frontend automatically proxies API calls to the backend.

### Individual Development Servers

```bash
npm run dev:frontend   # Frontend only (Vite)
npm run dev:backend    # Backend only (Express)
npm run dev:opencode   # OpenCode server only
npm run kill           # Kill any process on port 8080
```

## Architecture

### Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 19, Vite, TypeScript, Material-UI, SASS |
| **Backend** | Node.js, Express 5, TypeScript |
| **Runtime** | OpenCode API Server (source of truth) |
| **Storage** | Local filesystem (`opencode.json`, `.opencode/*`, `.agents/*`) |

### Directory Structure

```
report_analizing/
├── backend/                # Express API server
│   ├── src/
│   │   ├── app.ts         # App bootstrapping
│   │   ├── routes/        # REST endpoints
│   │   └── services/      # Business logic
│   └── .env.example       # Environment template
├── frontend/              # React + Vite SPA
│   ├── src/
│   │   ├── App.tsx        # Main component
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── types/         # TypeScript types
│   └── vite.config.ts     # Vite configuration
├── docs/                  # Project documentation
├── AGENTS.md              # AI agent runbook
├── opencode.json          # OpenCode server config
└── package.json           # Root scripts
```

## API Overview

All API responses follow a consistent envelope:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": { /* optional metadata */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "meta": { /* optional details */ }
}
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/app-state` | Complete workspace state |
| `POST` | `/api/projects/:id/chat/sessions` | Create chat session |
| `POST` | `/api/projects/:id/chat/sessions/:sid/messages` | Send message |
| `POST` | `/api/config/preview` | Preview configuration changes |
| `POST` | `/api/config/apply` | Apply reviewed changes |

See [docs/API_SPEC.md](./docs/API_SPEC.md) for the complete API reference.

## Configuration Changes

The application uses a safe three-step workflow for making configuration changes:

### 1. **Preview**
User initiates a change → system generates a diff and assesses risk level

### 2. **Review**
Display the proposed changes with risk classification:
- **Low**: Safe changes (e.g., adding whitespace)
- **Medium**: Notable changes (e.g., agent updates)
- **High/Critical**: Requires user confirmation (e.g., permission modifications)

### 3. **Apply**
User confirms → changes written to disk with automatic backup

## Important Notes

### In-Memory State
- Preview/apply metadata, backup index, skill cache, and audit logs are stored in memory
- **After backend restart**: Recreate proposals before applying
- Actual backup files remain on disk under `.pro-chatbot/backups/`

### Limitations
- No local database; OpenCode API server is the single source of truth
- Project creation/deletion and server connections are managed outside this UI
- Natural language intent parsing uses keyword heuristics (not AI planner)

### Safety Constraints
- All file operations use the preview/apply flow (except command create/delete)
- Secrets are never logged or displayed in plain text
- Configuration backups are automatically created before any apply operation

## Chat Workflow

1. User opens `/chat` and selects a model/agent
2. User can reference files or folders with `@path/to/file` or `@path/to/folder` syntax
3. If no session exists, system creates an OpenCode session
4. Message is sent with OpenCode-native file attachments and local folder references
5. OpenCode processes the request and returns response parts
6. If message appears to request config changes, system creates a proposal with `configChangeId`

## Development Guide

### Adding a New Endpoint

1. Add route handler in `backend/src/routes/api.ts`
2. Implement service logic in `backend/src/services/opencode-control.service.ts`
3. Return proper envelope and status code
4. If used by frontend: add API client function in `frontend/src/services/appDataService.ts`
5. Update types in `frontend/src/types/appData.ts` if needed

### Working Rules

- Keep changes targeted and small
- Test full user flow: click → API → UI render
- Preserve the safe preview/apply workflow for risky operations
- Never commit plaintext secrets
- Update documentation when behavior changes

## Documentation

- [OVERVIEW.md](./docs/OVERVIEW.md) - Project goals and scope
- [SPEC.md](./docs/SPEC.md) - Detailed specifications
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Technical architecture
- [API_SPEC.md](./docs/API_SPEC.md) - API contract
- [UI_UX.md](./docs/UI_UX.md) - UI/UX guidelines
- [AGENTS.md](./AGENTS.md) - AI agent runbook

## Testing

Health check:
```bash
curl http://localhost:8080/api/health
```

Get workspace state:
```bash
curl http://localhost:8080/api/app-state
```

## Troubleshooting

### Backend won't start
- Check if port 8080 is already in use: `npm run kill`
- Verify OpenCode server is running or can be started

### OpenCode server connection fails
- Ensure `opencode.json` has correct `server.hostname` and `server.port`
- Check if OpenCode server is running: `opencode serve`

### Frontend API calls fail
- Verify backend is running on `http://localhost:8080`
- Check browser console for CORS errors
- Confirm `vite.config.ts` proxy settings

## License

ISC

---

**Built with TypeScript, Express, React, and OpenCode**
