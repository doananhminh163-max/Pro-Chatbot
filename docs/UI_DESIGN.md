# Thiết kế UI và trạng thái màn hình

## Mục lục

1. Nguyên tắc giao diện
2. Cấu trúc điều hướng
3. Màn hình public
4. Màn hình client
5. Màn hình admin
6. Motion và phản hồi trạng thái
7. Đánh giá mức độ hoàn thiện frontend
8. Cập nhật giao diện và tối ưu chat
9. Cập nhật hiện trạng admin

Tài liệu này mô tả giao diện hiện tại của frontend theo đúng trạng thái triển khai thật, không chỉ theo ý tưởng thiết kế.

## 1. Nguyên tắc giao diện

### Bố cục tổng thể

Ứng dụng dùng mô hình workspace:

- sidebar điều hướng bên trái;
- vùng nội dung chính ở giữa;
- layout tách riêng cho Client, Admin và Profile.

### Theme

- Có hỗ trợ dark mode và light mode qua `ThemeContext`.
- Theme toggle đang hoạt động ở frontend.
- Một số tùy chọn settings khác hiện mới là UI, chưa lưu xuống backend.

### Ngôn ngữ giao diện

Hiện trong code có sự pha trộn giữa tiếng Anh và tiếng Việt:

- tên màn hình, label chính đa phần là tiếng Anh;
- một số nội dung mô tả và ví dụ có tiếng Việt;
- prompt/personalization mặc định của AI thiên về tiếng Việt.

## 2. Cấu trúc điều hướng

### Client Workspace

- Dashboard
- Chatbot
- Documents
- Memory
- Personalization
- Settings
- Profile

### Admin Console

- Users
- Agents
- Providers
- CLI Config
- Logs

## 3. Màn hình public

### Login

Đã kết nối backend thật:

- đăng nhập bằng email/username + mật khẩu;
- nút đăng nhập bằng Google OAuth;
- điều hướng tới dashboard khi thành công.

### Register

Đã kết nối backend thật:

- tạo tài khoản mới;
- set session đăng nhập ngay sau khi đăng ký.

### Forgot Password

Đã kết nối backend thật:

- gửi yêu cầu reset mật khẩu;
- hiển thị thông báo thành công chung.

### Reset Password

Đã kết nối backend thật:

- đọc `token` từ URL;
- gửi password mới về backend.

## 4. Màn hình client

### Dashboard

Vai trò:

- làm landing page sau đăng nhập;
- hiển thị overview hệ thống và quick actions.

Trạng thái hiện tại:

- bố cục hoàn chỉnh;
- số liệu, biểu đồ, provider mix đang là dữ liệu mock;
- các nút quick action chưa gắn hành vi đầy đủ.

### Chat

Đây là màn hoàn thiện nhất của hệ thống.

Các khu vực chính:

- cột trái là luồng hội thoại;
- phần composer hỗ trợ nhập nhiều dòng và attach file;
- cột phải là panel cấu hình agent/provider/model và danh sách attachment.

Hành vi đã có:

- tải config từ backend;
- tải session hiện tại theo URL hoặc session gần nhất;
- gửi tin nhắn;
- upload file trước khi gửi;
- hiển thị trạng thái `Ready`, `Thinking`, `Streaming`, `Error`;
- render markdown cơ bản cho phản hồi AI;
- copy code block;
- retry lại draft bị lỗi.

Điểm cần lưu ý:

- panel cấu hình có switch `Enable global memory` để bật/tắt memory ngay trong phiên chat.
- lựa chọn `memoryEnabled` được gửi trực tiếp trong payload `POST /api/chat/messages`.
- composer hiển thị bộ đếm `2000` ký tự và bộ đếm `50` user messages/session; khi chạm ngưỡng thì nút gửi bị khóa và hiển thị cảnh báo.
- frontend có fallback options cho provider/model, nhưng seed mặc định chỉ có Gemini.
- streaming hiện là trạng thái mô phỏng giao diện, chưa phải streaming token thật từ server.

### Documents

Đã kết nối backend thật.

Hành vi:

- upload file;
- tìm kiếm theo tên file;
- hiển thị type, size, session liên quan;
- download;
- preview trên tab mới;
- xóa từng file hoặc xóa toàn bộ.

Điểm UX tốt:

- document nào đã gắn session sẽ có link thẳng sang màn chat của session đó.

### Sessions

Đã kết nối backend thật.

Hành vi:

- tải danh sách session;
- tìm kiếm theo tiêu đề;
- mở lại session;
- đổi tên session;
- xóa từng session;
- xóa toàn bộ session.

### Personalization

Đã kết nối backend thật qua `PATCH /api/auth/profile`.

Cho phép lưu:

- tone;
- ngôn ngữ phản hồi;
- độ dài phản hồi;
- custom instructions.

Trang này là cầu nối trực tiếp với logic dựng prompt ở backend.

### Profile

Đã kết nối backend thật.

Cho phép cập nhật:

- username;
- full name;
- phone;
- avatar.

Avatar hiện được đọc bằng `FileReader` ở frontend và gửi lên backend dưới dạng chuỗi.

