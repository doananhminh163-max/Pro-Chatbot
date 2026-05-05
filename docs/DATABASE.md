# Thiết kế cơ sở dữ liệu

Tài liệu này mô tả schema hiện tại trong `backend/prisma/schema.prisma`. Hệ thống dùng SQLite và Prisma ORM. Các model được tối ưu cho một ứng dụng chat nội bộ chạy cục bộ, nên dữ liệu nhấn mạnh vào session, tài liệu và cấu hình AI hơn là các báo cáo phân tích phức tạp.

## 1. Công nghệ và nguyên tắc

- Database engine: SQLite
- ORM: Prisma
- Định danh chính: UUID string
- Timestamp: đã có cho các model hội thoại/memory (`ChatSession`, `Message`, `MemoryEntry`)
- File binary: không lưu trong database, chỉ lưu metadata và `filePath`

## 2. Enum

### `Role`

- `CLIENT`
- `ADMIN`

### `SenderType`

- `USER`
- `AI`
- `SYSTEM`

### `MemoryScope`

- `GLOBAL`
- `SESSION`

Ghi chú: runtime hiện tại chỉ dùng `GLOBAL`; `SESSION` còn tồn tại trong schema vì lý do tương thích dữ liệu cũ.

### `MemoryKind`

- `PROFILE`
- `PREFERENCE`
- `TASK`
- `DOMAIN`
- `FACT`

## 3. Mô tả từng model

### 3.1 `User`

Lưu thông tin tài khoản và cấu hình cá nhân hóa AI.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK, UUID |
| `username` | `String?` | unique, có thể null |
| `email` | `String` | unique |
| `passwordHash` | `String` | mật khẩu đã băm |
| `fullName` | `String?` | tên hiển thị |
| `avatar` | `String?` | hiện lưu dưới dạng chuỗi, frontend có thể gửi base64 |
| `phone` | `String?` | số điện thoại |
| `resetPasswordToken` | `String?` | token reset đã hash |
| `resetPasswordExpiresAt` | `DateTime?` | thời điểm hết hạn |
| `role` | `Role` | mặc định `CLIENT` |
| `aiTone` | `String?` | mặc định `professional` |
| `aiLanguage` | `String?` | mặc định `Vietnamese` |
| `aiResponseLength` | `String?` | mặc định `balanced` |
| `customInstructions` | `String?` | chỉ dẫn cố định cho AI |

Quan hệ:

- `documents`: 1 user có nhiều document
- `sessions`: 1 user có nhiều session
- `memories`: 1 user có nhiều memory entry

### 3.2 `Document`

Lưu metadata của file người dùng.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK, UUID |
| `userId` | `String` | FK tới `User` |
| `sessionId` | `String?` | FK tới `ChatSession`, nullable |
| `messageId` | `String?` | FK tới `Message`, nullable |
| `fileName` | `String` | tên file vật lý trên đĩa |
| `originalName` | `String` | tên file gốc khi upload |
| `filePath` | `String` | đường dẫn tuyệt đối/logic tới file |
| `mimeType` | `String` | kiểu MIME |
| `size` | `Int` | kích thước bytes |
| `extractedText` | `String?` | Markdown extract đã parse/OCR từ file, dùng để tạo artifact gửi vào sandbox |

Quan hệ:

- thuộc về đúng 1 `User`
- có thể thuộc 1 `ChatSession`
- có thể gắn với 1 `Message`

### 3.3 `ChatSession`

Đại diện cho một cuộc hội thoại độc lập.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK, UUID |
| `userId` | `String` | chủ sở hữu session |
| `agentId` | `String?` | agent được chọn cho session |
| `title` | `String` | tiêu đề session |
| `summary` | `String?` | trường legacy, hiện không còn được runtime chat cập nhật |
| `activeTask` | `String?` | trường legacy, hiện không còn được runtime chat cập nhật |
| `memoryUpdatedAt` | `DateTime?` | lần cập nhật memory gần nhất |
| `createdAt` | `DateTime` | thời điểm tạo |
| `updatedAt` | `DateTime` | thời điểm cập nhật cuối |

Quan hệ:

- thuộc về 1 `User`
- có thể tham chiếu 1 `Agent`
- có nhiều `Message`
- có nhiều `Document`
- có thể còn tham chiếu `MemoryEntry` scope `SESSION` từ dữ liệu cũ, nhưng runtime hiện tại không còn sử dụng

### 3.4 `Message`

Đại diện cho từng lượt trao đổi trong session.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK, UUID |
| `sessionId` | `String` | FK tới `ChatSession` |
| `sender` | `SenderType` | USER / AI / SYSTEM |
| `content` | `String` | nội dung message |
| `createdAt` | `DateTime` | thời điểm tạo |

Quan hệ:

