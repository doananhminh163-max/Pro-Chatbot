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

### `GET /api/chat/memory`

Trả tổng quan memory của user hiện tại.

Response:

```json
{
  "overview": {
    "globalMemories": [
      {
        "id": "memory-id",
        "scope": "GLOBAL",
        "kind": "PREFERENCE",
        "title": "Preferred language",
        "content": "User prefers Vietnamese unless explicitly requested otherwise.",
        "importance": 85,
        "sessionId": null,
        "sessionTitle": null,
        "lastUsedAt": "2026-04-26T08:12:10.000Z"
      }
    ]
  }
}
```

### `DELETE /api/chat/memory/global`

Xóa toàn bộ global memory của user hiện tại.

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
  "memoryEnabled": true,
  "agent": "report-strategist",
  "attachments": ["document-id-1", "document-id-2"]
}
```

Ghi chú:

- `sessionId` có thể bỏ qua, backend sẽ tự tạo session mới.
- `content` có thể rỗng nếu có file đính kèm; backend sẽ dùng mặc định `"Read and summarize the attachments."`.
- `content` bị giới hạn `<= 2000` ký tự; nếu dài hơn, người dùng phải upload file `<= 20MB`.
- `provider` hiện chấp nhận `gemini` và `opencode`.
- `memoryEnabled` bật/tắt việc nạp `global memory` cho lượt chat hiện tại; mặc định là `true`.
- Mỗi session chỉ chấp nhận tối đa `50` tin nhắn từ phía user. Nếu vượt ngưỡng, backend trả về `assistantMessage.sender = SYSTEM` với nội dung yêu cầu mở session mới.
- Sau khi lưu phản hồi AI, backend sẽ chạy thêm một lượt extraction để cập nhật `global memory`.

Nếu CLI lỗi, `assistantMessage.sender` sẽ là `SYSTEM`.

## 4. Documents API

Tất cả endpoint document yêu cầu đăng nhập.

### `POST /api/documents/upload`

Upload một file và extract ngay sang Markdown trước khi file đó có thể được dùng trong chat.

Ghi chú:

- Chỉ các loại file có extractor mới được chấp nhận cho luồng chat attachment.
- Backend hiện extract `xlsx`, `csv`, `pdf`, `docx`, `image`, và text sang `Document.extractedText`.
- Nếu extraction thất bại hoặc loại file không được hỗ trợ, upload trả lỗi `400`.
- Mỗi file upload bị giới hạn `<= 20MB`.

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