### Memory

Trạng thái hiện tại:

- đã kết nối backend thật qua các endpoint:
  - `GET /api/chat/memory`
  - `DELETE /api/chat/memory/global`
- hiển thị 3 nhóm dữ liệu: session summaries, global memories, session memories gần đây.
- hỗ trợ xóa global memory toàn cục.

### Settings

Trạng thái hiện tại:

- toggle dark mode hoạt động thật qua `ThemeContext`;
- các setting khác như startup page, auto attach, notifications mới là UI placeholder.

## 5. Màn hình admin

Toàn bộ các trang admin hiện dùng `AdminCrudTable` hoặc danh sách mock để mô phỏng màn quản trị tương lai.

### Users

- dữ liệu mock
- chưa có API backend

### Agents

- dữ liệu mock dù backend đã có bảng `Agent`
- chưa có route CRUD để nối dữ liệu thật

### Providers

- dữ liệu mock dù backend đã có `Provider` và `Model`
- chưa có route CRUD quản trị

### CLI Config

- mới là form giao diện
- chưa lưu vào backend hoặc `.env`

### Logs

- dữ liệu mock
- chưa đọc log runtime thật

## 6. Motion và phản hồi trạng thái

Các pattern UX hiện tại:

- bong bóng AI có placeholder animated khi đang xử lý;
- state chip phản ánh tình trạng gửi tin;
- file local chưa upload trong composer được tô trạng thái "Ready";
- danh sách code block có nút copy riêng.

Nhìn chung, giao diện chat đã được chăm chút tốt hơn phần còn lại của hệ thống.

## 7. Đánh giá mức độ hoàn thiện frontend

### Đã sẵn sàng cho luồng chính

- xác thực;
- chat;
- documents;
- sessions;
- personalization;
- profile.

### Cần phát triển tiếp

- dashboard dữ liệu thật;
- memory nâng cao (edit thủ công, pin/unpin, lọc theo loại);
- admin CRUD thật;
- config runtime thật;
- log viewer thật;
- chuẩn hóa ngôn ngữ hiển thị;
- tối ưu các hành vi quick action.

## 8. Cập nhật giao diện và tối ưu chat

### Chatbot

- `ChatPage` đã được tách thành các khối riêng cho message stream, composer và config panel.
- luồng render message được cô lập khỏi ô nhập liệu để giảm rerender khi người dùng đang gõ prompt;
- lịch sử hội thoại được áp dụng `startTransition` khi tải lại session lớn;
- markdown message được parse theo từng message và memo hóa ở component riêng;
- message row có `content-visibility` để giảm chi phí paint với session dài.

### Admin side

- `AdminLayout` và `WorkspaceLayout` đã đổi sang hướng "operations control room";
- sidebar có branding, telemetry block và status chip riêng cho khu admin;
- các trang CRUD admin được nâng cấp với summary cards, search/filter toolbar và insight rail;
- `Config` và `Logs` đã dùng chung visual language mới để tránh lệch tông giao diện.

### Ghi chú

- dữ liệu admin vẫn là mock data, thay đổi này tập trung vào shell, khả năng đọc trạng thái và khả năng mở rộng cho CRUD thật;
- tài liệu này cần tiếp tục cập nhật khi admin được nối backend thật cho Users, Agents, Providers, Logs và CLI policy.

## 9. Cập nhật hiện trạng admin

Phần mô tả admin ở các mục bên trên đã chậm hơn implementation hiện tại. Trạng thái đúng theo codebase bây giờ là:

### Admin Console

- `UsersPage` đã đọc dữ liệu thật từ backend qua `fetchAdminOverview()` và `fetchAdminUsers()`, nhưng vẫn là read-only.
- `ProvidersPage` đã đọc provider/model inventory thật từ backend qua `fetchAdminProviders()`, nhưng chưa có CRUD.
- `ConfigPage` đã đọc cấu hình runtime thật từ backend qua `fetchAdminConfig()`, và có chủ đích read-only.
- `LogsPage` đã đọc log hệ thống thật từ backend qua `fetchAdminLogs()`, có filter theo session/user/agent/nội dung.
- `AgentsPage` đã nối backend thật qua `GET/POST/PATCH/DELETE /api/admin/agents`.

### Agents Page

- giao diện hiện tại ưu tiên "compact first" thay vì phơi toàn bộ thông tin ngay khi mở trang.
- người dùng chọn agent bằng dropdown `Agent profile`.
- có nút `Show Detail` / `Hide Detail` để bật tắt toàn bộ phần chi tiết.
- có nút `Update` để lưu thay đổi cho profile hiện tại; khi tạo mới thì nút đổi thành `Create Agent`.
- prompt, skills, MCP surface, bundle manifest và audit timeline đều nằm trong `Accordion` / `Collapse`.
- catalog skill/MCP đọc từ backend workspace thật và cho phép bật/tắt từng mục ngay trong editor.

### Ghi chú doc này

- nếu có xung đột giữa mục 5/8 ở trên và implementation hiện tại, ưu tiên thông tin trong mục 9 này.
