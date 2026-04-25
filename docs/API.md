# Tài liệu API

Tất cả endpoint backend hiện được mount dưới 3 namespace:

- `/api/auth`
- `/api/chat`
- `/api/documents`

Frontend gọi API qua Axios với `withCredentials: true`, nên cookie xác thực sẽ tự động được gửi kèm.

## 1. Quy ước chung

### Base URL

- Mặc định backend: `http://localhost:8080`
- Frontend có thể override bằng `VITE_API_BASE_URL`

### Xác thực

- Cookie JWT tên `access_token`
- Loại cookie: `HttpOnly`
- `sameSite: lax`
- `secure: true` khi `NODE_ENV=production`

### Định dạng lỗi

Phần lớn endpoint trả JSON dạng:

```json
{
  "message": "Error message"
}
```

Một số endpoint validate bằng `zod` sẽ trả thêm `errors`.

## 2. Auth API

### `POST /api/auth/register`

Tạo tài khoản mới và set cookie đăng nhập luôn.

Request:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "fullName": "Nguyen Van A"
}
```

### `POST /api/auth/login`

Đăng nhập bằng email hoặc username.

Request:

```json
{
  "emailOrUsername": "user@example.com",
  "password": "password123"
}
```

### `POST /api/auth/logout`

Xóa cookie đăng nhập hiện tại.

### `GET /api/auth/me`

Yêu cầu đã đăng nhập. Trả thông tin user hiện tại.

### `PATCH /api/auth/profile`

Cập nhật hồ sơ và personalization.

Request có thể chứa một hoặc nhiều trường:

```json
{
  "username": "new-username",
  "fullName": "New Name",
  "phone": "0123456789",
  "avatar": "data:image/png;base64,...",
  "aiTone": "professional",
  "aiLanguage": "Vietnamese",
  "aiResponseLength": "detailed",
  "customInstructions": "Always answer in bullet points."
}
```

### `POST /api/auth/forgot-password`

Request:

```json
{
  "emailOrUsername": "user@example.com"
}
```

Response luôn là thông báo chung để tránh lộ tài khoản:

```json
{
  "message": "If this account exists, a reset instruction has been issued."
}
```

### `POST /api/auth/reset-password`

Request:

```json
{
  "token": "reset-token-from-email",
  "newPassword": "newStrongPassword"
}
```

### `GET /api/auth/google`

Bắt đầu luồng Google OAuth.

### `GET /api/auth/google/callback`

Passport callback. Thành công thì set cookie và redirect về frontend `/dashboard`.

## 3. Chat API

Tất cả endpoint chat yêu cầu đăng nhập.

### `GET /api/chat/config`

Trả danh sách provider/model/agent lấy từ database.

### `GET /api/chat/sessions`

Trả danh sách session của user hiện tại.

### `DELETE /api/chat/sessions`

Xóa toàn bộ session của user và xóa thư mục vật lý tương ứng.

### `GET /api/chat/sessions/:sessionId/messages`

Tải chi tiết một session, gồm:

- thông tin session;
- danh sách message;
- danh sách document của session.

### `PATCH /api/chat/sessions/:sessionId`

Đổi tên session.

Request:

```json
{
  "title": "New title"
}
```

### `DELETE /api/chat/sessions/:sessionId`

Xóa một session.

### `POST /api/chat/messages`

Gửi tin nhắn cho AI. Đây là endpoint quan trọng nhất của hệ thống.

Request:

```json
{
  "sessionId": "optional-session-id",
  "content": "Hãy phân tích tài liệu này",
  "provider": "gemini",
  "model": "gemini-2.5-pro",
  "memoryMode": "session",
  "agent": "report-strategist",
  "attachments": ["document-id-1", "document-id-2"]
}
```

Ghi chú:

- `sessionId` có thể bỏ qua, backend sẽ tự tạo session mới.
- `content` có thể rỗng nếu có file đính kèm; backend sẽ dùng mặc định `"đọc và tổng hợp lại"`.
- `provider` hiện chấp nhận `gemini` và `opencode`.

Nếu CLI lỗi, `assistantMessage.sender` sẽ là `SYSTEM`.

## 4. Documents API

Tất cả endpoint document yêu cầu đăng nhập.

### `POST /api/documents/upload`

Upload một file.

Request:

- `multipart/form-data`
- field file: `file`
- field tùy chọn: `sessionId`

### `GET /api/documents`

Trả tất cả tài liệu của user. Mỗi document có thể include `session.title` nếu đã gắn vào session.

### `DELETE /api/documents`

Xóa toàn bộ tài liệu của user và cố gắng xóa file vật lý tương ứng.

### `GET /api/documents/:id/download`

Tải file về dưới tên gốc `originalName`.

### `GET /api/documents/:id/preview`

Trả file trực tiếp để trình duyệt preview.

### `DELETE /api/documents/:id`

Xóa một document.

## 5. Những gì API chưa có

- Chưa có endpoint admin CRUD.
- Chưa có endpoint health check riêng ngoài `/`.
- Chưa có endpoint stream chat theo token.
- Chưa có endpoint search document/text extraction.
- Chưa có endpoint logs/runtime metrics.
