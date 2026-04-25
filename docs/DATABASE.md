# Thiết kế cơ sở dữ liệu

Tài liệu này mô tả schema hiện tại trong `backend/prisma/schema.prisma`. Hệ thống dùng SQLite và Prisma ORM. Các model được tối ưu cho một ứng dụng chat nội bộ chạy cục bộ, nên dữ liệu nhấn mạnh vào session, tài liệu và cấu hình AI hơn là các báo cáo phân tích phức tạp.

## 1. Công nghệ và nguyên tắc

- Database engine: SQLite
- ORM: Prisma
- Định danh chính: UUID string
- Timestamp: hiện chưa có `createdAt` / `updatedAt`
- File binary: không lưu trong database, chỉ lưu metadata và `filePath`

## 2. Enum

### `Role`

- `CLIENT`
- `ADMIN`

### `SenderType`

- `USER`
- `AI`
- `SYSTEM`

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
| `extractedText` | `String?` | chỗ dành cho text parse/OCR, hiện chưa populate |

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

Quan hệ:

- thuộc về 1 `User`
- có thể tham chiếu 1 `Agent`
- có nhiều `Message`
- có nhiều `Document`

### 3.4 `Message`

Đại diện cho từng lượt trao đổi trong session.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK, UUID |
| `sessionId` | `String` | FK tới `ChatSession` |
| `sender` | `SenderType` | USER / AI / SYSTEM |
| `content` | `String` | nội dung message |

Quan hệ:

- thuộc 1 `ChatSession`
- có thể gắn nhiều `Document`

### 3.5 `Provider`

Đại diện cho một nhà cung cấp AI.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK |
| `name` | `String` | unique |
| `config` | `String?` | JSON string cấu hình nếu cần |

Quan hệ:

- 1 provider có nhiều `Model`

### 3.6 `Model`

Đại diện cho model cụ thể thuộc một provider.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK |
| `providerId` | `String` | FK tới `Provider` |
| `name` | `String` | tên model |

### 3.7 `Agent`

Đại diện cho một persona hoặc profile xử lý mà người dùng chọn trong màn chat.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK |
| `name` | `String` | unique |
| `description` | `String?` | mô tả ngắn |
| `systemPrompt` | `String?` | chỗ cho prompt hệ thống riêng, hiện chưa dùng trong `chat.service.ts` |

Quan hệ:

- có nhiều `ChatSession`
- nhiều-nhiều với `Skill`
- nhiều-nhiều với `MCP`

### 3.8 `Skill`

Metadata cho capability có thể gắn với agent.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK |
| `name` | `String` | unique |
| `description` | `String?` | mô tả |
| `command` | `String?` | lệnh CLI nếu cần |

### 3.9 `MCP`

Metadata cho Model Context Protocol hoặc connector tương đương.

| Trường | Kiểu | Ghi chú |
| :--- | :--- | :--- |
| `id` | `String` | PK |
| `name` | `String` | unique |
| `description` | `String?` | mô tả |
| `config` | `String?` | JSON config |

### 3.10 Bảng trung gian

#### `AgentSkill`

- khóa chính tổng hợp: `agentId`, `skillId`
- biểu diễn quan hệ nhiều-nhiều giữa Agent và Skill

#### `AgentMCP`

- khóa chính tổng hợp: `agentId`, `mcpId`
- biểu diễn quan hệ nhiều-nhiều giữa Agent và MCP

## 4. Quan hệ dữ liệu chính

```text
User
 ├── ChatSession
 │    ├── Message
 │    │    └── Document
 │    └── Document
 └── Document

Provider
 └── Model

Agent
 ├── ChatSession
 ├── AgentSkill -> Skill
 └── AgentMCP   -> MCP
```

## 5. Hành vi `onDelete`

- Xóa `User` sẽ cascade xuống `Document` và `ChatSession`.
- Xóa `ChatSession` sẽ cascade xuống `Message`.
- `Document.sessionId` dùng `onDelete: SetNull`.
- `Document.messageId` dùng `onDelete: SetNull`.
- `ChatSession.agentId` dùng `onDelete: SetNull`.

Điều này phù hợp với mục tiêu: session có thể bị xóa mà không làm hỏng integrity của document metadata trong một số trường hợp trung gian.

## 6. Những điểm đáng chú ý trong thiết kế hiện tại

### Không có timestamp

Schema hiện không lưu thời gian tạo/cập nhật cho user, document, session, message. Điều này làm đơn giản hệ thống nhưng hạn chế:

- sắp xếp lịch sử theo thời gian;
- audit;
- truy vết upload gần nhất;
- thống kê usage chính xác.

### `Document.extractedText` chưa dùng

Trường này cho thấy ý định có pipeline parse/OCR, nhưng hiện upload chỉ lưu file và metadata. Chưa có service nào ghi dữ liệu vào trường này.

### `Agent.systemPrompt` chưa được nối vào prompt thật

Trong `chat.service.ts`, prompt hiện được dựng từ `agent` name + personalization + history. `systemPrompt` trong database chưa được đưa vào.

### Dữ liệu admin mới là hạ tầng chờ sẵn

Schema đã có `Provider`, `Model`, `Agent`, `Skill`, `MCP`, bảng nối. Tuy nhiên frontend admin hiện vẫn là mock UI, chưa có API CRUD tương ứng.

## 7. Dữ liệu seed mặc định

Script seed hiện tạo:

- 1 provider: `gemini`
- nhiều model Gemini
- 3 agent mẫu

Không seed:

- user/admin mặc định
- skill
- mcp
- mapping `AgentSkill`
- mapping `AgentMCP`
