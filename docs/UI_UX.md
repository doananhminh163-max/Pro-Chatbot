# UI/UX Design Specification - Pro Chatbot

## Mục lục

- [1. Mục tiêu thiết kế](#1-mục-tiêu-thiết-kế)
- [2. Nguyên tắc tham khảo từ ChatGPT UI](#2-nguyên-tắc-tham-khảo-từ-chatgpt-ui)
- [3. UX positioning cho Pro Chatbot](#3-ux-positioning-cho-pro-chatbot)
- [4. Information architecture](#4-information-architecture)
- [5. App shell layout](#5-app-shell-layout)
- [6. Design system](#6-design-system)
- [7. Component specification](#7-component-specification)
- [8. Page-level UX](#8-page-level-ux)
- [9. Key user flows](#9-key-user-flows)
- [10. Interaction states](#10-interaction-states)
- [11. Responsive behavior](#11-responsive-behavior)
- [12. Accessibility](#12-accessibility)
- [13. Frontend implementation guide](#13-frontend-implementation-guide)
- [14. SCSS token đề xuất](#14-scss-token-đề-xuất)
- [15. Acceptance checklist](#15-acceptance-checklist)

---

## 1. Mục tiêu thiết kế

Tài liệu này mô tả UI/UX cho **Pro Chatbot**, lấy cảm hứng từ style, component và layout của giao diện ChatGPT hiện đại: tối giản, dark-first, tập trung vào tác vụ, sidebar rõ ràng, input trung tâm, menu cá nhân hóa và settings modal dạng panel.

Thiết kế không sao chép nhận diện thương hiệu của ChatGPT. Mục tiêu là áp dụng các pattern UI/UX phù hợp cho sản phẩm quản lý OpenCode:

- Giao diện tối, ít nhiễu thị giác.
- Điều hướng trái cố định cho project, module và workspace.
- Khu vực làm việc trung tâm rộng, tập trung vào thao tác chính.
- Component bo góc lớn, spacing thoáng, trạng thái hover rõ.
- Modal cài đặt dạng hai cột: sidebar danh mục + nội dung chi tiết.
- Tất cả thao tác rủi ro như apply config, install skill, enable bash/edit đều có preview, diff và confirmation.

---

## 2. Nguyên tắc tham khảo từ ChatGPT UI

### 2.1 Bố cục tổng thể

Giao diện tham khảo có 3 pattern chính:

| Pattern | Cách áp dụng cho Pro Chatbot |
|---|---|
| Left sidebar cố định | Quản lý project, module chính, session gần đây, account menu. |
| Main canvas tối giản | Tập trung vào chatbot, dashboard hoặc form cấu hình đang mở. |
| Bottom account card | Truy cập profile, settings, billing/local license, help, logout. |
| Settings modal trung tâm | Cấu hình giao diện, model mặc định, connection, bảo mật, dữ liệu. |

### 2.2 Visual style

| Thuộc tính | Đặc điểm đề xuất |
|---|---|
| Theme mặc định | Dark mode. |
| Background chính | Gần đen, ít texture. |
| Surface | Xám đậm, phân cấp bằng tone thay vì border mạnh. |
| Border | Mỏng, opacity thấp. |
| Radius | 12px - 24px, ưu tiên bo tròn mềm. |
| Icon | Line icon, stroke 1.5px - 2px. |
| Typography | Sans-serif hiện đại, size vừa phải, line-height rộng. |
| Motion | Nhanh, ngắn, không gây chú ý quá mức. |

### 2.3 UX tone

Pro Chatbot là công cụ developer/admin, nên tone UI cần:

- Rõ ràng hơn conversational UI thuần túy.
- Có cảnh báo kỹ thuật chính xác.
- Không giấu rủi ro trong flow đơn giản hóa quá mức.
- Ưu tiên preview/diff trước apply.

---

## 3. UX positioning cho Pro Chatbot

Pro Chatbot không chỉ là chatbot. Đây là **control plane cho OpenCode**. Giao diện cần dung hòa 2 chế độ:

1. **Chat-first mode**: người dùng nhập yêu cầu tự nhiên, hệ thống tạo proposal.
2. **Admin-console mode**: người dùng chỉnh project, agent, permission, skill, MCP, command qua form/table.

### 3.1 Mental model

```txt
Project → Config Surface → Change Proposal → Preview/Diff → Confirm → Apply → Audit/Rollback
```

### 3.2 UX priorities

| Priority | Mô tả |
|---|---|
| Safety | Mọi thay đổi nguy hiểm phải có risk label, diff và confirmation. |
| Observability | Người dùng luôn biết đang chỉnh project nào, file nào, scope nào. |
| Speed | Các tác vụ phổ biến phải nằm trong sidebar hoặc command palette. |
| Recoverability | Sau apply phải có backup, audit và rollback path rõ ràng. |
| Familiarity | Layout giống app productivity/chat hiện đại để giảm learning curve. |

---

## 4. Information architecture

Current implemented navigation:

```txt
Pro Chatbot
├── New Chat
├── Chatbot        /chat, /chat/new, /chat/:sessionId
├── Config
│   ├── Agents     /agents
│   ├── Skills     /skills
│   ├── MCP        /mcp
│   └── Commands   /commands
├── Permissions    /permissions
├── Sessions       /sessions
└── Settings modal
```

The IA below remains the target product IA. Dashboard, standalone Config, standalone Audit Logs, standalone Settings, separate Skill Marketplace, and project switcher routes are future/alternate surfaces unless the routes are added to `frontend/src/navigation.ts`.

### 4.1 Navigation cấp cao

```txt
Pro Chatbot
├─ New Chat
├─ Search
├─ Projects
│  ├─ Project A
│  └─ Project B
├─ Modules
│  ├─ Dashboard
│  ├─ Chatbot
│  ├─ Config
│  ├─ Agents
│  ├─ Tools & Permissions
│  ├─ Skills
│  ├─ Skill Marketplace
│  ├─ MCP Servers
│  ├─ Commands
│  ├─ Sessions
│  └─ Audit Logs
└─ Account / Settings
```

### 4.2 Sidebar grouping

Sidebar nên chia thành các cụm:

| Nhóm | Thành phần |
|---|---|
| Primary actions | New Chat, Search, Command Palette. |
| Project | Project hiện tại, switch project, create/register project. |
| Core modules | Dashboard, Chatbot, Config, Agents, Permissions. |
| Extensions | Skills, Marketplace, MCP, Commands. |
| Operations | Sessions, Audit, Backups. |
| Account | Profile, Settings, Help, Logout. |

### 4.3 URL routing đề xuất

```txt
/projects
/projects/:projectId/dashboard
/projects/:projectId/chat
/projects/:projectId/config
/projects/:projectId/agents
/projects/:projectId/permissions
/projects/:projectId/skills
/projects/:projectId/marketplace
/projects/:projectId/mcp
/projects/:projectId/commands
/projects/:projectId/sessions
/projects/:projectId/audit
/settings
```

---

## 5. App shell layout

### 5.1 Desktop layout

```txt
┌────────────────────────────────────────────────────────────────────┐
│ Left Sidebar │ Main Header                                         │
│              ├─────────────────────────────────────────────────────┤
│              │                                                     │
│              │ Main Workspace                                      │
│              │                                                     │
│              │                                                     │
│              ├─────────────────────────────────────────────────────┤
│ Account Card │ Optional Composer / Action Bar                      │
└────────────────────────────────────────────────────────────────────┘
```

### 5.2 Sidebar dimensions

| Token | Value |
|---|---:|
| Expanded width | 280px - 320px |
| Collapsed width | 64px - 72px |
| Padding | 12px |
| Item height | 40px - 44px |
| Bottom account card height | 64px - 76px |

### 5.3 Main workspace

Main workspace cần hỗ trợ nhiều chế độ:

| Mode | Layout |
|---|---|
| Chat empty state | Centered prompt, input composer, quick actions. |
| Chat active | Message stream + sticky composer bottom. |
| Admin table | Header + toolbar + table/card list. |
| Detail view | Split panel: list trái, detail phải. |
| Diff review | Proposal summary trên, diff viewer dưới, action bar sticky. |

---

## 6. Design system

## 6.1 Color system

### Dark theme

| Token | Value | Usage |
|---|---|---|
| `--bg-app` | `#000000` | Nền toàn app. |
| `--bg-sidebar` | `#050505` | Sidebar. |
| `--bg-surface` | `#1f1f1f` | Card, modal, input. |
| `--bg-surface-hover` | `#2f2f2f` | Hover item. |
| `--bg-surface-active` | `#3a3a3a` | Active item. |
| `--bg-elevated` | `#252525` | Dropdown/menu. |
| `--border-subtle` | `rgba(255,255,255,0.10)` | Border nhẹ. |
| `--text-primary` | `#f4f4f4` | Text chính. |
| `--text-secondary` | `#b4b4b4` | Text phụ. |
| `--text-muted` | `#8a8a8a` | Hint, placeholder. |
| `--accent` | `#f2b705` | Accent mặc định, tương tự vàng trong ảnh. |
| `--danger` | `#ff5c5c` | Lỗi, critical risk. |
| `--warning` | `#f5b84b` | High/medium risk. |
| `--success` | `#3fb950` | Online, valid, applied. |
| `--info` | `#58a6ff` | Link, info status. |

### Risk color mapping

| Risk | Badge style |
|---|---|
| `low` | Green/neutral, nhẹ. |
| `medium` | Amber outline. |
| `high` | Orange filled nhẹ. |
| `critical` | Red filled, icon cảnh báo. |

## 6.2 Typography

| Role | Size | Weight | Usage |
|---|---:|---:|---|
| Display | 28px - 32px | 500 | Empty state heading. |
| Page title | 22px - 24px | 600 | Header page. |
| Section title | 16px - 18px | 600 | Card title, settings group. |
| Body | 14px - 15px | 400 | Nội dung chính. |
| Caption | 12px - 13px | 400 | Metadata, hint, timestamp. |
| Monospace | 13px - 14px | 400 | Diff, code, paths. |

Font đề xuất:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
font-family-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
```

## 6.3 Spacing

| Token | Value |
|---|---:|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |

## 6.4 Radius

| Token | Value | Usage |
|---|---:|---|
| `radius-sm` | 8px | Badge, small button. |
| `radius-md` | 12px | Sidebar item, input. |
| `radius-lg` | 16px | Card, dropdown. |
| `radius-xl` | 24px | Composer, modal. |
| `radius-pill` | 999px | Pills, avatar, chips. |

---

## 7. Component specification

## 7.1 Sidebar

### Behavior

- Sidebar cố định bên trái ở desktop.
- Có nút collapse/expand ở header sidebar.
- Active route dùng background xám đậm hơn.
- Hover item đổi background nhẹ, không dùng shadow mạnh.
- Project list có section title nhỏ.
- Account card nằm sticky bottom.

### Anatomy

```txt
Sidebar
├─ Brand row
│  ├─ Logo/Name: Pro Chatbot
│  └─ Collapse button
├─ Primary actions
│  ├─ New Chat
│  ├─ Search
│  └─ Command Palette
├─ Project section
│  ├─ Current project
│  └─ Project switcher
├─ Module nav
└─ Account card
```

### Sidebar item

| Element | Mô tả |
|---|---|
| Icon | 20px, line icon. |
| Label | 14px - 15px. |
| Badge | Optional, ví dụ số audit warning. |
| Active state | `--bg-surface-active`. |

## 7.2 Chat composer

Composer là component trung tâm, lấy cảm hứng từ input lớn bo tròn trong ảnh.

### Anatomy

```txt
┌────────────────────────────────────────────────────────────┐
│ + │ Hỏi Pro Chatbot điều gì...                     mic/send│
└────────────────────────────────────────────────────────────┘
```

### Behavior

- Empty state: composer nằm giữa màn hình, dưới heading.
- Active chat: composer sticky bottom, max-width 860px.
- Enter gửi tin nhắn, Shift+Enter xuống dòng.
- Model and agent selectors include typeahead search. The search input appears at the top of each dropdown, filters locally as the user types, keeps `Default model` / `Default agent` available, and does not submit the chat form when Enter is pressed inside the search field.
- Nút `+` mở attachment/action menu: attach config, attach log, attach file, select project context.
- Nút send disabled khi input rỗng hoặc đang streaming.
- Có quick action pills bên dưới empty composer.

### Quick actions

| Action | Prompt mẫu |
|---|---|
| Tạo agent | “Tạo agent review code chỉ được đọc file.” |
| Sửa permission | “Cho phép skill nhưng bash phải ask.” |
| Cài skill | “Tìm skill viết tài liệu và tạo proposal cài đặt.” |
| Kiểm tra MCP | “Kiểm tra trạng thái MCP servers.” |
| Xem audit | “Tóm tắt thay đổi config gần đây.” |

### Chat message renderer

- Assistant messages render OpenCode reasoning/activity parts as muted text above the main response when reasoning content exists.
- The main answer should not show an explicit group label such as `Main messages`; timestamps and grouping metadata should stay visually secondary.
- Streaming should show only one empty-response placeholder at a time. If reasoning text is empty, the placeholder belongs to the main response area only.
- Markdown rendering supports headings, paragraphs, blockquotes, ordered/unordered lists, fenced code blocks, inline emphasis/code, and GitHub-style markdown tables.
- Markdown tables use semantic `table`, `thead`, `tbody`, `th`, and `td` elements inside a horizontal scroll wrapper so wide model/tool comparison tables do not break the chat layout.

## 7.3 Account menu

Menu mở từ bottom account card, tương tự ảnh tham khảo.

### Items đề xuất

```txt
Account Menu
├─ User profile summary
├─ Workspace / Local license
├─ Personalize
├─ Profile
├─ Settings
├─ Help
└─ Logout
```

Với app local-first, `Upgrade plan` có thể thay bằng:

- `Workspace Settings`
- `Local Runtime Status`
- `Manage Connections`

## 7.4 Settings modal

Settings modal dùng layout hai cột.

```txt
┌──────────────────────────────────────────────────────────┐
│ X │ Sidebar categories │ Content panel                  │
│   │                    │                                │
│   │ General            │ General                        │
│   │ Appearance         │ Theme: Dark                    │
│   │ Notifications      │ Accent: Yellow                 │
│   │ Connections        │ Language: Auto                 │
│   │ Security           │ Voice input: Off/On            │
│   │ Data Controls      │                                │
└──────────────────────────────────────────────────────────┘
```

### Categories cho Pro Chatbot

| Category | Nội dung |
|---|---|
| General | Theme, language, accent color, compact mode. |
| Projects | Default workspace, path policy, recent projects. |
| OpenCode | Default server, SDK mode, CLI fallback, timeout. |
| Models | Provider/model defaults, model override policy. |
| Security | Secret handling, confirmation rules, allowlist/blocklist. |
| Marketplace | Trust filters, cache TTL, source adapters. |
| Notifications | Apply result, connection failure, risk warning. |
| Data Controls | Audit retention, backup retention, cache cleanup. |
| Account | User profile/local identity. |

## 7.5 Cards

Cards dùng cho dashboard, skills, marketplace, MCP.

### Card anatomy

```txt
Card
├─ Header
│  ├─ Title
│  ├─ Status badge
│  └─ More menu
├─ Description
├─ Metadata row
└─ Actions
```

### Card states

| State | Visual |
|---|---|
| Default | Surface background, subtle border. |
| Hover | Background sáng hơn 4-6%. |
| Selected | Accent border hoặc active background. |
| Disabled | Opacity thấp, text muted. |
| Risky | Warning badge + confirmation action. |

## 7.6 Tables

Dùng cho audit log, config changes, backups, agents, permissions.

### Table guidelines

- Header sticky nếu table dài.
- Row height 44px - 52px.
- Có filter/search ở toolbar.
- Empty state rõ lý do và CTA.
- Không nhồi quá nhiều cột; thông tin phụ đưa vào detail drawer.

## 7.7 Detail drawer

Detail drawer mở bên phải khi chọn row/card.

Use cases:

- Xem chi tiết agent.
- Xem SKILL.md preview.
- Xem MCP server config.
- Xem audit log metadata.
- Xem config change diff.

```txt
┌──────────────────────────── Main ────────────────────────┬───────────────┐
│ Table/List                                                │ Detail Drawer │
│                                                          │               │
└──────────────────────────────────────────────────────────┴───────────────┘
```

## 7.8 Diff viewer

Diff viewer là component trọng yếu.

### Requirements

- Monospace font.
- Hỗ trợ unified diff.
- Highlight added/removed lines.
- Sticky action bar dưới cùng: Cancel, Back, Confirm Apply.
- Redact secret pattern trong diff nếu backend đánh dấu.
- Có summary risk phía trên.

### Diff review layout

```txt
Change Proposal
├─ Summary card
│  ├─ Type: permission.update
│  ├─ Target file: opencode.jsonc
│  ├─ Risk: high
│  └─ Warnings
├─ Diff viewer
└─ Sticky action bar
   ├─ Cancel
   ├─ Save draft
   └─ Confirm apply
```

## 7.9 Badges

| Badge | Usage |
|---|---|
| `online` | OpenCode server connected. |
| `offline` | Không kết nối được. |
| `valid` | Config/skill hợp lệ. |
| `invalid` | Có lỗi validate. |
| `previewed` | Change đã tạo diff. |
| `applied` | Đã apply. |
| `rolled_back` | Đã rollback. |
| `high risk` | Cần confirmation rõ. |

## 7.10 Toasts

Toast nên ngắn, có action khi cần.

| Event | Toast |
|---|---|
| Apply thành công | “Đã apply thay đổi. Xem audit log.” |
| Apply thất bại | “Apply thất bại. Mở rollback guide.” |
| Server offline | “OpenCode server offline. Test lại connection.” |
| Skill invalid | “SKILL.md không hợp lệ. Xem lỗi validate.” |

---

## 8. Page-level UX

## 8.1 Home / Empty chat page

### Layout

```txt
Center
├─ Heading: "Hôm nay bạn muốn cấu hình gì?"
├─ Composer
└─ Quick action pills
```

### Quick action pills

- `Tạo agent`
- `Sửa permission`
- `Tìm skill`
- `Test OpenCode server`
- `Xem thay đổi gần đây`

## 8.2 Dashboard

Dashboard là trang tổng quan project hiện tại.

Current implementation note: dashboard data exists inside `GET /api/app-state` and is visible through shell metrics/risk context, but there is no standalone `/dashboard` route yet.

### Sections

| Section | Nội dung |
|---|---|
| Project status | Root path, config path, platform. |
| OpenCode server | Online/offline, latency, base URL. |
| Config health | Valid/invalid, last checked. |
| Risk queue | Change proposal đang previewed/chờ apply. |
| Recent audit | 5 thao tác gần nhất. |
| Quick actions | Create agent, update permission, install skill. |

## 8.3 Config page

Current implementation note: config editing is exposed through the Settings modal and preview drawer, not a standalone `/config` route yet.

### Layout

```txt
Header: Config
Toolbar: scope selector + refresh + validate
Main split:
├─ Config file tree
└─ Config preview/editor readonly or controlled editor
Bottom/Drawer: Diff preview when proposing change
```

### UX rules

- Không cho frontend ghi trực tiếp config.
- Editor mặc định readonly.
- Nút chỉnh sửa tạo proposal, không apply ngay.
- Scope rõ: `project`, `global`, `effective`.

## 8.4 Agents page

### Layout

```txt
Header + Create Agent button
Agent cards/table
Detail drawer
Create/Edit wizard
```

### Agent wizard steps

1. Basic info: name, description, mode.
2. Model selection.
3. Permission matrix.
4. Prompt editor.
5. Preview diff.
6. Confirm apply.

## 8.5 Tools & Permissions page

### Layout

Permission matrix:

```txt
Tool        Project     Global      Effective    Risk
bash        ask         deny        ask          high
edit        deny        deny        deny         high
read        allow       allow       allow        low
skill       allow       ask         allow        medium
```

### UX rules

- `allow`, `ask`, `deny` dùng segmented control.
- Các tool high-risk hiển thị warning inline.
- Wildcard `*` cần confirmation riêng.
- Khi người dùng đổi quyền, hệ thống tạo preview thay vì ghi ngay.

## 8.6 Skills page

### Layout

- Search/filter theo scope, status, name.
- Skill cards hoặc table.
- Detail drawer hiển thị frontmatter, validation, source path.
- Actions: validate, enable/disable, export, delete.

### Skill card

```txt
[valid] doc-coauthoring
Guide users through documentation workflow.
Scope: project · Source: .opencode/skills/...
Actions: View · Disable · Delete
```

## 8.7 Skill Marketplace page

Current implementation note: marketplace/search actions are integrated into the current Skills page. A separate Skill Marketplace route is future scope.

### Layout

```txt
Search bar
Filters: source, trust level, license
Results grid
Preview drawer/modal
Install proposal flow
```

### UX rules

- Không có nút “Install now” trực tiếp.
- Button nên là `Preview & Install`.
- Community/unknown source có warning rõ.
- Install chỉ tạo change proposal.

## 8.8 MCP Servers page

### Layout

- List/table MCP servers.
- Status badge: connected, failed, disabled.
- Add MCP wizard: local/remote.
- Test connection action.

### UX rules

- Remote MCP mặc định high risk.
- Header/env secrets chỉ nhận reference, không nhận secret thô.
- Local command cần preview command và envRef.

## 8.9 Commands page

### Layout

- Command list.
- Markdown template preview.
- Argument simulator.
- Create/edit command wizard.

## 8.10 Sessions page

### Layout

- Danh sách OpenCode sessions.
- Filter theo project/status/date.
- Open session detail.
- Session context panel: select Model, Agent, Skills, and MCPs for the current session.
- Archive action.

## 8.11 Audit Logs page

Current implementation note: audit data exists in app-state and `GET /api/projects/:projectId/audit-logs`, but there is no standalone `/audit` route yet.

### Layout

```txt
Filters: target type, action, date range, risk
Timeline/table
Detail drawer
Rollback action when applicable
```

### Audit row

```txt
[applied] skill.install · doc-coauthoring · high risk · 2026-05-13 20:12
```

## 8.12 Settings page/modal

Settings nên là modal overlay trên app shell, tương tự ảnh tham khảo.

### General settings

- Appearance: Light/Dark/System.
- Contrast: Default/Increased.
- Accent color.
- Language.
- Compact mode.

### OpenCode settings

- Default server URL.
- Auth mode.
- Timeout.
- Test connection.
- SDK/CLI fallback.

### Security settings

- Require confirmation for high-risk changes.
- Block plaintext secrets.
- Marketplace source allowlist/blocklist.
- Backup permission policy.

---

## 9. Key user flows

## 9.1 Natural language config change

```txt
User enters request
→ Intent parsed
→ Missing fields asked if needed
→ Proposal generated
→ Diff displayed
→ Risk warning shown
→ User confirms
→ Backend applies
→ Verify result shown
→ Audit log linked
```

### UX requirements

- Chat response phải tách rõ `Proposed change`, `Risk`, `Files affected`, `Next action`.
- Không dùng wording mơ hồ như “Done” trước khi apply thật.
- Nếu chỉ preview, status phải là `Previewed`, không phải `Applied`.

## 9.2 Create read-only review agent

```txt
Agents → Create Agent
→ Basic info
→ Select subagent
→ Permission preset: Read-only
→ Review prompt
→ Preview diff
→ Apply
```

Preset permissions:

```json
{
  "read": "allow",
  "grep": "allow",
  "glob": "allow",
  "edit": "deny",
  "bash": "deny"
}
```

## 9.3 Install marketplace skill

```txt
Marketplace → Search
→ Open skill preview
→ Validate SKILL.md
→ Show trust metadata
→ Create install proposal
→ Show diff
→ Confirm install
→ Skill appears in Skills page
```

## 9.4 Session context override

```txt
Sessions -> Open session detail
-> Edit Session Context
-> Select Model
-> Select Agent
-> Select Skills
-> Select MCPs
-> Save context
-> Continue chat with updated context
```

### UX rules

- Session context changes do not automatically modify global/project config.
- Show the effective context in the session header.
- If new context is high risk (for example remote MCP), show a warning before save.

## 9.5 Rollback config change

```txt
Audit Logs → Select applied change
→ View backup metadata
→ Click Rollback
→ Preview rollback diff
→ Confirm
→ Verify
→ Audit rollback
```

---

## 10. Interaction states

## 10.1 Loading

| Context | Pattern |
|---|---|
| Chat response | Streaming text + subtle typing indicator. |
| Table fetch | Skeleton rows. |
| Card grid | Skeleton cards. |
| Diff generation | Progress state with “Generating preview…” |
| Apply change | Blocking modal or sticky action loading. |

Chat streaming states:

| Event | UI behavior |
|---|---|
| `user` | Replace optimistic user message if backend returns a canonical message id. |
| `assistant_start` | Create one assistant placeholder and keep its layout stable. |
| `thinking_delta` | Append to a collapsible/subtle reasoning region. |
| `text_delta` | Append to the visible assistant answer. |
| `done` | Mark assistant message complete and refresh app-state in background. |
| `error` | Stop streaming, keep already-rendered content, and show a recoverable inline error. |

## 10.2 Empty states

| Page | Empty copy |
|---|---|
| Projects | “Chưa có project nào. Đăng ký workspace OpenCode đầu tiên.” |
| Agents | “Chưa có agent project-level. Tạo agent mới hoặc dùng built-in agent.” |
| Skills | “Chưa phát hiện skill trong project này.” |
| Marketplace | “Nhập từ khóa để tìm skill.” |
| Audit | “Chưa có thao tác nào được ghi nhận.” |

## 10.3 Error states

Errors cần có:

- Mô tả ngắn.
- Mã lỗi nếu có.
- Hành động tiếp theo.
- Link tới audit/log nếu liên quan.
- Trường hợp stale preview sau khi backend restart phải hiển thị lỗi rõ ràng như `CONFIG_CHANGE_NOT_FOUND` và yêu cầu tạo lại preview.

Example:

```txt
Không parse được opencode.jsonc
CONFIG_PARSE_ERROR
Dòng 18, cột 4: trailing comma không hợp lệ.
[Open file] [View raw error]
```

## 10.4 Confirmation states

High-risk confirmation dialog:

```txt
Title: Xác nhận thay đổi rủi ro cao
Body: Thay đổi này sẽ bật quyền bash cho project hiện tại.
Risk: high
Affected file: opencode.jsonc
Required input: nhập "I understand the risk"
Actions: Cancel · Confirm apply
```

---

## 11. Responsive behavior

## 11.1 Breakpoints

| Breakpoint | Width | Behavior |
|---|---:|---|
| Mobile | `< 768px` | Sidebar thành drawer, main full-width. |
| Tablet | `768px - 1024px` | Sidebar collapsible, drawer detail full-height. |
| Desktop | `> 1024px` | Sidebar cố định, detail drawer optional. |
| Wide | `> 1440px` | Main content max-width, split view rộng hơn. |

## 11.2 Mobile-specific UX

- Sidebar mở bằng hamburger.
- Account menu full-width bottom sheet.
- Settings modal full-screen.
- Tables chuyển thành stacked cards.
- Diff viewer có horizontal scroll.
- Composer sticky bottom.

---

## 12. Accessibility

### 12.1 Keyboard

- `Ctrl/Cmd + K`: mở command palette/search.
- `Ctrl/Cmd + /`: mở shortcut help.
- `Esc`: đóng modal/drawer/menu.
- `Tab`: focus theo thứ tự logic.
- `Enter`: activate button/menu item.
- `Shift + Enter`: newline trong composer.

### 12.2 Visual accessibility

- Contrast tối thiểu 4.5:1 cho body text.
- Focus ring rõ, không chỉ dựa vào màu.
- Badge risk có cả text và icon.
- Error không chỉ dùng màu đỏ; phải có message.

### 12.3 Screen reader

- Button icon-only phải có `aria-label`.
- Modal có `role="dialog"` và focus trap.
- Toast quan trọng dùng `aria-live="polite"` hoặc `assertive` tùy mức độ.
- Table có header semantic.

---

## 13. Frontend implementation guide

## 13.1 Tech stack alignment

Dựa trên stack dự kiến:

- React Vite.
- TypeScript.
- SCSS.
- Bootstrap utilities.
- Material UI cho modal, menu, tooltip, dialog, table nếu cần.

## 13.2 Suggested component structure

```txt
apps/web/src/
├─ app/
│  ├─ AppShell.tsx
│  ├─ routes.tsx
│  └─ providers.tsx
├─ components/
│  ├─ layout/
│  │  ├─ Sidebar.tsx
│  │  ├─ MainHeader.tsx
│  │  ├─ AccountMenu.tsx
│  │  └─ SettingsModal.tsx
│  ├─ primitives/
│  │  ├─ Button.tsx
│  │  ├─ IconButton.tsx
│  │  ├─ Badge.tsx
│  │  ├─ Card.tsx
│  │  ├─ TextField.tsx
│  │  └─ SegmentedControl.tsx
│  ├─ feedback/
│  │  ├─ Toast.tsx
│  │  ├─ EmptyState.tsx
│  │  ├─ ErrorState.tsx
│  │  └─ ConfirmRiskDialog.tsx
│  └─ code/
│     ├─ DiffViewer.tsx
│     └─ CodeBlock.tsx
├─ features/
│  ├─ chatbot/
│  │  ├─ ChatPage.tsx
│  │  ├─ ChatComposer.tsx
│  │  └─ ProposalMessage.tsx
│  ├─ config/
│  ├─ agents/
│  ├─ permissions/
│  ├─ skills/
│  ├─ marketplace/
│  ├─ mcp/
│  ├─ commands/
│  ├─ sessions/
│  └─ audit/
└─ styles/
   ├─ _tokens.scss
   ├─ _base.scss
   ├─ _layout.scss
   └─ main.scss
```

## 13.3 State management

| State | Tool đề xuất |
|---|---|
| Server data | React Query / TanStack Query. |
| UI state | Zustand hoặc React context. |
| Forms | React Hook Form + Zod. |
| Modal/drawer state | Local state hoặc UI store. |
| Theme | CSS variables + persisted preference. |

## 13.4 Component naming convention

- `AppShell`: layout tổng.
- `SidebarNav`: navigation trái.
- `ProjectSwitcher`: chọn project.
- `ChatComposer`: input chat.
- `ProposalCard`: proposal config trong chat.
- `RiskBadge`: badge rủi ro.
- `ConfirmRiskDialog`: modal xác nhận rủi ro.
- `DiffViewer`: xem diff.
- `SettingsModal`: modal settings.

---

## 14. SCSS token đề xuất

```scss
:root {
  color-scheme: dark;

  --bg-app: #000000;
  --bg-sidebar: #050505;
  --bg-surface: #1f1f1f;
  --bg-surface-hover: #2f2f2f;
  --bg-surface-active: #3a3a3a;
  --bg-elevated: #252525;

  --border-subtle: rgba(255, 255, 255, 0.10);
  --border-strong: rgba(255, 255, 255, 0.18);

  --text-primary: #f4f4f4;
  --text-secondary: #b4b4b4;
  --text-muted: #8a8a8a;

  --accent: #f2b705;
  --danger: #ff5c5c;
  --warning: #f5b84b;
  --success: #3fb950;
  --info: #58a6ff;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  --sidebar-width: 300px;
  --sidebar-collapsed-width: 68px;
  --header-height: 56px;
  --composer-max-width: 860px;

  --shadow-menu: 0 16px 40px rgba(0, 0, 0, 0.45);
  --transition-fast: 120ms ease;
  --transition-normal: 180ms ease;
}

body {
  margin: 0;
  background: var(--bg-app);
  color: var(--text-primary);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  min-height: 100vh;
  background: var(--bg-app);
}

.sidebar {
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-subtle);
  padding: 12px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sidebar-item {
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background var(--transition-fast);

  &:hover {
    background: var(--bg-surface-hover);
  }

  &.active {
    background: var(--bg-surface-active);
  }
}

.main-workspace {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.chat-empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.chat-composer {
  width: min(100%, var(--composer-max-width));
  min-height: 70px;
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.settings-modal {
  width: min(92vw, 860px);
  min-height: 560px;
  border-radius: var(--radius-lg);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-menu);
  display: grid;
  grid-template-columns: 260px 1fr;
}

.risk-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: var(--radius-pill);
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid var(--border-subtle);

  &.low {
    color: var(--success);
  }

  &.medium {
    color: var(--warning);
  }

  &.high,
  &.critical {
    color: var(--danger);
  }
}
```

---

## 15. Acceptance checklist

## 15.1 Layout

- [ ] Desktop có left sidebar cố định.
- [ ] Sidebar có trạng thái active, hover, collapsed.
- [ ] Account card nằm cuối sidebar.
- [ ] Main workspace không bị tràn ngang khi sidebar mở.
- [ ] Settings modal dùng layout hai cột.

## 15.2 Visual system

- [ ] Dark theme là mặc định.
- [ ] Component dùng radius thống nhất.
- [ ] Text primary/secondary/muted rõ phân cấp.
- [ ] Accent color dùng tiết chế cho trạng thái hoặc CTA.
- [ ] Không dùng shadow nặng cho mọi card; chỉ dùng cho overlay/menu.

## 15.3 Safety UX

- [ ] Mọi thay đổi config có preview/diff.
- [ ] High-risk change bắt buộc confirmation.
- [ ] Secret không hiển thị plain text trong diff/log.
- [ ] Apply thành công có audit link.
- [ ] Apply thất bại có rollback guidance.

## 15.4 Component behavior

- [ ] Chat composer hỗ trợ Enter/Shift+Enter.
- [ ] Tables có loading, empty, error state.
- [ ] Detail drawer mở được từ row/card.
- [ ] Toast có action khi cần.
- [ ] Modal có focus trap và đóng bằng Escape.

## 15.5 Responsive

- [ ] Mobile sidebar chuyển thành drawer.
- [ ] Settings modal thành full-screen trên mobile.
- [ ] Table chuyển thành card list trên mobile.
- [ ] Composer sticky bottom và không che nội dung.

---

## Kết luận

UI của Pro Chatbot nên áp dụng layout quen thuộc của các chatbot/workspace app hiện đại: sidebar trái, main workspace tối giản, composer trung tâm và settings modal hai cột. Tuy nhiên, vì Pro Chatbot quản lý cấu hình OpenCode và có khả năng ghi file, UX phải ưu tiên safety, preview, audit và rollback hơn so với một chatbot thông thường.
