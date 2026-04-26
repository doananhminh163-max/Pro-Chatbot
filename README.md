# Pro Chatbot

Ứng dụng full-stack hỗ trợ trò chuyện với AI qua CLI, quản lý tài liệu cá nhân và lưu lịch sử hội thoại theo phiên. Dự án được tổ chức theo mô hình `backend` + `frontend`, dùng SQLite/Prisma để lưu metadata và dùng filesystem để lưu tệp người dùng.

## 1. Mục tiêu dự án

Hệ thống này được xây để:

- cung cấp giao diện chat cho người dùng cuối;
- cho phép đính kèm tài liệu vào từng phiên làm việc với AI;
- cá nhân hóa cách AI phản hồi theo hồ sơ người dùng;
- quản lý lịch sử phiên chat, tài liệu và tài khoản trên cùng một workspace.

## 2. Trạng thái triển khai hiện tại

### Đã kết nối backend thật

- Đăng ký, đăng nhập, đăng xuất bằng JWT cookie.
- Đăng nhập Google OAuth.
- Quên mật khẩu và đặt lại mật khẩu qua email SMTP.
- Hồ sơ người dùng và cá nhân hóa AI.
- Upload, preview, download, xóa tài liệu.
- Tạo phiên chat, gửi tin nhắn, xem lịch sử, đổi tên phiên, xóa phiên.
- Lấy danh sách provider/model/agent từ database để đổ vào cấu hình chat.

### Mới ở mức scaffold hoặc dữ liệu mẫu

- Dashboard client đang hiển thị số liệu mock.
- Memory page là giao diện demo, chưa có backend riêng.
- Settings page mới điều khiển theme ở frontend; các tùy chọn khác chưa lưu thật.
- Toàn bộ Admin Console hiện là giao diện quản trị mẫu, chưa gọi API CRUD thật.
- Trường `Document.extractedText` đã có trong schema nhưng chưa có pipeline parse/OCR thực tế.
- Logic fallback provider chưa được hiện thực dù UI và metadata đã chừa chỗ.

## 3. Kiến trúc công nghệ

- Frontend: React 19, Vite, TypeScript, Material UI, SCSS, React Router.
- Backend: Node.js, Express 5, TypeScript.
- Database: SQLite + Prisma ORM.
- Authentication: JWT trong cookie HttpOnly + Google OAuth.
- Email: Nodemailer qua SMTP.
- File storage: filesystem cục bộ theo cây thư mục người dùng/phiên.
- AI execution: gọi CLI ngoài qua `spawn`, bọc PowerShell trên Windows.

## 4. Cấu trúc thư mục

```text
report_analizing/
├── backend/                # API server, Prisma schema, seed, services
├── frontend/               # SPA React + Vite
├── docs/                   # Tài liệu dự án
├── GEMINI.md               # Ngữ cảnh làm việc cũ cho AI agent
├── package.json            # Scripts chạy toàn dự án
└── README.md               # Tài liệu vào cửa của dự án
```

## 5. Cách chạy nhanh

### Bước 1: cài dependency

```bash
npm run install:all
```

### Bước 2: cấu hình backend

Tạo file `backend/.env` từ `backend/.env.example` rồi điền đầy đủ biến môi trường bắt buộc.

Lưu ý quan trọng:

- `backend/src/config/env.ts` đang đọc hầu hết biến môi trường ở chế độ bắt buộc.
- Dù chưa dùng Google OAuth hoặc SMTP ngay, bạn vẫn phải khai báo giá trị cho các biến liên quan để backend khởi động.
- `USER_DOCS_ROOT` cần trỏ tới vùng lưu trữ thật của tài liệu người dùng, ví dụ `D:\Projects\user_docs\store`.
- `SANDBOX_ROOT` cần trỏ tới vùng làm việc tạm của broker, ví dụ `D:\Projects\user_docs\sandbox`.
- Không cấu hình `SANDBOX_ROOT` trỏ vào cùng cây thư mục với `USER_DOCS_ROOT`.

### Bước 3: generate Prisma client

```bash
npm run prisma:generate
```

### Bước 4: chạy đồng thời frontend + backend

```bash
npm run dev
```

Frontend mặc định chạy tại `http://localhost:5173`, backend tại `http://localhost:8080`.

## 6. Luồng nghiệp vụ quan trọng

### Upload tài liệu

1. Frontend gửi `multipart/form-data` tới `/api/documents/upload`.
2. Backend lưu tệp vật lý vào `USER_DOCS_ROOT/<userId>` hoặc `USER_DOCS_ROOT/<userId>/<sessionId>`.
3. Backend ghi metadata vào bảng `Document`.

### Gửi tin nhắn chat

1. Frontend có thể upload trước các file đính kèm.
2. Backend tạo hoặc tìm `ChatSession`.
3. Nếu file đang ở thư mục gốc người dùng, backend sẽ di chuyển vật lý vào thư mục của session.
4. Backend tạo `Message` của người dùng và gắn `Document` vào message đó.
5. Backend dựng prompt từ lịch sử 20 tin nhắn gần nhất + personalization.
6. Backend copy attachment sang `SANDBOX_ROOT/jobs/<jobId>` và tạo `attachments-context.txt`.
7. Backend gọi sandbox broker nội bộ, broker chỉ làm việc trong workspace tạm đó.
8. Backend nhận kết quả và lưu phản hồi thành `Message` của AI hoặc `SYSTEM`.

### Xóa session

1. Backend xóa thư mục vật lý của session trong `USER_DOCS_ROOT`.
2. Sau đó xóa bản ghi `ChatSession`.
3. Nhờ `onDelete: Cascade`, toàn bộ `Message` liên quan cũng bị xóa.

## 7. Dữ liệu seed

Khi chạy `npm --prefix backend run dev`, backend sẽ seed:

- Provider: `gemini`
- Models Gemini mặc định
- Agents: `report-strategist`, `debug-operator`, `meeting-brief`

Seed hiện không tạo sẵn tài khoản admin hoặc user mẫu.

## 8. Tài liệu chi tiết

- [docs/OVERVIEW.md](./docs/OVERVIEW.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/DATABASE.md](./docs/DATABASE.md)
- [docs/API.md](./docs/API.md)
- [docs/UI_DESIGN.md](./docs/UI_DESIGN.md)
- [docs/SETUP.md](./docs/SETUP.md)
- [docs/SANDBOX_BROKER_SPEC.md](./docs/SANDBOX_BROKER_SPEC.md)

## 9. Ghi chú kỹ thuật cần biết

- Backend hiện dùng mô hình `main backend` + `sandbox broker` nội bộ cho thực thi CLI.
- Tài liệu thật của người dùng phải nằm trong `USER_DOCS_ROOT` và tách biệt khỏi `SANDBOX_ROOT`.
- Broker chỉ nên được cấp quyền trên `SANDBOX_ROOT`, không trên `USER_DOCS_ROOT`.
- API chat chấp nhận `provider: gemini | opencode`, nhưng seed mặc định chỉ có `gemini`.
- Trên giao diện, nhiều màn admin dùng dữ liệu cứng để mô phỏng tương lai, không phản ánh dữ liệu thật từ database.
