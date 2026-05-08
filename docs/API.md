# API documentation

## Mục lục

1. Quy ước chung
2. Auth API
3. Chat API
4. Documents API
5. Admin API
6. Những gì API chưa có

## 1. Quy ước chung

### Base URL

- mặc định backend: `http://localhost:8080`
- frontend có thể override bằng `VITE_API_BASE_URL`

### Xác thực

- cookie JWT: `access_token`
- `HttpOnly`
- `sameSite: lax`
- `secure: true` khi `NODE_ENV=production`

### Định dạng lỗi

Phần lớn endpoint trả:

```json
{
  "message": "Error message"
}
```

Một số endpoint validate bằng `zod` có thể trả thêm `errors`.

## 2. Auth API

### `POST /api/auth/register`

Tạo tài khoản mới và set cookie đăng nhập.

### `POST /api/auth/login`

Đăng nhập bằng email hoặc username.

### `POST /api/auth/logout`

Xóa cookie đăng nhập hiện tại.

### `GET /api/auth/me`

Trả thông tin user hiện tại.

### `PATCH /api/auth/profile`

Cập nhật hồ sơ và personalization.

Trường thường dùng:

- `username`
- `fullName`
- `phone`
- `avatar`
- `aiTone`
- `aiLanguage`
- `aiResponseLength`
- `customInstructions`

### `POST /api/auth/forgot-password`

Gửi yêu cầu reset password.

### `POST /api/auth/reset-password`

Đặt lại mật khẩu bằng token.

### `GET /api/auth/google`

Bắt đầu luồng Google OAuth.

### `GET /api/auth/google/callback`

Passport callback, thành công thì set cookie và redirect về frontend.

## 3. Chat API

Tất cả endpoint chat yêu cầu đăng nhập.

### `GET /api/chat/config`

Trả danh sách provider / model / agent cho giao diện chat.

### `GET /api/chat/memory`

Trả tổng quan memory của user hiện tại.

### `DELETE /api/chat/memory/global`

Xóa toàn bộ global memory của user hiện tại.

### `GET /api/chat/sessions`

Trả danh sách session của user.

### `DELETE /api/chat/sessions`

Xóa toàn bộ session của user.

### `GET /api/chat/sessions/:sessionId/messages`

Trả:

- thông tin session
- danh sách message
- danh sách document của session

### `PATCH /api/chat/sessions/:sessionId`

Đổi tên session.

### `DELETE /api/chat/sessions/:sessionId`

Xóa một session.

### `POST /api/chat/messages`

Gửi tin nhắn cho AI.

Request thường dùng:

```json
{
  "sessionId": "optional-session-id",
  "content": "Hãy phân tích tài liệu này",
  "provider": "gemini",
  "model": "gemini-2.5-pro",
  "memoryEnabled": true,
  "agent": "report-strategist",
  "attachments": ["document-id-1", "document-id-2"]
}
```

Ghi chú quan trọng:

- `sessionId` có thể bỏ qua, backend sẽ tạo session mới.
- `content` có thể rỗng nếu có file đính kèm; backend sẽ dùng mặc định `"Read and summarize the attachments."`.
- prompt text bị giới hạn `<= 2000` ký tự.
- mỗi session nhận tối đa `50` user messages.
- backend có thể chạy thêm memory refresh sau khi có phản hồi AI.
- runtime agent hiện tại đã bao gồm `systemPrompt`, skill instructions, và MCP settings nếu agent được chọn.

Nếu runtime/CLI lỗi, backend sẽ tạo `assistantMessage.sender = SYSTEM`.

## 4. Documents API

Tất cả endpoint document yêu cầu đăng nhập.

### `POST /api/documents/upload`

Upload file và extract sang Markdown/OCR nếu file được hỗ trợ.

Ghi chú:

- backend hiện extract `xlsx`, `csv`, `pdf`, `docx`, `image`, và text
- file upload bị giới hạn `<= 20MB`
- nếu extraction thất bại hoặc loại file không được hỗ trợ cho luồng chat attachment, backend trả lỗi `400`

### `GET /api/documents`

Trả tất cả document của user.

### `DELETE /api/documents`

Xóa toàn bộ document của user.

### `GET /api/documents/:id/download`

Tải file về dưới tên gốc.

### `GET /api/documents/:id/preview`

Trả file trực tiếp để trình duyệt preview.

### `DELETE /api/documents/:id`

Xóa một document.

## 5. Admin API

Tất cả endpoint admin yêu cầu:

- đã đăng nhập
- có role `ADMIN`

### `GET /api/admin/overview`

Trả tổng quan:

- `userCount`
- `sessionCount`
- `documentCount`
- `agentCount`
- `providerCount`
- `failedExecutions`

### `GET /api/admin/users`

Trả danh sách user với:

- role
- session count
- document count
- memory count
- storage bytes / storage label
- last seen

### `GET /api/admin/providers`

Trả provider catalog và model inventory từ database.

### `GET /api/admin/agents`

Trả admin agent workspace:

- `agents`
- `skills`
- `mcps`
- `audit`

### `POST /api/admin/agents`

Tạo agent mới.

Payload:

```json
{
  "name": "report-strategist",
  "description": "Optional description",
  "systemPrompt": "Optional system prompt",
  "selectedSkillIds": ["skill-id"],
  "selectedMcpToolIds": ["mcp-id"]
}
```

### `PATCH /api/admin/agents/:agentId`

Cập nhật agent hiện có.

### `DELETE /api/admin/agents/:agentId`

Xóa agent. Session cũ sẽ bị detach khỏi profile này qua quan hệ `agentId` nullable.

### `GET /api/admin/config`

Trả runtime config read-only:

- Gemini CLI command
- OpenCode CLI command
- sandbox root / broker URL / TTL / timeout
- user docs root

### `GET /api/admin/logs`

Trả system logs gần đây được suy ra từ `Message` có `sender = SYSTEM`.

Mỗi bản ghi gồm:

- `createdAt`
- `level`
- `message`
- `sessionId`
- `sessionTitle`
- `userEmail`
- `agentName`

## 6. Những gì API chưa có

- chưa có health check riêng ngoài `/`
- chưa có token streaming API thật
- chưa có document search/full-text API riêng
- `Users`, `Providers`, `Config`, `Logs` trong admin chưa có write endpoints đầy đủ

