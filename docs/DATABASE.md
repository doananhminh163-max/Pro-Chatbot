# Database design

## Mục lục

1. Công nghệ và nguyên tắc
2. Enum
3. Model chính
4. Dữ liệu agent nằm ngoài schema
5. Runtime agent hiện tại
6. Admin data và admin API
7. Quan hệ dữ liệu chính
8. Hành vi `onDelete`
9. Seed data

## 1. Công nghệ và nguyên tắc

- Database engine: SQLite
- ORM: Prisma
- Định danh chính: UUID string
- File binary không lưu trong database; chỉ lưu metadata và `filePath`
- Skill và MCP không nằm trong schema Prisma

## 2. Enum

### `Role`

- `CLIENT`
- `ADMIN`

### `SenderType`

- `USER`
- `AI`
- `SYSTEM`

### `MemoryScope`

- `GLOBAL`
- `SESSION`

Ghi chú: runtime hiện tại chỉ dùng `GLOBAL`; `SESSION` được giữ lại để tương thích dữ liệu cũ.

### `MemoryKind`

- `PROFILE`
- `PREFERENCE`
- `TASK`
- `DOMAIN`
- `FACT`

## 3. Model chính

### `User`

Lưu thông tin tài khoản và personalization.

Trường nổi bật:

- `id`
- `username`
- `email`
- `passwordHash`
- `fullName`
- `avatar`
- `phone`
- `role`
- `aiTone`
- `aiLanguage`
- `aiResponseLength`
- `customInstructions`

Quan hệ:

- 1 user có nhiều `Document`
- 1 user có nhiều `ChatSession`
- 1 user có nhiều `MemoryEntry`

### `Document`

Lưu metadata file của user.

Trường nổi bật:

- `id`
- `userId`
- `sessionId`
- `messageId`
- `fileName`
- `originalName`
- `filePath`
- `mimeType`
- `size`
- `extractedText`

Ghi chú:

- `extractedText` được populate ngay lúc upload nếu file có extractor.
- Backend dùng nội dung này để tạo artifact Markdown cho sandbox job.

### `ChatSession`

Đại diện cho một cuộc hội thoại độc lập.

Trường nổi bật:

- `id`
- `userId`
- `agentId`
- `title`
- `summary` (legacy)
- `activeTask` (legacy)
- `memoryUpdatedAt`
- `createdAt`
- `updatedAt`

Quan hệ:

- thuộc về 1 `User`
- có thể tham chiếu 1 `Agent`
- có nhiều `Message`
- có nhiều `Document`

### `Message`

Đại diện cho từng lượt trao đổi trong session.

Trường nổi bật:

- `id`
- `sessionId`
- `sender`
- `content`
- `createdAt`

### `MemoryEntry`

Lưu memory để phục vụ runtime prompt.

Trường nổi bật:

- `id`
- `userId`
- `sessionId`
- `scope`
- `kind`
- `title`
- `content`
- `importance`
- `createdAt`
- `updatedAt`
- `lastUsedAt`

Ghi chú:

- Runtime hiện tại nạp `GLOBAL` memory cho prompt khi `memoryEnabled=true`.
- `SESSION` tồn tại chủ yếu để tương thích dữ liệu cũ.

### `Provider`

Metadata cho nhà cung cấp AI.

Trường nổi bật:

- `id`
- `name`
- `config`

### `Model`

Metadata cho model thuộc một provider.

Trường nổi bật:

- `id`
- `providerId`
- `name`

### `Agent`

Profile xử lý mà user/admin có thể chọn.

Trường nổi bật:

- `id`
- `name`
- `description`
- `systemPrompt`

Quan hệ:

- 1 agent có nhiều `ChatSession`

## 4. Dữ liệu agent nằm ngoài schema

Prisma chỉ lưu metadata cơ bản của agent trong bảng `Agent`.

Những phần sau được lưu/resolve ngoài schema:

- `selectedSkillIds`
- `selectedMcpToolIds`
- audit history cho agent
- nội dung skill instructions
- Gemini/OpenCode MCP settings cho runtime

Backend đọc các phần này qua:

- `agent-config-store.service.ts`
- `agent-audit-store.service.ts`
- `admin-catalog.service.ts`

## 5. Runtime agent hiện tại

Ghi chú cũ trong codebase về `Agent.systemPrompt` không còn đúng nữa.

Trạng thái hiện tại:

- `chat.service.ts` gọi `resolveAgentRuntime(input.agent)`
- `resolveAgentRuntime()` trả về:
  - `systemPrompt`
  - skill instructions đã chọn
  - MCP catalog đã chọn
  - `geminiMcpSettings`
  - `opencodeMcpSettings`
- `systemPrompt` được đưa vào prompt tạo bởi `createCliPrompt()`
- thông tin skill/MCP được đưa tiếp vào sandbox/runtime preparation

Nói ngắn gọn: `Agent.systemPrompt` đã được nối vào runtime chat thật.

## 6. Admin data và admin API

Admin không còn chỉ là UI mock.

Backend đã có các nhóm API thật:

- `overview`
- `users`
- `providers`
- `agents`
- `config`
- `logs`

Trạng thái hiện tại:

- `Agents` đã có CRUD thật
- `Users`, `Providers`, `Config`, `Logs` hiện chủ yếu là read-only views trên dữ liệu thật

## 7. Quan hệ dữ liệu chính

```text
User
 |- ChatSession
 |  |- Message
 |  |  \- Document
 |  \- Document
 |- MemoryEntry (GLOBAL / legacy SESSION)
 \- Document

Provider
 \- Model

Agent
 \- ChatSession
```

## 8. Hành vi `onDelete`

- Xóa `User` cascade xuống `Document`, `ChatSession`, `MemoryEntry`
- Xóa `ChatSession` cascade xuống `Message`
- `Document.sessionId`: `onDelete: SetNull`
- `Document.messageId`: `onDelete: SetNull`
- `ChatSession.agentId`: `onDelete: SetNull`

## 9. Seed data

Seed hiện tại tạo:

- provider `gemini`
- nhiều model Gemini
- 3 agent mẫu

Không seed:

- user/admin mặc định

