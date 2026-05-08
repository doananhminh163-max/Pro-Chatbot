# Kiến trúc hệ thống

## Mục lục

1. Tổng quan kiến trúc
2. Kiến trúc frontend
3. Kiến trúc backend
4. Luồng xác thực
5. Luồng quản lý tài liệu
6. Luồng chat và thực thi AI
7. Luồng đồng bộ file với session
8. Dữ liệu và cấu hình
9. Những gì kiến trúc chưa có

## 1. Tổng quan kiến trúc

Hệ thống gồm 4 lớp chính:

1. Frontend SPA viết bằng React/Vite.
2. Backend REST API viết bằng Express/TypeScript.
3. SQLite + Prisma để lưu metadata nghiệp vụ.
4. Filesystem + CLI ngoài để lưu tài liệu và thực thi AI.

Sơ đồ logic:

```text
Browser (React)
    |
    v
Express API
    | \
    |  \-- Storage FS (tài liệu người dùng thật)
    |
    \---- Prisma + SQLite (user, session, message, document, config)
    |
    \---- Sandbox Broker
             |
             \-- Sandbox FS (job workspace tạm)
             |
             \-- External CLI (Gemini / OpenCode)
```

## 2. Kiến trúc frontend

### Stack

- React 19
- Vite
- TypeScript
- Material UI
- React Router
- Axios
- SCSS

### Vai trò

Frontend là SPA chạy trên trình duyệt, chịu trách nhiệm:

- xác thực người dùng;
- điều hướng giữa các màn hình;
- gọi REST API với `withCredentials: true`;
- giữ trạng thái người dùng trong `AuthContext`;
- hiển thị lịch sử chat, tài liệu và cấu hình cá nhân hóa.

### Cấu trúc chính

```text
frontend/src/
├── App.tsx
├── contexts/
├── layouts/
├── pages/
│   ├── public/
│   ├── client/
│   └── admin/
├── services/
└── components/
```

### Ghi chú thực tế

- Frontend route bảo vệ bằng `ProtectedRoute` và `AdminRoute`.
- Việc kiểm tra quyền admin hiện ở tầng frontend; backend chưa có bộ route admin riêng.
- `ChatPage` là màn quan trọng nhất và là màn tích hợp backend sâu nhất.

## 3. Kiến trúc backend

### Stack

- Node.js
- Express 5
- TypeScript
- Prisma
- SQLite
- Passport Google OAuth 2.0
- Nodemailer
- Multer

### Cấu trúc chính

```text
backend/src/
├── app.ts
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── utils/
└── types/
```

### Tư duy phân lớp

- `routes`: map URL vào controller.
- `controllers`: parse request, validate payload, trả response.
- `services`: xử lý logic nghiệp vụ và thao tác Prisma/filesystem/CLI.
- `config`: kết nối tài nguyên ngoài như env, Prisma, Passport.

## 4. Luồng xác thực

### Email/password

1. Người dùng gọi `/api/auth/register` hoặc `/api/auth/login`.
2. Backend xác thực dữ liệu đầu vào bằng `zod`.
3. Service thao tác với `User` trong database.
4. Backend ký JWT.
5. JWT được trả về dưới dạng cookie HttpOnly tên `access_token`.

### Google OAuth

1. Frontend điều hướng tới `/api/auth/google`.
2. Passport Google Strategy xác thực người dùng.
3. Backend tạo mới hoặc cập nhật user theo email.
4. Backend set cookie JWT và redirect về `/dashboard`.

### Quên mật khẩu

1. Người dùng gọi `/api/auth/forgot-password`.
2. Backend tạo token reset, hash token rồi lưu vào `User`.
3. Nodemailer gửi email chứa link reset.
4. Frontend đọc token từ URL, gọi `/api/auth/reset-password`.

## 5. Luồng quản lý tài liệu

### Upload

`document.controller.ts` dùng `multer.diskStorage` để quyết định nơi lưu file trong vùng storage thật:

- có `sessionId`: lưu vào `USER_DOCS_ROOT/<userId>/<sessionId>`
- không có `sessionId`: lưu vào `USER_DOCS_ROOT/<userId>`

Sau khi file được lưu vật lý, backend tạo bản ghi `Document`.

Khuyến nghị production:

- `USER_DOCS_ROOT=D:\Projects\user_docs\store`
- `SANDBOX_ROOT=D:\Projects\user_docs\sandbox`

Không cho broker làm việc trực tiếp trong `USER_DOCS_ROOT`.

### Tải xuống và preview

- `GET /api/documents/:id/download`: dùng `response.download`
- `GET /api/documents/:id/preview`: dùng `response.sendFile`

### Xóa

- xóa file vật lý nếu còn tồn tại;
- xóa metadata trong database.

## 6. Luồng chat và thực thi AI

### Cách backend dựng prompt

`chat.service.ts` lấy:

