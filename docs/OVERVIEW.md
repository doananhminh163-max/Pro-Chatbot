# Tổng quan dự án

## Mục lục

1. Dự án này là gì
2. Đối tượng sử dụng
3. Giá trị cốt lõi
4. Tính năng đã hoạt động
5. Khu vực chưa hoàn thiện
6. Luồng sử dụng điển hình
7. Tài liệu nên đọc tiếp

## 1. Dự án này là gì

`Pro Chatbot` là một ứng dụng web full-stack cho phép người dùng:

- trò chuyện với AI thông qua runtime/CLI chạy ở backend;
- upload và quản lý tài liệu cá nhân;
- gắn tài liệu vào từng phiên chat;
- lưu lịch sử hội thoại theo session;
- cá nhân hóa cách AI phản hồi.

Hệ thống không gọi model trực tiếp từ trình duyệt. Frontend gọi backend, backend dựng prompt, chuẩn bị sandbox/runtime, gọi CLI, và lưu kết quả.

## 2. Đối tượng sử dụng

### Client

Người dùng cuối có thể:

- đăng nhập và quản lý hồ sơ;
- chat với AI;
- đính kèm tài liệu để phân tích;
- xem và tiếp tục các session cũ;
- cấu hình personalization và memory.

### Admin

Khu admin hiện đã có backend thật dưới namespace `/api/admin`.

Trạng thái hiện tại:

- `Users`: đọc dữ liệu thật từ backend, read-only.
- `Providers`: đọc provider/model inventory thật, read-only.
- `Agents`: có CRUD thật, audit history, skill catalog, MCP catalog.
- `Config`: đọc runtime config thật, read-only.
- `Logs`: đọc system logs thật, có filter.

Skill và MCP không nằm trong schema Prisma. Chúng được quản lý ngoài project và nạp vào runtime theo agent.

## 3. Giá trị cốt lõi

### Chat theo session

Mỗi cuộc hội thoại được lưu thành một `ChatSession` riêng, có title riêng và danh sách `Message` riêng.

### Quản lý tài liệu theo user và session

Tài liệu được lưu trên filesystem. Khi cần, backend có thể:

- chuyển file từ user scope sang session scope;
- extract Markdown/OCR vào `Document.extractedText`;
- copy artifact cần thiết vào sandbox job.

### Cá nhân hóa AI

Mỗi user có thể lưu:

- `aiTone`
- `aiLanguage`
- `aiResponseLength`
- `customInstructions`

Backend chèn các thông tin này vào runtime request.

## 4. Tính năng đã hoạt động

- Đăng ký / đăng nhập email-password.
- Đăng nhập bằng username.
- Google OAuth.
- Quên mật khẩu / reset mật khẩu.
- Cập nhật profile và personalization.
- Upload / preview / download / xóa document.
- Tạo session mới, đổi tên session, xóa session, xóa toàn bộ session.
- Chat với provider/model/agent.
- Toggle global memory ngay trong màn chat.
- Memory page đọc dữ liệu thật và cho phép xóa global memory.
- Admin users overview đọc dữ liệu thật.
- Admin providers catalog đọc dữ liệu thật.
- Admin agents workspace có CRUD thật.
- Admin config đọc runtime config thật.
- Admin logs đọc system log thật.

## 5. Khu vực chưa hoàn thiện

- Dashboard vẫn dùng dữ liệu mẫu.
- Settings page ngoài theme vẫn chủ yếu là placeholder.
- Users / Providers / Config / Logs trong admin chủ yếu là read-only, chưa có write actions đầy đủ.
- Chat hiện chưa stream token thật từng phần từ server.
- Chưa có health check riêng và metrics sâu hơn.

## 6. Luồng sử dụng điển hình

### Tạo một session chat mới

1. User đăng nhập.
2. Mở trang Chat.
3. Chọn provider, model, agent.
4. Nhập prompt hoặc đính kèm file.
5. Frontend upload file trước nếu cần.
6. Frontend gọi API chat.
7. Backend tạo session nếu chưa có.
8. Backend chuẩn bị sandbox/runtime và gọi CLI.
9. Kết quả được lưu thành `Message`.

### Phân tích tài liệu

1. User upload hoặc đính kèm file.
2. Backend extract Markdown/OCR.
3. File được đưa vào sandbox job theo session.
4. Runtime chỉ làm việc trong sandbox, không trực tiếp trên cây `store`.

### Quản trị agent

1. Admin vào `/admin/agents`.
2. Chọn profile bằng dropdown hoặc tạo draft mới.
3. Nếu cần, bấm `Show Detail` để mở prompt/skills/MCP/audit.
4. Chỉnh sửa profile.
5. Bấm `Update` hoặc `Create Agent`.

## 7. Tài liệu nên đọc tiếp

- Kiến trúc tổng thể: `ARCHITECTURE.md`
- Schema và quan hệ dữ liệu: `DATABASE.md`
- API chi tiết: `API.md`
- Setup và môi trường: `SETUP.md`
- Trạng thái frontend/UI: `UI_DESIGN.md`
- Sandbox broker: `SANDBOX_BROKER_SPEC.md`

