# AGENTS.md - Runbook for AI Agents and Developers

## 1) Purpose
This file is a practical runbook for working safely and consistently in the `report_analizing` repository.
Goals:
- reduce edits in the wrong place;
- keep the `preview -> review -> apply` workflow stable;
- provide a handoff verification checklist.

## 2) System Snapshot (based on current code)
- Workspace root: `D:\Projects\report_analizing`.
- Frontend: React 19 + Vite + TypeScript.
- Backend: Express 5 + TypeScript.
- API prefix: `/api`.
- Default ports:
  - frontend: `5173` (Vite)
  - backend: `8080` (`backend/src/app.ts`)
- Default OpenCode server: configured by `opencode.json` (`server.hostname`, `server.port`, `server.cors`).
- OpenCode API server is the source of truth for runtime data such as current project, agents, skills, commands, and chat sessions.
- The backend no longer uses a local database. Preview/apply metadata is transient in memory; file backups remain under `.pro-chatbot/backups`.

## 3) Quick Start Commands
From repository root:

```bash
npm run install:all
npm run dev
```

Support commands:

```bash
# Backend / Frontend separately
npm run dev:backend
npm run dev:frontend

# Kill backend process on port 8080
npm run kill
```

## 4) Important File Map
Backend:
- `backend/src/app.ts`: app bootstrapping, CORS, base middleware, route mounting.
- `backend/src/routes/api.ts`: all REST endpoints.
- `backend/src/services/opencode-control.service.ts`: core business logic (projects/config/agents/skills/mcp/chat/audit).
- `backend/src/services/workspace.service.ts`: app-state aggregation for dashboard (`GET /api/app-state`).
- `backend/.env.example`: backend-only environment variables.

Frontend:
- `frontend/src/App.tsx`: UI shell, navigation, and main actions.
- `frontend/src/services/appDataService.ts`: frontend API client.
- `frontend/src/types/appData.ts`: shared payload typing between frontend and backend.
- `frontend/vite.config.ts`: proxy `/api -> http://localhost:8080`.

Documentation:
- `README.md`: project overview and quick start.
- `docs/ARCHITECTURE.md`: high-level architecture.
- `docs/API_SPEC.md`: API contract.
- `docs/DATABASE.md`: data layer direction.
- `docs/OVERVIEW.md`, `docs/UI_UX.md`: product scope and guidelines.

## 5) Mandatory Working Rules
- Prefer small, targeted changes; avoid broad refactors unless explicitly requested.
- When adding/updating an API:
  - update routes in `backend/src/routes/api.ts`;
  - update service logic in `backend/src/services/opencode-control.service.ts` (if needed);
  - update frontend API client in `frontend/src/services/appDataService.ts`;
  - update frontend types (`frontend/src/types/appData.ts`) if payloads change.
- Keep response schema consistent:
  - success: `{ success: true, data, meta? }`
  - error: `{ success: false, error, meta }`
- Never commit plaintext secrets:
  - do not hardcode password/token values;
  - do not put OpenCode server secrets in `backend/.env`.
- Preserve the safe flow for risky changes:
  - preview/diff first;
  - apply only after confirmation.
- If a task touches CORS behavior, update allowlist logic in `backend/src/app.ts`.

## 6) Common Task Playbooks
### A. Add a new endpoint
1. Add route handler in `backend/src/routes/api.ts` using existing async handler pattern.
2. Add or extend the service function in `opencode-control.service.ts`.
3. Return the proper envelope and status code.
4. If used by frontend, add API client function in `appDataService.ts`.
5. Update types and UI rendering if needed.

### B. Add a new UI action
1. Add action call in `frontend/src/services/appDataService.ts`.
2. Wire action into `frontend/src/App.tsx` (action group or page).
3. Update `NavId`, `pageTitles`, and page components if a new module is added.
4. Test full user flow from click -> API -> UI render.

### C. Adjust OpenCode server behavior
1. Check `opencode.json` `server` settings first.
2. Review health/startup logic in `opencode-control.service.ts` and `workspace.service.ts`.
3. Re-test `GET /api/app-state` and chat session/message flow after changes.

## 7) Pre-Handoff Checklist
- Backend and frontend run locally (`npm run dev`).
- Smoke tests pass:
  - `GET /api/health` returns `success: true`;
  - `GET /api/app-state` returns workspace data.
- For API changes: no frontend type or runtime breakage on impacted flows.
- For preview/apply changes: diff is visible and apply works.
- No secrets, keys, or passwords appear in git diff.
- Update related docs (`README.md` or `docs/*`) when behavior changes.

## 8) OpenAI API Task Guidance
- Use only official sources: `developers.openai.com` and `platform.openai.com`.
- If the task asks for "latest model" or "current best model", verify current docs before coding.
- Do not silently retarget model IDs when the user explicitly requested a specific model.

## 9) Default Out-of-Scope
- Do not perform broad architecture rewrites across frontend/backend by default.
- Do not add a local database layer unless explicitly requested.
- Do not modify generated files or lockfiles unless the task requires dependency changes.
