# Tổng quan dự án

## 1. Dự án này là gì

`Pro Chatbot` là một ứng dụng web full-stack để người dùng:

- trò chuyện với AI thông qua các CLI cục bộ;
- tải lên và quản lý tài liệu cá nhân;
- gắn tài liệu vào từng phiên chat;
- lưu lịch sử hội thoại và tiếp tục làm việc theo session;
- cá nhân hóa phong cách phản hồi của AI theo hồ sơ người dùng.

Hệ thống không phải là một chatbot SaaS dùng API trực tiếp từ trình duyệt. Thay vào đó, backend đóng vai trò điều phối: nhận request từ frontend, dựng prompt, gọi CLI AI trên máy chủ và lưu lại kết quả.

## 2. Đối tượng sử dụng

### Client

Người dùng cuối sử dụng hệ thống để:

- đăng nhập và quản lý hồ sơ cá nhân;
- gửi câu hỏi cho AI;
- đính kèm tài liệu phục vụ phân tích;
- xem và quản lý lịch sử làm việc.

### Admin

Giao diện quản trị hiện đã có cấu trúc màn hình, nhưng phần lớn vẫn ở trạng thái demo/scaffold. Trong code hiện tại, admin chưa có backend CRUD tương ứng cho các màn như Users, Skills, MCPs, Agents, Providers, Logs.

## 3. Giá trị cốt lõi của hệ thống

### Chat theo session

Mỗi phiên chat được lưu thành một `ChatSession`, có tiêu đề riêng và danh sách `Message` riêng. Điều này cho phép người dùng quay lại một cuộc hội thoại cũ mà không làm trộn ngữ cảnh giữa các chủ đề.

### Quản lý tài liệu theo người dùng và phiên

Tài liệu được lưu ra filesystem theo cây thư mục:

```text
USER_DOCS_ROOT/
└── <userId>/
    ├── <file>
    └── <sessionId>/
        └── <file>
```

Điểm đặc biệt là khi người dùng gửi tin nhắn có đính kèm file, backend có thể di chuyển file vật lý từ thư mục người dùng sang thư mục của session tương ứng để đồng bộ trạng thái lưu trữ.

### Cá nhân hóa AI

Mỗi user có thể lưu:

- `aiTone`
- `aiLanguage`
- `aiResponseLength`
- `customInstructions`

Các trường này được backend chèn vào prompt khi gọi CLI, giúp phản hồi bám theo sở thích người dùng trên mọi phiên.

## 4. Phạm vi chức năng thực tế

### Chức năng đã hoạt động

- Đăng ký tài khoản bằng email/mật khẩu.
- Đăng nhập bằng email hoặc username.
- Đăng nhập bằng Google OAuth.
- Quên mật khẩu và đặt lại mật khẩu qua email.
- Cập nhật hồ sơ cá nhân.
- Lưu cấu hình personalization cho AI.
- Upload tài liệu.
- Xem danh sách tài liệu, preview, download, xóa.
- Tạo session chat mới khi gửi tin đầu tiên.
- Tải lịch sử tin nhắn theo session.
- Đổi tên session, xóa một session, xóa toàn bộ session.
- Lấy cấu hình provider/model/agent từ database để hiển thị ở giao diện chat.

### Chức năng mới ở mức khung giao diện

- Dashboard hiển thị số liệu mẫu, chưa lấy dữ liệu thật.
- Memory page chưa có backend hay storage riêng.
- Settings page mới xử lý theme ở frontend.
- Admin Console mới mô phỏng dữ liệu quản trị.
- Config page ở admin chưa ghi cấu hình xuống backend.
- Log page chưa nối vào hệ thống log runtime thực.

## 5. Luồng sử dụng điển hình

### Luồng 1: bắt đầu một phiên chat mới

1. Người dùng đăng nhập.
2. Mở trang Chat.
3. Chọn agent, provider, model.
4. Gõ câu hỏi hoặc đính kèm file.
5. Frontend upload file trước, lấy `documentId`.
6. Frontend gọi API chat.
7. Backend tạo `ChatSession` nếu chưa có session.
8. Backend gọi CLI AI và lưu phản hồi.

### Luồng 2: phân tích tài liệu

1. Người dùng đính kèm file ở Chat hoặc upload từ Documents.
2. Nếu file đang ở mức global của user, backend sẽ chuyển file vào thư mục session khi tin nhắn được gửi.
3. Backend gửi nội dung prompt và pipe nội dung file vào CLI.
4. Kết quả được lưu thành `Message` của AI.

### Luồng 3: tiếp tục công việc cũ

1. Người dùng vào trang Sessions.
2. Chọn một session cũ.
3. Frontend tải lại toàn bộ lịch sử tin nhắn và danh sách tài liệu của phiên.
4. Người dùng tiếp tục gửi tin nhắn mới trên cùng session đó.

## 6. Ràng buộc và giới hạn hiện tại

- Hệ thống phụ thuộc vào CLI cài sẵn trên máy chạy backend.
- Backend yêu cầu nhiều biến môi trường bắt buộc, kể cả cho các tính năng chưa dùng ngay.
- Chưa có cơ chế phân quyền admin riêng ở tầng API ngoài việc kiểm tra role ở frontend routing.
- Chưa có parser/OCR thật cho `pdf`, `docx`, `xlsx` dù dependency đã được cài.
- Chưa có fallback thực giữa nhiều provider trong `chat.service.ts`.
- Hệ thống thiên về môi trường Windows do cách dựng lệnh qua PowerShell.

## 7. Khi nào nên đọc tiếp tài liệu nào

- Muốn hiểu kiến trúc và luồng dữ liệu: xem `ARCHITECTURE.md`
- Muốn hiểu schema Prisma và quan hệ dữ liệu: xem `DATABASE.md`
- Muốn tích hợp hoặc test API: xem `API.md`
- Muốn chạy dự án và cấu hình môi trường: xem `SETUP.md`
- Muốn nắm trạng thái màn hình frontend: xem `UI_DESIGN.md`
