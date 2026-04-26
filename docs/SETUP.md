# Hướng dẫn cài đặt và vận hành

## 1. Yêu cầu môi trường

### Công cụ bắt buộc

- Node.js đủ mới để chạy React 19, Vite 6, Prisma 6
- npm
- CLI AI tương ứng nếu muốn dùng chat:
  - `gemini`
  - hoặc `opencode`

### Hệ điều hành

Code hiện được tối ưu rõ rệt cho Windows vì backend dùng `powershell.exe` để bọc lệnh CLI. Có thể chạy ở môi trường khác, nhưng hành vi đường dẫn và execution path hiện được viết thiên về Windows.

## 2. Cài dependency

Từ thư mục gốc dự án:

```bash
npm run install:all
```

Lệnh này sẽ cài dependency cho:

- `backend`
- `frontend`

## 3. Cấu hình biến môi trường

### Tạo file `.env`

Sao chép:

```text
backend/.env.example -> backend/.env
```

### Các biến quan trọng

#### Database

- `DATABASE_URL`

Mặc định:

```env
DATABASE_URL="file:./prisma/dev.db"
```

#### Server

- `PORT`
- `NODE_ENV`
- `FRONTEND_URL`
- `RESET_PASSWORD_URL`
- `APP_NAME`

#### JWT

- `JWT_SECRET`
- `JWT_EXPIRES_IN`

#### Google OAuth

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`

#### SMTP

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

#### CLI AI

- `GEMINI_CLI_COMMAND`
- `OPENCODE_CLI_COMMAND`
- `CLI_TIMEOUT_MS`

#### File storage

- `USER_DOCS_ROOT`
- `SANDBOX_ROOT`

Ví dụ:

```env
USER_DOCS_ROOT=D:\Projects\user_docs\store
SANDBOX_ROOT=D:\Projects\user_docs\sandbox
```

## 4. Điều rất quan trọng về `.env`

`backend/src/config/env.ts` dùng hàm `getEnv()` để đọc hầu hết biến môi trường ở chế độ bắt buộc. Điều đó có nghĩa:

- thiếu biến nào là backend không khởi động;
- kể cả bạn chưa dùng Google OAuth hoặc SMTP ngay, vẫn phải có giá trị cho các biến này;
- trong môi trường local có thể dùng placeholder, miễn là hợp lệ ở mức chuỗi.

## 5. Chuẩn bị Prisma

Generate Prisma client:

```bash
npm run prisma:generate
```

Nếu cần migrate thủ công trong backend:

```bash
npm --prefix backend run prisma:migrate
```

## 6. Chạy dự án

### Chạy cả frontend và backend

```bash
npm run dev
```

### Chạy riêng backend

```bash
npm run dev:backend
```

### Chạy riêng frontend

```bash
npm run dev:frontend
```

## 7. Seed dữ liệu

Backend script `dev` sẽ chạy:

```bash
npm run seed
```

trước khi mở `tsx watch`.

Seed hiện thêm:

- provider `gemini`
- danh sách model Gemini
- 3 agent mẫu

Seed không tạo user mẫu.

## 8. Đường dẫn và lưu trữ tài liệu

`D:\Projects\user_docs` nên là thư mục gốc chung, nhưng phải tách thành hai vùng:

- `store`: tài liệu thật của người dùng
- `sandbox`: workspace tạm cho broker

`USER_DOCS_ROOT` là vùng storage thật của file người dùng.

Cấu trúc lưu trữ:

```text
D:\Projects\user_docs\
├── store\
│   └── <userId>\
│       ├── <uploaded-file>
│       └── <sessionId>\
│           └── <uploaded-file>
└── sandbox\
    └── jobs\
        └── <jobId>\
            ├── manifest.json
            ├── attachments-context.txt
            └── input\
```

Nguyên tắc bắt buộc:

- broker không làm việc trực tiếp trong `store`
- broker chỉ làm việc trong `sandbox`
- không cấu hình `USER_DOCS_ROOT` và `SANDBOX_ROOT` trỏ chồng lên nhau

Nếu các thư mục này không tồn tại, backend hoặc broker sẽ tự tạo thư mục con cần thiết khi chạy.

## 9. Cấu hình CLI

### Ví dụ command template

```env
GEMINI_CLI_COMMAND=gemini chat --model={model}
OPENCODE_CLI_COMMAND=opencode chat --mode=assistant --stdin --model={model}
```

Placeholder hợp lệ:

- `{model}`
- `{{model}}`
- `$MODEL`

Nếu command template đã có model placeholder, backend sẽ thay giá trị model khi gửi chat.

## 10. Kiểm tra nhanh sau khi khởi động

### Backend

Mở:

```text
http://localhost:8080
```

Nếu thành công sẽ thấy:

```text
Pro Chatbot API is running...
```

### Frontend

Mở:

```text
http://localhost:5173
```

Frontend sẽ điều hướng tới màn login.

## 11. Các lỗi thường gặp

### Backend không khởi động

Nguyên nhân thường gặp:

- thiếu biến môi trường bắt buộc;
- `JWT_SECRET` chưa khai báo;
- `USER_DOCS_ROOT` không có quyền ghi;
- `SANDBOX_ROOT` không có quyền ghi;
- Prisma client chưa generate.

### Đăng nhập Google lỗi

Kiểm tra:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- cấu hình redirect URI phía Google Console

### Quên mật khẩu không gửi email

Kiểm tra:

- SMTP host/port/user/pass
- app password nếu dùng Gmail
- `SMTP_FROM`

### Chat gửi đi nhưng không có phản hồi AI

Kiểm tra:

- CLI có được cài trong PATH không;
- command template có đúng không;
- model truyền vào có hợp lệ không;
- timeout `CLI_TIMEOUT_MS`;
- shell runtime trên Windows có gọi được `powershell.exe` không.

## 12. Khuyến nghị vận hành

- Tách `USER_DOCS_ROOT` và `SANDBOX_ROOT` ra ngoài thư mục source code.
- Dùng layout `D:\Projects\user_docs\store` và `D:\Projects\user_docs\sandbox` thay vì cho broker làm việc trực tiếp trên thư mục tài liệu thật.
- Không lưu secret trực tiếp trong frontend.
- Dùng giá trị `JWT_SECRET` mạnh ở môi trường thật.
- Thêm backup định kỳ cho SQLite và thư mục tài liệu nếu dùng dữ liệu thật.
