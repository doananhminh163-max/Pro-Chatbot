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

Giao diện quản trị hiện đã có cấu trúc màn hình, nhưng phần lớn vẫn ở trạng thái demo/scaffold. Trong code hiện tại, admin chưa có backend CRUD tương ứng cho các màn như Users, Agents, Providers, Logs.

Skill và MCP không còn được quản lý trong database của project; các capability kiểu này được kỳ vọng đặt trực tiếp trong `C:\Users\Admin\.agents`.

## 3. Giá trị cốt lõi của hệ thống

### Chat theo session

Mỗi phiên chat được lưu thành một `ChatSession`, có tiêu đề riêng và danh sách `Message` riêng. Điều này cho phép người dùng quay lại một cuộc hội thoại cũ mà không làm trộn ngữ cảnh giữa các chủ đề.

### Quản lý tài liệu theo người dùng và phiên

Tài liệu được lưu ra filesystem theo cây thư mục lưu trữ thật:

```text
D:\Projects\user_docs\
├── store\
│   └── <userId>\
│       ├── <file>
│       └── <sessionId>\
│           └── <file>
└── sandbox\
    └── jobs\
        └── <jobId>\
```

Điểm đặc biệt là khi người dùng gửi tin nhắn có đính kèm file, backend có thể di chuyển file vật lý từ thư mục người dùng sang thư mục của session tương ứng để đồng bộ trạng thái lưu trữ. Sau đó backend copy attachment sang workspace sandbox riêng cho broker. Broker không được làm việc trực tiếp trong cây `store`.

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
- Toggle Memory ngay trong màn chat để bật/tắt việc dùng `global memory` cho lượt chat tiếp theo.
- Memory page đọc dữ liệu thật từ backend (`global memories`) và hỗ trợ xóa memory toàn cục.

### Chức năng mới ở mức khung giao diện

- Dashboard hiển thị số liệu mẫu, chưa lấy dữ liệu thật.
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
3. Backend copy attachment sang `D:\Projects\user_docs\sandbox\jobs\<jobId>`.
4. Broker chỉ đọc các file Markdown đã extract trong sandbox và `attachments-context.txt` do backend chuẩn bị từ các file đó.
5. Kết quả được lưu thành `Message` của AI.

### Luồng 3: tiếp tục công việc cũ

1. Người dùng vào trang Sessions.
2. Chọn một session cũ.
3. Frontend tải lại toàn bộ lịch sử tin nhắn và danh sách tài liệu của phiên.
4. Người dùng tiếp tục gửi tin nhắn mới trên cùng session đó.

### Luồng 4: memory tự động theo từng lượt chat

1. Trước khi gọi CLI, backend chỉ nạp `global memory` nếu người dùng bật Memory trong màn chat.
2. Prompt chính chỉ chứa tối đa 50 tin nhắn gần nhất của người dùng, kèm personalization và `global memory`.
3. Prompt text bị giới hạn `<= 2000` ký tự; nếu dài hơn, người dùng phải gửi file `<= 20MB`.
4. Mỗi session chỉ chấp nhận tối đa 50 tin nhắn từ phía người dùng; vượt ngưỡng thì backend trả `SYSTEM` message yêu cầu tạo session mới.
5. Sau khi có phản hồi AI, backend chạy thêm một bước extraction để cập nhật `global memory` từ transcript user gần nhất.
6. Hệ thống upsert memory theo tiêu đề, cập nhật `lastUsedAt`, và tự cắt theo ngưỡng `GLOBAL=12`.

## 6. Ràng buộc và giới hạn hiện tại

- Hệ thống phụ thuộc vào CLI cài sẵn trên máy chạy backend.
- Backend yêu cầu nhiều biến môi trường bắt buộc, kể cả cho các tính năng chưa dùng ngay.
- Chưa có cơ chế phân quyền admin riêng ở tầng API ngoài việc kiểm tra role ở frontend routing.
- Đã có pipeline extract Markdown thật cho `xlsx`, `csv`, `pdf`, `docx`, `image`, và text trước khi attachment được đưa vào sandbox.
- Chưa có fallback thực giữa nhiều provider trong `chat.service.ts`.
- Hệ thống thiên về môi trường Windows và phụ thuộc vào việc cấu hình ACL đúng giữa `store` và `sandbox`.

## 7. Khi nào nên đọc tiếp tài liệu nào

- Muốn hiểu kiến trúc và luồng dữ liệu: xem `ARCHITECTURE.md`
- Muốn hiểu schema Prisma và quan hệ dữ liệu: xem `DATABASE.md`
- Muốn tích hợp hoặc test API: xem `API.md`
- Muốn chạy dự án và cấu hình môi trường: xem `SETUP.md`
- Muốn nắm trạng thái màn hình frontend: xem `UI_DESIGN.md`
- Muốn hiểu về sandbox broker: xem `SANDBOX_BROKER_SPEC.md`