- thuộc 1 `ChatSession`
- có thể gắn nhiều `Document`

### 3.5 `MemoryEntry`

Lưu ngữ cảnh memory phục vụ prompt. Runtime hiện tại chỉ nạp `GLOBAL` memory cho prompt; `SESSION` được giữ lại trong schema để tương thích ngược.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK, UUID |
| `userId` | `String` | FK tới `User` |
| `sessionId` | `String?` | FK tới `ChatSession`, chủ yếu phục vụ dữ liệu legacy scope `SESSION` |
| `scope` | `MemoryScope` | hiện runtime dùng `GLOBAL`; `SESSION` là legacy |
| `kind` | `MemoryKind` | loại memory (`FACT`, `TASK`, ...) |
| `title` | `String` | tiêu đề memory (dùng để upsert) |
| `content` | `String` | nội dung memory |
| `importance` | `Int` | độ ưu tiên 1-100, mặc định 50 |
| `createdAt` | `DateTime` | thời điểm tạo |
| `updatedAt` | `DateTime` | thời điểm cập nhật |
| `lastUsedAt` | `DateTime` | lần được dùng gần nhất trong prompt |

Quan hệ:

- thuộc 1 `User`
- có thể thuộc 1 `ChatSession` với dữ liệu legacy theo phiên

Index quan trọng:

- `@@index([userId, scope, lastUsedAt])`
- `@@index([sessionId, scope, lastUsedAt])`

### 3.6 `Provider`

Đại diện cho một nhà cung cấp AI.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK |
| `name` | `String` | unique |
| `config` | `String?` | JSON string cấu hình nếu cần |

Quan hệ:

- 1 provider có nhiều `Model`

### 3.7 `Model`

Đại diện cho model cụ thể thuộc một provider.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK |
| `providerId` | `String` | FK tới `Provider` |
| `name` | `String` | tên model |

### 3.8 `Agent`

Đại diện cho một persona hoặc profile xử lý mà người dùng chọn trong màn chat.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK |
| `name` | `String` | unique |
| `description` | `String?` | mô tả ngắn |
| `systemPrompt` | `String?` | chỗ cho prompt hệ thống riêng, hiện chưa dùng trong `chat.service.ts` |

Quan hệ:

- có nhiều `ChatSession`

## 4. Quan hệ dữ liệu chính

```text
User
 ├── ChatSession
 │    ├── Message
 │    │    └── Document
 │    ├── MemoryEntry (SESSION)
 │    └── Document
 ├── MemoryEntry (GLOBAL)
 └── Document

Provider
 └── Model

Agent
 └── ChatSession
```

## 5. Hành vi `onDelete`

- Xóa `User` sẽ cascade xuống `Document` và `ChatSession`.
- Xóa `ChatSession` sẽ cascade xuống `Message` và `MemoryEntry` của session.
- Xóa `User` cũng cascade xuống `MemoryEntry`.
- `Document.sessionId` dùng `onDelete: SetNull`.
- `Document.messageId` dùng `onDelete: SetNull`.
- `ChatSession.agentId` dùng `onDelete: SetNull`.

Điều này phù hợp với mục tiêu: session có thể bị xóa mà không làm hỏng integrity của document metadata trong một số trường hợp trung gian.

## 6. Những điểm đáng chú ý trong thiết kế hiện tại

### Timestamp trong schema hiện tại

Các thực thể chat/memory đã có timestamp để theo dõi vòng đời dữ liệu:

- `ChatSession`: `createdAt`, `updatedAt`, `memoryUpdatedAt`
- `Message`: `createdAt`
- `MemoryEntry`: `createdAt`, `updatedAt`, `lastUsedAt`

Các model khác (ví dụ `User`, `Document`) hiện chưa có đầy đủ cặp `createdAt/updatedAt`.

### `Document.extractedText`

Trường này hiện được populate ngay lúc upload. Backend parse/OCR file và lưu Markdown extract vào đây để bước sandbox chỉ cần ghi lại các file `.md` tương ứng trước khi gọi CLI.

### `Agent.systemPrompt` chưa được nối vào prompt thật

Trong `chat.service.ts`, prompt hiện được dựng từ `agent` name + personalization + history. `systemPrompt` trong database chưa được đưa vào.

### Dữ liệu admin mới là hạ tầng chờ sẵn

Schema hiện giữ `Provider`, `Model`, `Agent` làm metadata cấu hình tối thiểu. Frontend admin vẫn là mock UI, chưa có API CRUD tương ứng.

Skill và MCP không còn nằm trong schema Prisma. Chúng được quản lý ngoài project ở `C:\Users\Admin\.agents`.

## 7. Dữ liệu seed mặc định

Script seed hiện tạo:

- 1 provider: `gemini`
- nhiều model Gemini
- 3 agent mẫu

Không seed:

- user/admin mặc định