- tối đa 50 message gần nhất từ phía người dùng trong session;
- nội dung người dùng vừa gửi;
- personalization của user;
- model, trạng thái bật/tắt memory và agent do frontend chọn;
- memory context từ `memory.service.ts` (chỉ global memory khi người dùng bật Memory).

Sau đó backend tạo prompt text thuần với cấu trúc:

- vai trò trợ lý;
- profile agent;
- model hint;
- memory mode;
- tone/language/response length;
- custom instructions;
- global user/work memory;
- user-message history;
- latest user message.

### Cơ chế memory lifecycle

1. Trước khi gửi prompt chính, backend gọi `buildMemoryPromptContext(userId, memoryEnabled)`.
2. Nếu `memoryEnabled = true`, backend nạp `MemoryEntry` scope `GLOBAL`; nếu không thì prompt đi tiếp mà không có memory.
3. Prompt chính chỉ chứa:
   - personalization settings;
   - tối đa 50 tin nhắn gần nhất của người dùng;
   - global user/work memory nếu đang bật.
4. Prompt text của user bị giới hạn `<= 2000` ký tự; nội dung dài hơn phải chuyển thành file `<= 20MB`.
5. Mỗi session chỉ cho phép tối đa 50 tin nhắn `USER`; vượt ngưỡng thì backend tạo `SYSTEM` message và không gọi AI.
6. Sau khi có phản hồi AI, backend gọi `refreshMemoriesForTurn(...)` để chạy prompt extraction riêng và cập nhật `MemoryEntry` scope `GLOBAL`.
7. Upsert memory dựa trên `title` (cùng user/scope), đồng thời cập nhật `lastUsedAt`.
8. Hệ thống tự cắt dữ liệu memory theo ngưỡng: global scope giữ tối đa 12 bản ghi quan trọng nhất.

### Cách backend gọi CLI

1. Backend chuẩn bị `job workspace` trong `SANDBOX_ROOT/jobs/<jobId>`.
2. Backend tạo file Markdown cho từng attachment được phép trong workspace đó.
3. Backend dựng `attachments-context.txt` từ chính các file Markdown đã extract.
4. Broker đọc command template từ `.env`.
5. Broker thay placeholder `{model}` hoặc `{{model}}` hoặc `$MODEL`.
6. Broker chạy CLI trực tiếp với `shell: false`.
7. Nếu có attachment context, broker feed nội dung đó qua `stdin`.

### Điểm cần lưu ý

- Code được thiết kế cho `gemini` và `opencode`.
- Tuy nhiên `generateReply()` hiện chỉ gọi đúng provider được yêu cầu, chưa có retry/fallback thật.
- Trường `fallbackUsed` vẫn có trong response nhưng hiện gần như luôn là `false`.

## 7. Luồng đồng bộ file với session

Khi người dùng gửi tin nhắn có `attachmentIds`:

1. Backend tìm hoặc tạo session.
2. Tạo thư mục vật lý cho session nếu chưa có.
3. Duyệt toàn bộ tài liệu được đính kèm.
4. Nếu file đang nằm ngoài thư mục session, backend `renameSync` sang thư mục của session.
5. Cập nhật `sessionId` và `filePath` trong database.
6. Tạo `Message` của user và `connect` các `Document` vào message đó.
7. Ghi từng attachment thành file `.md` trong `SANDBOX_ROOT/jobs/<jobId>/input`.
8. Broker chỉ xử lý các Markdown artifact trong sandbox, không xử lý trực tiếp file nhị phân nằm trong session storage.

Kết quả là storage vật lý và storage logic luôn đi cùng nhau.

## 8. Dữ liệu và cấu hình

### Dữ liệu runtime

- User, Session, Message, Document nằm trong SQLite.
- File binary thật nằm ngoài DB, trong `USER_DOCS_ROOT`.
- File tạm để broker làm việc nằm trong `SANDBOX_ROOT`.

### Dữ liệu seed

Khi backend chạy `dev`, script seed sẽ:

- đảm bảo có provider `gemini`;
- thêm danh sách model Gemini;
- thêm 3 agent mẫu.

### Cấu hình môi trường

Backend phụ thuộc nặng vào `.env`. Những nhóm biến chính:

- cổng và URL frontend;
- JWT;
- Google OAuth;
- SMTP;
- command template cho CLI;
- timeout CLI;
- đường dẫn root lưu tài liệu.

## 9. Những gì kiến trúc chưa có

- Chưa có queue/background job cho xử lý file nặng.
- Đã có parser/OCR pipeline riêng cho `xlsx/csv/pdf/docx/image/text` trước khi CLI đọc attachment.
- Chưa có logging tập trung hoặc audit trail thực.
- Chưa có API admin chuyên biệt.
- Chưa có storage cloud; mọi thứ đang lưu local.
- Chưa có cơ chế streaming token từng phần từ CLI lên UI.
