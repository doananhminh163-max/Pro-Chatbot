# Sandbox Broker Spec

## 1. Mục tiêu

Tách quá trình thực thi AI CLI ra khỏi backend chính để giảm rủi ro chatbot đọc mã nguồn, `.env`, cơ sở dữ liệu hoặc filesystem nội bộ ngoài phạm vi attachment được cấp phép.

Mô hình triển khai mục tiêu trên Windows:

- `report_backend_svc`: chạy API backend chính
- `report_bot_svc`: chạy sandbox broker
- backend chỉ chuẩn bị job workspace và gọi broker nội bộ
- broker chỉ được thấy `SANDBOX_ROOT\jobs\<jobId>`
- `SANDBOX_ROOT` phải là cây thư mục tách biệt với vùng lưu trữ thật `USER_DOCS_ROOT`

## 2. Ranh giới tin cậy

### Backend chính

Được phép:

- đọc repo
- đọc `.env`
- đọc/ghi SQLite
- đọc/ghi `USER_DOCS_ROOT`
- xác thực người dùng
- chuẩn bị attachment sandbox

Không được:

- spawn CLI AI trực tiếp

### Sandbox broker

Được phép:

- nhận request nội bộ từ backend
- chạy CLI AI trong sandbox job directory
- đọc manifest và attachment copy nằm trong sandbox root

Không được:

- đọc `D:\Projects\report_analizing`
- đọc `USER_DOCS_ROOT`
- đọc `.env` của backend production
- dùng `powershell.exe`, `cmd.exe`, `bash.exe`

## 3. Kiến trúc runtime

```text
Browser
  |
  v
Main Backend
  |
  |  POST /internal/jobs/execute (loopback + token)
  v
Sandbox Broker
  |
  v
Gemini / OpenCode CLI
```

## 4. Cấu trúc thư mục storage và sandbox

Layout khuyến nghị:

```text
D:\Projects\user_docs\
├── store\
│   └── <userId>\
│       ├── <global-files>
│       └── <sessionId>\
│           └── <user-files>
└── sandbox\
    └── jobs\
        └── <jobId>\
```

Trong đó:

- `USER_DOCS_ROOT=D:\Projects\user_docs\store`
- `SANDBOX_ROOT=D:\Projects\user_docs\sandbox`

Broker không được làm việc trực tiếp trong cây `store`.

### Cấu trúc job sandbox

```text
SANDBOX_ROOT/
└── jobs/
    └── <jobId>/
        ├── manifest.json
        ├── attachments-context.txt
        └── input/
            ├── 01-report.pdf
            └── 02-notes.docx
```

## 5. Luồng xử lý

1. Backend nhận message chat.
2. Backend resolve session và document attachment.
3. Backend di chuyển attachment vào session storage chuẩn nếu cần.
4. Backend copy attachment sang sandbox job directory.
5. Backend extract text tốt nhất có thể từ attachment và ghi `attachments-context.txt`.
6. Backend ghi `manifest.json`.
7. Backend gọi broker nội bộ với:
   - `jobId`
   - `provider`
   - `model`
   - `prompt`
8. Broker xác thực token + loopback source.
9. Broker resolve `jobDir` từ `jobId`.
10. Broker spawn CLI trực tiếp với `shell: false`.
11. Broker feed `attachments-context.txt` vào `stdin`.
12. Broker trả `stdout/stderr` đã redact path.
13. Backend lưu AI response vào `Message`.
14. Backend xóa sandbox job sau khi request xong.

## 6. Giao thức broker

### Health

`GET /health`

Mục đích:

- kiểm tra broker sống
- trigger dọn job quá hạn

### Execute

`POST /internal/jobs/execute`

Header bắt buộc:

- `x-sandbox-broker-token`

Body:

```json
{
  "jobId": "uuid",
  "provider": "gemini",
  "model": "gemini-2.5-pro",
  "prompt": "..."
}
```

Response:

```json
{
  "reply": "...",
  "usedProvider": "gemini",
  "fallbackUsed": false
}
```

## 7. Biện pháp hardening bắt buộc

### Process execution

- `shell: false`
- cấm `powershell`, `pwsh`, `cmd`, `bash`, `wscript`, `cscript`
- không ghép shell command string
- chỉ spawn executable trực tiếp

### Network

- broker chỉ bind `127.0.0.1`
- chỉ chấp nhận request loopback
- dùng shared secret `SANDBOX_BROKER_TOKEN`

### Filesystem

- broker chỉ resolve job theo `SANDBOX_ROOT\jobs\<jobId>`
- không nhận path arbitrary từ request
- mọi attachment đều là bản copy vào sandbox
- không cho broker đọc trực tiếp `USER_DOCS_ROOT`
- không dùng chung một cây thư mục cho `USER_DOCS_ROOT` và `SANDBOX_ROOT`

### Output redaction

- redact Windows absolute path khỏi `stdout` và `stderr`
- không trả path repo hoặc path user_docs về frontend

### TTL cleanup

- broker/backend định kỳ xóa `jobs` quá hạn theo `SANDBOX_JOB_TTL_MS`

## 8. Triển khai Windows production

### Account

- backend chạy dưới `report_backend_svc`
- broker chạy dưới `report_bot_svc`

### ACL

- `report_bot_svc` không có quyền đọc repo
- `report_bot_svc` không có quyền đọc `USER_DOCS_ROOT`
- `report_bot_svc` có quyền modify `SANDBOX_ROOT`
- `report_backend_svc` có quyền trên cả `USER_DOCS_ROOT` và `SANDBOX_ROOT`

### AppLocker hoặc WDAC

Khuyến nghị rule cho `report_bot_svc`:

- allow broker executable
- allow Gemini/OpenCode executable
- deny `powershell.exe`
- deny `cmd.exe`
- deny `bash.exe`

## 9. Các biến môi trường mới

- `SANDBOX_BROKER_URL`
- `SANDBOX_BROKER_HOST`
- `SANDBOX_BROKER_PORT`
- `SANDBOX_BROKER_TOKEN`
- `SANDBOX_BROKER_REQUEST_TIMEOUT_MS`
- `SANDBOX_ROOT`
- `SANDBOX_JOB_TTL_MS`

## 10. Trạng thái implementation hiện tại

Implementation trong repo này cung cấp:

- sandbox broker chạy độc lập
- backend client gọi broker nội bộ
- sandbox job workspace
- attachment context extraction
- direct spawn không dùng PowerShell
- cleanup job và redact path

Những thứ vẫn là phần triển khai hạ tầng ngoài repo:

- tạo Windows service thật
- tạo local service account thật
- cấu hình ACL
- AppLocker/WDAC rules
