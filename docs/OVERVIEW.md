# OVERVIEW.md

# Tổng quan dự án Website Chatbot

## Mục lục

- [1. Giới thiệu](#1-giới-thiệu)
- [2. Bối cảnh kỹ thuật](#2-bối-cảnh-kỹ-thuật)
- [3. Mục tiêu](#3-mục-tiêu)
  - [3.1. Mục tiêu chính](#31-mục-tiêu-chính)
  - [3.2. Mục tiêu cụ thể](#32-mục-tiêu-cụ-thể)
- [4. Đối tượng người dùng](#4-đối-tượng-người-dùng)
  - [4.1. Người dùng chính](#41-người-dùng-chính)
  - [4.2. Nhu cầu người dùng](#42-nhu-cầu-người-dùng)
- [5. Phạm vi dự án](#5-phạm-vi-dự-án)
- [5.1. In scope](#51-in-scope)
  - [5.1.1. Website chatbot điều phối OpenCode](#511-website-chatbot-điều-phối-opencode)
  - [5.1.2. Quản lý kết nối OpenCode server](#512-quản-lý-kết-nối-opencode-server)
  - [5.1.3. Quản lý project/workspace](#513-quản-lý-projectworkspace)
  - [5.1.4. Quản lý file cấu hình OpenCode](#514-quản-lý-file-cấu-hình-opencode)
  - [5.1.5. Quản lý model và provider](#515-quản-lý-model-và-provider)
  - [5.1.6. Quản lý agent](#516-quản-lý-agent)
  - [5.1.7. Quản lý tool và permission](#517-quản-lý-tool-và-permission)
  - [5.1.8. Quản lý skill và Skill Marketplace](#518-quản-lý-skill-và-skill-marketplace)
  - [5.1.9. Quản lý MCP server](#519-quản-lý-mcp-server)
  - [5.1.10. Quản lý command](#5110-quản-lý-command)
  - [5.1.11. Quản lý TUI config](#5111-quản-lý-tui-config)
  - [5.1.12. Quản lý formatter, LSP, watcher và snapshot](#5112-quản-lý-formatter-lsp-watcher-và-snapshot)
  - [5.1.13. Quản lý session và message](#5113-quản-lý-session-và-message)
  - [5.1.14. Import, export, backup và rollback](#5114-import-export-backup-và-rollback)
  - [5.1.15. Kiểm tra, cảnh báo và gợi ý cấu hình](#5115-kiểm-tra-cảnh-báo-và-gợi-ý-cấu-hình)
  - [5.1.16. Tài liệu hướng dẫn trong app](#5116-tài-liệu-hướng-dẫn-trong-app)
- [5.2. Out of scope](#52-out-of-scope)
- [6. Yêu cầu chức năng](#6-yêu-cầu-chức-năng)
- [6.1. Nhóm Authentication & Connection](#61-nhóm-authentication-connection)
  - [FR-01: Kết nối đến OpenCode server](#fr-01-kết-nối-đến-opencode-server)
  - [FR-02: Hỗ trợ xác thực server](#fr-02-hỗ-trợ-xác-thực-server)
  - [FR-03: Kiểm tra trạng thái server](#fr-03-kiểm-tra-trạng-thái-server)
- [6.2. Nhóm Project & Config Management](#62-nhóm-project-config-management)
  - [FR-04: Đọc cấu hình project](#fr-04-đọc-cấu-hình-project)
  - [FR-05: Phân tách config global/project/runtime](#fr-05-phân-tách-config-globalprojectruntime)
  - [FR-06: Chỉnh sửa config bằng form](#fr-06-chỉnh-sửa-config-bằng-form)
  - [FR-07: Sinh JSON/JSONC hợp lệ](#fr-07-sinh-jsonjsonc-hợp-lệ)
  - [FR-08: Validate cấu hình trước khi lưu](#fr-08-validate-cấu-hình-trước-khi-lưu)
  - [FR-09: Preview diff trước khi apply](#fr-09-preview-diff-trước-khi-apply)
  - [FR-10: Backup và rollback config](#fr-10-backup-và-rollback-config)
- [6.3. Nhóm Chatbot Automation](#63-nhóm-chatbot-automation)
  - [FR-11: Nhận yêu cầu bằng ngôn ngữ tự nhiên](#fr-11-nhận-yêu-cầu-bằng-ngôn-ngữ-tự-nhiên)
  - [FR-12: Chuyển yêu cầu thành hành động cấu hình](#fr-12-chuyển-yêu-cầu-thành-hành-động-cấu-hình)
  - [FR-13: Hỏi lại khi thiếu thông tin quan trọng](#fr-13-hỏi-lại-khi-thiếu-thông-tin-quan-trọng)
  - [FR-14: Giải thích tác động cấu hình](#fr-14-giải-thích-tác-động-cấu-hình)
  - [FR-15: Không tự apply thay đổi nguy hiểm](#fr-15-không-tự-apply-thay-đổi-nguy-hiểm)
- [6.4. Nhóm Model & Provider](#64-nhóm-model-provider)
  - [FR-16: Quản lý model mặc định](#fr-16-quản-lý-model-mặc-định)
  - [FR-17: Quản lý small model](#fr-17-quản-lý-small-model)
  - [FR-18: Quản lý provider options](#fr-18-quản-lý-provider-options)
  - [FR-19: Quản lý provider allowlist/blocklist](#fr-19-quản-lý-provider-allowlistblocklist)
- [6.5. Nhóm Agent](#65-nhóm-agent)
  - [FR-20: Danh sách agent](#fr-20-danh-sách-agent)
  - [FR-21: Tạo agent mới](#fr-21-tạo-agent-mới)
  - [FR-22: Chỉnh sửa agent](#fr-22-chỉnh-sửa-agent)
  - [FR-23: Đặt default agent](#fr-23-đặt-default-agent)
- [6.6. Nhóm Tool & Permission](#66-nhóm-tool-permission)
  - [FR-24: Hiển thị tool khả dụng](#fr-24-hiển-thị-tool-khả-dụng)
  - [FR-25: Cấu hình bật/tắt tool](#fr-25-cấu-hình-bậttắt-tool)
  - [FR-26: Cấu hình permission](#fr-26-cấu-hình-permission)
  - [FR-27: Cảnh báo permission nguy hiểm](#fr-27-cảnh-báo-permission-nguy-hiểm)
- [6.7. Nhóm Skill Management & Marketplace](#67-nhóm-skill-management-marketplace)
  - [FR-28: Danh sách skill hiện có](#fr-28-danh-sách-skill-hiện-có)
  - [FR-29: Phân loại nguồn và scope của skill](#fr-29-phân-loại-nguồn-và-scope-của-skill)
  - [FR-30: Tìm kiếm và lọc skill local](#fr-30-tìm-kiếm-và-lọc-skill-local)
  - [FR-31: Xem chi tiết và preview skill](#fr-31-xem-chi-tiết-và-preview-skill)
  - [FR-32: Validate skill](#fr-32-validate-skill)
  - [FR-33: Tạo, chỉnh sửa, xoá, import và export skill](#fr-33-tạo-chỉnh-sửa-xoá-import-và-export-skill)
  - [FR-34: Skill Marketplace tìm kiếm online](#fr-34-skill-marketplace-tìm-kiếm-online)
  - [FR-35: Cài đặt hoặc cập nhật skill từ marketplace](#fr-35-cài-đặt-hoặc-cập-nhật-skill-từ-marketplace)
  - [FR-36: Quản lý permission của skill tool](#fr-36-quản-lý-permission-của-skill-tool)
- [6.8. Nhóm MCP](#68-nhóm-mcp)
  - [FR-37: Danh sách MCP server](#fr-37-danh-sách-mcp-server)
  - [FR-38: Thêm MCP server](#fr-38-thêm-mcp-server)
  - [FR-39: Cấu hình OAuth/header/env cho MCP](#fr-39-cấu-hình-oauthheaderenv-cho-mcp)
  - [FR-40: Quản lý MCP theo agent](#fr-40-quản-lý-mcp-theo-agent)
- [6.9. Nhóm Command](#69-nhóm-command)
  - [FR-41: Tạo command](#fr-41-tạo-command)
  - [FR-42: Chỉnh sửa command](#fr-42-chỉnh-sửa-command)
  - [FR-43: Preview command](#fr-43-preview-command)
- [6.10. Nhóm Session & Chat Runtime](#610-nhóm-session-chat-runtime)
  - [FR-44: Quản lý session](#fr-44-quản-lý-session)
  - [FR-45: Gửi prompt đến OpenCode](#fr-45-gửi-prompt-đến-opencode)
  - [FR-46: Export session](#fr-46-export-session)
- [6.11. Nhóm Observability & Logs](#611-nhóm-observability-logs)
  - [FR-47: Hiển thị log thao tác](#fr-47-hiển-thị-log-thao-tác)
  - [FR-48: Hiển thị lỗi dễ hiểu](#fr-48-hiển-thị-lỗi-dễ-hiểu)
  - [FR-49: Kiểm tra cấu hình sau khi apply](#fr-49-kiểm-tra-cấu-hình-sau-khi-apply)
- [7. Yêu cầu phi chức năng](#7-yêu-cầu-phi-chức-năng)
- [7.1. Bảo mật](#71-bảo-mật)
  - [NFR-01: Không lưu secret thô nếu chưa được mã hoá](#nfr-01-không-lưu-secret-thô-nếu-chưa-được-mã-hoá)
  - [NFR-02: Ưu tiên dùng biến môi trường hoặc file secret](#nfr-02-ưu-tiên-dùng-biến-môi-trường-hoặc-file-secret)
  - [NFR-03: Xác nhận trước hành động rủi ro cao](#nfr-03-xác-nhận-trước-hành-động-rủi-ro-cao)
  - [NFR-04: Phân quyền tối thiểu](#nfr-04-phân-quyền-tối-thiểu)
  - [NFR-05: Kiểm soát nguồn skill online](#nfr-05-kiểm-soát-nguồn-skill-online)
  - [NFR-06: Không tự động tin cậy nội dung skill marketplace](#nfr-06-không-tự-động-tin-cậy-nội-dung-skill-marketplace)
- [7.2. Tính đúng đắn](#72-tính-đúng-đắn)
  - [NFR-07: Config sinh ra phải hợp lệ](#nfr-07-config-sinh-ra-phải-hợp-lệ)
  - [NFR-08: Không làm mất cấu hình không liên quan](#nfr-08-không-làm-mất-cấu-hình-không-liên-quan)
  - [NFR-09: Có diff và backup](#nfr-09-có-diff-và-backup)
- [7.3. Khả dụng và dễ dùng](#73-khả-dụng-và-dễ-dùng)
  - [NFR-10: Giao diện dễ hiểu với người mới](#nfr-10-giao-diện-dễ-hiểu-với-người-mới)
  - [NFR-11: Hỗ trợ cả chatbot và form](#nfr-11-hỗ-trợ-cả-chatbot-và-form)
  - [NFR-12: Không yêu cầu người dùng nhớ lệnh CLI](#nfr-12-không-yêu-cầu-người-dùng-nhớ-lệnh-cli)
- [7.4. Hiệu năng](#74-hiệu-năng)
  - [NFR-13: Phản hồi giao diện nhanh](#nfr-13-phản-hồi-giao-diện-nhanh)
  - [NFR-14: Không block UI khi gọi OpenCode](#nfr-14-không-block-ui-khi-gọi-opencode)
- [7.5. Độ tin cậy](#75-độ-tin-cậy)
  - [NFR-15: Không ghi file khi validate thất bại](#nfr-15-không-ghi-file-khi-validate-thất-bại)
  - [NFR-16: Có cơ chế khôi phục](#nfr-16-có-cơ-chế-khôi-phục)
- [7.6. Khả năng mở rộng](#76-khả-năng-mở-rộng)
  - [NFR-17: Thiết kế module theo nhóm cấu hình](#nfr-17-thiết-kế-module-theo-nhóm-cấu-hình)
  - [NFR-18: Dễ bổ sung field mới](#nfr-18-dễ-bổ-sung-field-mới)
- [7.7. Khả năng bảo trì](#77-khả-năng-bảo-trì)
  - [NFR-19: Có test cho parser và config writer](#nfr-19-có-test-cho-parser-và-config-writer)
  - [NFR-20: Có log nội bộ](#nfr-20-có-log-nội-bộ)
- [7.8. Tính tương thích](#78-tính-tương-thích)
  - [NFR-21: Hỗ trợ Windows, macOS, Linux ở mức thiết kế](#nfr-21-hỗ-trợ-windows-macos-linux-ở-mức-thiết-kế)
  - [NFR-22: Tôn trọng cấu hình hiện có của OpenCode](#nfr-22-tôn-trọng-cấu-hình-hiện-có-của-opencode)
- [8. Ràng buộc và giả định](#8-ràng-buộc-và-giả-định)
  - [8.1. Ràng buộc](#81-ràng-buộc)
  - [8.2. Giả định](#82-giả-định)
- [9. Đề xuất phạm vi MVP](#9-đề-xuất-phạm-vi-mvp)
- [10. Tiêu chí thành công](#10-tiêu-chí-thành-công)
- [11. Ghi chú thiết kế ban đầu](#11-ghi-chú-thiết-kế-ban-đầu)

---

## 1. Giới thiệu

Dự án này xây dựng một website chatbot đóng vai trò là lớp giao diện trực quan bọc ngoài OpenCode. Thay vì người dùng phải tự đọc tài liệu, tự sửa nhiều file cấu hình hoặc ghi nhớ các lệnh CLI, hệ thống sẽ cung cấp một giao diện web đơn giản để trò chuyện, cấu hình, kiểm tra và quản lý các chức năng của OpenCode.

Website không thay thế OpenCode. Nó hoạt động như một lớp điều phối và tự động hoá phía trên OpenCode, giúp người dùng thao tác với các thành phần như cấu hình dự án, model, provider, agent, command, tool, permission, MCP server, skill, Skill Marketplace, session và server/web runtime một cách an toàn hơn, dễ hiểu hơn và ít lỗi hơn.

Tên tạm thời của dự án: **Pro Chatbot**.

### Trạng thái triển khai hiện tại

Tài liệu này mô tả cả tầm nhìn sản phẩm và phạm vi triển khai theo giai đoạn. Khi cần biết hành vi đúng của code hiện tại, ưu tiên đối chiếu với [SPEC.md](./SPEC.md), [API_SPEC.md](./API_SPEC.md) và route/service trong code.

| Nhóm | Trạng thái hiện tại | Ghi chú |
|---|---|---|
| Chatbot/OpenCode runtime | Đã triển khai MVP | Chat dùng OpenCode session, hỗ trợ send/stream, chọn model/agent, slash command, skill hint và file mention. |
| App state/dashboard | Đã triển khai MVP | `GET /api/app-state` tổng hợp runtime data, config health, risk queue, git/audit context. |
| Config preview/apply | Đã triển khai MVP | Metadata preview/apply nằm trong memory; file backup vẫn ghi dưới `.pro-chatbot/backups`. |
| Agent/permission/skill/MCP proposals | Đã triển khai một phần | Nhiều thao tác tạo preview diff trước khi apply; một số thao tác xoá/write trực tiếp có backup/audit. |
| Command management | Đã triển khai một phần | Create/delete command hiện ghi trực tiếp vào `.opencode/commands`, không đi qua preview/apply. |
| Model/provider management | Đã triển khai dạng đọc/chọn | UI dùng danh sách từ OpenCode; chưa có provider CRUD đầy đủ. |
| Project/server connection management | Đã triển khai dạng đọc/test | Project và server connection do OpenCode/`opencode.json` quản lý; UI không tạo/xoá project hoặc connection. |
| TUI, formatter, LSP, watcher, snapshot | Một phần/future | Một số field có thể đi qua settings config form; chưa có module route riêng đầy đủ. |
| Local database, auth, document store | Không thuộc runtime hiện tại | Backend không dùng local database cho OpenCode UI; các mô tả cũ về database/document ingestion cần xem là ngoài phạm vi hiện tại. |

## 2. Bối cảnh kỹ thuật

OpenCode hỗ trợ cấu hình bằng file JSON/JSONC như `opencode.json`, `opencode.jsonc`, `tui.json` và cho phép cấu hình ở nhiều cấp như remote, global, custom path, project, inline config, managed config. Các cấu hình được merge với nhau theo thứ tự ưu tiên, thay vì thay thế hoàn toàn.

OpenCode cũng có khả năng chạy web/server thông qua các lệnh như `opencode web` hoặc `opencode serve`, hỗ trợ cấu hình port, hostname, mDNS, CORS và xác thực bằng biến môi trường như `OPENCODE_SERVER_PASSWORD`.

Về mặt chức năng, OpenCode có nhiều nhóm thành phần có thể được đưa lên giao diện web để quản lý trực quan, bao gồm:

- Config runtime/server.
- TUI config.
- Provider và model.
- Agent.
- Tool và permission.
- Command.
- MCP server.
- Skill Management và Skill Marketplace.
- Formatter, LSP server, watcher, snapshot, autoupdate.
- Session, message, file, project và server status.
- Plugin và custom tool.


Riêng với Agent Skills, hệ thống cần nhận biết skill như một loại tài nguyên cấu hình có cấu trúc file riêng, thường là thư mục chứa `SKILL.md`. Website cần đọc, hiển thị, validate, tìm kiếm, cài đặt và quản lý skill theo từng scope như project, global hoặc các đường dẫn tương thích với hệ sinh thái agent khác.

Vì vậy, dự án này sẽ tập trung vào việc biến các cấu hình và thao tác kỹ thuật đó thành các flow giao diện dễ dùng: form, wizard, chatbot hướng dẫn, kiểm tra cấu hình, preview diff và áp dụng thay đổi có kiểm soát.

## 3. Mục tiêu

### 3.1. Mục tiêu chính

Xây dựng một website chatbot giúp người dùng cấu hình và vận hành OpenCode một cách trực quan, đơn giản, an toàn và có khả năng tự động hoá cao.

### 3.2. Mục tiêu cụ thể

- Giảm việc chỉnh sửa thủ công các file cấu hình OpenCode.
- Cung cấp giao diện chatbot để người dùng mô tả nhu cầu bằng ngôn ngữ tự nhiên.
- Chuyển yêu cầu của người dùng thành cấu hình OpenCode hợp lệ.
- Cho phép quản lý các nhóm cấu hình chính của OpenCode bằng form và wizard.
- Kiểm tra lỗi cấu hình trước khi ghi vào file hoặc áp dụng vào server.
- Hỗ trợ xem trước thay đổi dưới dạng diff.
- Hỗ trợ rollback hoặc khôi phục cấu hình khi thay đổi gây lỗi.
- Tạo nền tảng để mở rộng thành hệ thống quản lý OpenCode cho nhiều project trong tương lai.

## 4. Đối tượng người dùng

### 4.1. Người dùng chính

- Lập trình viên sử dụng OpenCode cho dự án cá nhân.
- Nhóm phát triển muốn chuẩn hoá cấu hình OpenCode theo từng project.
- Người mới dùng OpenCode và chưa quen với cấu trúc config.
- Người quản trị hoặc technical lead muốn kiểm soát provider, model, permission, MCP và agent.

### 4.2. Nhu cầu người dùng

- Muốn bật/tắt tool mà không cần tự sửa JSON.
- Muốn tạo agent mới bằng giao diện đơn giản.
- Muốn cấu hình model/provider mà không nhớ chính xác field.
- Muốn thêm MCP server và kiểm tra trạng thái kết nối.
- Muốn quản lý session và message từ web.
- Muốn xem tất cả skill đang có trong project, global và các nguồn tương thích.
- Muốn tìm kiếm skill từ Skill Marketplace hoặc nguồn online, xem mô tả, license và compatibility trước khi cài.
- Muốn cài đặt, cập nhật, xoá hoặc bật/tắt skill mà không cần tự thao tác với thư mục `skills/`.
- Muốn hệ thống giải thích tác động của từng thay đổi cấu hình.
- Muốn tránh cấu hình sai làm OpenCode không chạy được.

## 5. Phạm vi dự án

Phạm vi bên dưới là scope sản phẩm mục tiêu. Với trạng thái code hiện tại, các hạng mục nên được đọc theo ba mức:

- **Đã triển khai**: có route/service/frontend đang dùng được.
- **Một phần**: có dữ liệu hoặc flow chính, nhưng chưa đủ CRUD/UX như mô tả mục tiêu.
- **Future**: là định hướng thiết kế, chưa nên xem là cam kết hiện có.

## 5.1. In scope

Các phần sau nằm trong phạm vi phát triển của dự án.

### 5.1.1. Website chatbot điều phối OpenCode

- Giao diện chatbot để người dùng nhập yêu cầu bằng ngôn ngữ tự nhiên.
- Chatbot phân tích ý định cấu hình OpenCode.
- Chatbot đề xuất cấu hình phù hợp trước khi áp dụng.
- Chatbot giải thích ý nghĩa, rủi ro và tác động của thay đổi.
- Chatbot có thể chuyển người dùng sang form/wizard tương ứng khi cần nhập dữ liệu có cấu trúc.

### 5.1.2. Quản lý kết nối OpenCode server

- Cấu hình địa chỉ OpenCode server.
- Cấu hình port, hostname, CORS ở mức project hoặc runtime.
- Hỗ trợ kết nối đến OpenCode server đang chạy.
- Hiển thị trạng thái server.
- Hỗ trợ xác thực cơ bản nếu server có bật username/password.

### 5.1.3. Quản lý project/workspace

- Chọn hoặc tạo project root.
- Xem trạng thái project hiện tại.
- Gửi thêm từng file riêng lẻ vào một thư mục bất kì
- Đọc cấu hình OpenCode trong project.
- Phân biệt cấu hình global và cấu hình project.
- Cảnh báo khi thay đổi project config có thể override global config.

### 5.1.4. Quản lý file cấu hình OpenCode

- Đọc và hiển thị `opencode.json`, `opencode.jsonc`, `tui.json`.
- Chỉnh sửa cấu hình bằng form thay vì sửa JSON trực tiếp.
- Hỗ trợ preview JSON/JSONC được sinh ra.
- Validate cấu hình theo schema nếu có thể.
- Hiển thị diff trước khi lưu.
- Sao lưu cấu hình trước khi ghi đè.
- Hỗ trợ export/import cấu hình.

### 5.1.5. Quản lý model và provider

- Hiển thị provider hiện có.
- Cho phép chọn model chính.
- Cho phép chọn small model cho tác vụ nhẹ.
- Hỗ trợ cấu hình provider options như timeout, chunk timeout hoặc các tuỳ chọn provider-specific.
- Cảnh báo khi người dùng nhập API key trực tiếp thay vì dùng biến môi trường hoặc file secret.

### 5.1.6. Quản lý agent

- Danh sách agent hiện có.
- Tạo agent mới bằng wizard.
- Cấu hình agent name, description, prompt, model, mode, temperature, max steps, tool/permission.
- Đặt default agent.
- Bật/tắt agent.
- Phân biệt primary agent và subagent.

### 5.1.7. Quản lý tool và permission

- Hiển thị danh sách built-in tools như bash, edit, write, read, grep, glob, webfetch, websearch, todowrite, skill, lsp.
- Bật/tắt tool theo project hoặc theo agent.
- Cấu hình permission theo các mức allow, ask, deny.
- Hỗ trợ rule dạng wildcard cho tool hoặc MCP tool.
- Cảnh báo các cấu hình rủi ro cao, ví dụ cho phép bash/write/edit không cần hỏi.
- Đề xuất cấu hình an toàn theo từng use case.

### 5.1.8. Quản lý skill và Skill Marketplace

- Hiển thị tất cả skill đang có từ các nguồn OpenCode project/global như `.opencode/skills`, `~/.config/opencode/skills` và `.agents/skills`.
- Hiển thị metadata của skill gồm name, description, license, compatibility, source path, scope, trạng thái hợp lệ và thời điểm cập nhật nếu xác định được.
- Cho phép tìm kiếm, lọc và phân nhóm skill theo tên, mô tả, metadata, scope, trạng thái validation hoặc nguồn cài đặt.
- Cho phép xem nội dung `SKILL.md` ở chế độ preview an toàn trước khi chỉnh sửa hoặc cài đặt.
- Validate cấu trúc skill, bao gồm YAML frontmatter, name, description, compatibility, metadata và sự khớp giữa tên thư mục với trường `name`.
- Hỗ trợ tạo mới, chỉnh sửa, sao chép, xoá, import và export skill bằng giao diện.
- Cung cấp Skill Marketplace để tìm kiếm skill trên mạng hoặc registry được cấu hình.
- Hiển thị kết quả marketplace với thông tin nguồn, tác giả hoặc repository, license, compatibility, mô tả, ngày cập nhật và cảnh báo độ tin cậy nếu có thể xác định.
- Cho phép cài đặt hoặc cập nhật skill từ marketplace sau khi người dùng xem preview nội dung, diff và xác nhận.
- Không tự động cài đặt skill từ nguồn online nếu chưa validate, chưa preview và chưa có xác nhận rõ ràng của người dùng.
- Hỗ trợ bật/tắt quyền sử dụng native `skill` tool ở mức global hoặc theo agent thông qua permission.

### 5.1.9. Quản lý MCP server

- Thêm MCP server local hoặc remote.
- Xem danh sách MCP server đã cấu hình.
- Hiển thị trạng thái kết nối MCP.
- Hỗ trợ cấu hình OAuth nếu MCP server yêu cầu.
- Cho phép bật/tắt MCP server toàn cục hoặc theo agent.
- Hỗ trợ cấu hình header, environment variable hoặc secret reference.

### 5.1.10. Quản lý command

- Tạo custom command bằng giao diện.
- Cấu hình template, description, agent, model, argument.
- Xem trước nội dung command được sinh ra.
- Cho phép lưu command vào cấu hình project hoặc global.
- Hỗ trợ tìm kiếm và chỉnh sửa command hiện có.

### 5.1.11. Quản lý TUI config

- Chỉnh theme.
- Cấu hình keybinds.
- Cấu hình mouse, scroll speed, leader timeout, diff style.
- Phân biệt rõ `tui.json` với `opencode.json`.

### 5.1.12. Quản lý formatter, LSP, watcher và snapshot

- Bật/tắt formatter.
- Cấu hình custom formatter.
- Bật/tắt LSP server.
- Cấu hình watcher ignore patterns.
- Bật/tắt snapshot.
- Cảnh báo khi tắt snapshot vì có thể mất khả năng rollback thay đổi do agent tạo ra.

### 5.1.13. Quản lý session và message

- Xem danh sách session.
- Tạo session mới.
- Mở lại session cũ.
- Xem message trong session.
- Cho phép thay doi Model va Agent theo tung session.
- Cho phép chọn Skills va MCPs theo tung session.
- Gửi prompt đến session nếu OpenCode API/server hỗ trợ.
- Export session nếu cần.

### 5.1.14. Import, export, backup và rollback

- Tạo backup trước khi ghi cấu hình.
- Cho phép khôi phục phiên bản cấu hình trước đó.
- Export cấu hình thành file.
- Import cấu hình từ file.
- Hiển thị lịch sử thay đổi cấu hình.

### 5.1.15. Kiểm tra, cảnh báo và gợi ý cấu hình

- Phát hiện thiếu field bắt buộc.
- Phát hiện sai kiểu dữ liệu.
- Phát hiện cấu hình xung đột.
- Phát hiện cấu hình có rủi ro bảo mật.
- Gợi ý cấu hình phù hợp cho các tình huống phổ biến:
  - Chỉ cho agent đọc code.
  - Cho agent sửa code nhưng cần hỏi trước.
  - Bật MCP server cho một agent cụ thể.
  - Cài đặt skill từ marketplace nhưng yêu cầu preview, diff và xác nhận trước.
  - Dùng model mạnh cho build agent và model nhỏ cho tác vụ phụ.

### 5.1.16. Tài liệu hướng dẫn trong app

- Giải thích ngắn gọn từng field cấu hình.
- Cung cấp ví dụ cấu hình.
- Cung cấp checklist trước khi apply.
- Cung cấp hướng dẫn khắc phục lỗi thường gặp.

## 5.2. Out of scope

Các phần sau không nằm trong phạm vi của phiên bản đầu tiên.

- Tự xây dựng hoặc huấn luyện mô hình AI riêng.
- Thay thế engine xử lý chính của OpenCode.
- Thay thế hoàn toàn TUI/CLI chính thức của OpenCode.
- Xây dựng IDE đầy đủ như VS Code hoặc JetBrains.
- Chỉnh sửa code chuyên sâu trong browser như một code editor hoàn chỉnh.
- Quản lý hạ tầng cloud đa tenant cho nhiều tổ chức.
- Marketplace plugin công khai.
- Hệ thống phân quyền doanh nghiệp phức tạp như RBAC đa cấp, SSO, SCIM.
- Tự động deploy OpenCode lên server production.
- Quản lý thiết bị bằng MDM hoặc managed preferences ở cấp doanh nghiệp.
- Cam kết hỗ trợ mọi provider/model bên ngoài nếu OpenCode chưa hỗ trợ.
- Can thiệp vào các cấu hình do admin quản lý và không cho phép override.
- Lưu trữ API key thô nếu chưa có cơ chế mã hoá và quản lý secret an toàn.

## 6. Yêu cầu chức năng

## 6.1. Nhóm Authentication & Connection

### FR-01: Kết nối đến OpenCode server

Hệ thống phải cho phép người dùng cấu hình endpoint của OpenCode server, bao gồm protocol, host và port.

**Mức ưu tiên:** Must have  
**In scope:** Kết nối đến server local hoặc server trong mạng nội bộ.  
**Out of scope:** Tự động deploy server OpenCode mới lên cloud.

### FR-02: Hỗ trợ xác thực server

Hệ thống phải hỗ trợ nhập username/password hoặc token tương ứng với cơ chế xác thực server hiện có.

**Mức ưu tiên:** Must have  
**In scope:** Basic authentication nếu OpenCode server dùng username/password.  
**Out of scope:** SSO, OAuth doanh nghiệp, quản lý người dùng đa tenant.

### FR-03: Kiểm tra trạng thái server

Hệ thống phải hiển thị server đang online/offline, lỗi kết nối, lỗi xác thực hoặc lỗi CORS nếu có thể xác định.

**Mức ưu tiên:** Must have

## 6.2. Nhóm Project & Config Management

### FR-04: Đọc cấu hình project

Hệ thống phải đọc được cấu hình OpenCode trong project hiện tại, bao gồm `opencode.json`, `opencode.jsonc` và các thư mục `.opencode` nếu có.

**Mức ưu tiên:** Must have

### FR-05: Phân tách config global/project/runtime

Hệ thống phải hiển thị rõ cấu hình đang thuộc cấp nào: global, project, custom path hoặc runtime override.

**Mức ưu tiên:** Should have

### FR-06: Chỉnh sửa config bằng form

Hệ thống phải cung cấp form tương ứng cho từng nhóm cấu hình như server, model, provider, tool, permission, agent, skill, Skill Marketplace, MCP, command, formatter, LSP.

**Mức ưu tiên:** Must have

### FR-07: Sinh JSON/JSONC hợp lệ

Sau khi người dùng chỉnh sửa bằng giao diện, hệ thống phải sinh lại cấu hình đúng cấu trúc JSON/JSONC.

**Mức ưu tiên:** Must have

### FR-08: Validate cấu hình trước khi lưu

Hệ thống phải kiểm tra cấu hình trước khi ghi vào file, bao gồm kiểm tra kiểu dữ liệu, field không hợp lệ, field thiếu và lỗi cú pháp.

**Mức ưu tiên:** Must have

### FR-09: Preview diff trước khi apply

Trước khi ghi thay đổi, hệ thống phải hiển thị sự khác biệt giữa cấu hình hiện tại và cấu hình mới.

**Mức ưu tiên:** Must have

### FR-10: Backup và rollback config

Hệ thống phải tạo backup trước khi ghi đè cấu hình và cho phép khôi phục phiên bản trước.

**Mức ưu tiên:** Should have

## 6.3. Nhóm Chatbot Automation

### FR-11: Nhận yêu cầu bằng ngôn ngữ tự nhiên

Chatbot phải hiểu các yêu cầu như “tạo agent review code”, “tắt bash tool”, “thêm MCP server Context7”, “tìm skill viết tài liệu trên marketplace”, “đổi model mặc định”.

**Mức ưu tiên:** Must have

### FR-12: Chuyển yêu cầu thành hành động cấu hình

Chatbot phải chuyển yêu cầu của người dùng thành đề xuất cấu hình cụ thể.

**Mức ưu tiên:** Must have

### FR-13: Hỏi lại khi thiếu thông tin quan trọng

Khi yêu cầu thiếu dữ liệu như tên agent, model, provider hoặc URL MCP server, chatbot phải hỏi lại thay vì tự đoán cấu hình nguy hiểm.

**Mức ưu tiên:** Must have

### FR-14: Giải thích tác động cấu hình

Trước khi apply, chatbot phải giải thích ngắn gọn cấu hình sẽ thay đổi gì và có rủi ro gì.

**Mức ưu tiên:** Must have

### FR-15: Không tự apply thay đổi nguy hiểm

Các thay đổi liên quan đến quyền ghi file, chạy bash, xoá dữ liệu, secret hoặc permission rộng phải yêu cầu xác nhận rõ ràng.

**Mức ưu tiên:** Must have

## 6.4. Nhóm Model & Provider

### FR-16: Quản lý model mặc định

Hệ thống phải cho phép chọn model mặc định theo định dạng provider/model.
Trong chat composer, danh sách model phải có typeahead để lọc nhanh theo provider hoặc tên model, đồng thời vẫn giữ lựa chọn mặc định.

**Mức ưu tiên:** Must have

### FR-17: Quản lý small model

Hệ thống nên cho phép cấu hình small model cho các tác vụ nhẹ.

**Mức ưu tiên:** Should have

### FR-18: Quản lý provider options

Hệ thống phải hỗ trợ cấu hình các tuỳ chọn provider phổ biến như timeout, chunk timeout, base URL hoặc các options đặc thù nếu OpenCode hỗ trợ.

**Mức ưu tiên:** Should have

### FR-19: Quản lý provider allowlist/blocklist

Hệ thống nên hỗ trợ cấu hình `enabled_providers` và `disabled_providers`.

**Mức ưu tiên:** Should have

## 6.5. Nhóm Agent

### FR-20: Danh sách agent

Hệ thống phải hiển thị danh sách agent hiện có.
Các selector agent trong chat/session context phải hỗ trợ typeahead để lọc theo tên, mode hoặc mô tả agent.

**Mức ưu tiên:** Must have

### FR-21: Tạo agent mới

Hệ thống phải cho phép tạo agent mới bằng wizard hoặc chatbot.

**Mức ưu tiên:** Must have

### FR-22: Chỉnh sửa agent

Hệ thống phải cho phép chỉnh sửa description, prompt, model, mode, temperature, max steps, tool và permission của agent.

**Mức ưu tiên:** Must have

### FR-23: Đặt default agent

Hệ thống phải cho phép đặt default agent, đồng thời kiểm tra agent đó có hợp lệ để làm primary agent hay không.

**Mức ưu tiên:** Should have

## 6.6. Nhóm Tool & Permission

### FR-24: Hiển thị tool khả dụng

Hệ thống phải hiển thị danh sách tool built-in và tool đến từ MCP/custom tool nếu lấy được từ OpenCode.

**Mức ưu tiên:** Must have

### FR-25: Cấu hình bật/tắt tool

Hệ thống phải cho phép bật/tắt tool toàn cục hoặc theo agent.

**Mức ưu tiên:** Must have

### FR-26: Cấu hình permission

Hệ thống phải cho phép cấu hình permission theo mức allow, ask, deny.

**Mức ưu tiên:** Must have

### FR-27: Cảnh báo permission nguy hiểm

Hệ thống phải cảnh báo khi người dùng cấp quyền rộng cho bash, write, edit hoặc wildcard `*`.

**Mức ưu tiên:** Must have

## 6.7. Nhóm Skill Management & Marketplace

### FR-28: Danh sách skill hiện có

Hệ thống phải hiển thị toàn bộ skill đang có từ project, global và các nguồn tương thích mà OpenCode có thể phát hiện.

**Mức ưu tiên:** Must have

### FR-29: Phân loại nguồn và scope của skill

Hệ thống phải phân biệt skill theo nguồn cài đặt OpenCode như project, global, `.agents` compatible hoặc marketplace-installed.

**Mức ưu tiên:** Must have

### FR-30: Tìm kiếm và lọc skill local

Hệ thống phải cho phép tìm kiếm skill đã có theo name, description, metadata, license, compatibility, scope và trạng thái validation.

**Mức ưu tiên:** Must have

### FR-31: Xem chi tiết và preview skill

Hệ thống phải cho phép xem chi tiết một skill, bao gồm frontmatter, mô tả, nội dung `SKILL.md`, đường dẫn nguồn và cảnh báo nếu skill không hợp lệ.

**Mức ưu tiên:** Must have

### FR-32: Validate skill

Hệ thống phải validate skill trước khi lưu hoặc cài đặt, bao gồm kiểm tra name, description, YAML frontmatter, compatibility, metadata và tên thư mục chứa `SKILL.md`.

**Mức ưu tiên:** Must have

### FR-33: Tạo, chỉnh sửa, xoá, import và export skill

Hệ thống nên cho phép tạo mới, chỉnh sửa, xoá, import và export skill bằng giao diện, kèm preview diff và backup trước khi ghi thay đổi.

**Mức ưu tiên:** Should have

### FR-34: Skill Marketplace tìm kiếm online

Hệ thống phải cung cấp Skill Marketplace để người dùng tìm kiếm skill trên mạng hoặc registry được cấu hình. Kết quả phải hiển thị tối thiểu name, description, source URL, license, compatibility và trạng thái tin cậy nếu xác định được.

**Mức ưu tiên:** Must have

### FR-35: Cài đặt hoặc cập nhật skill từ marketplace

Hệ thống phải cho phép cài đặt hoặc cập nhật skill từ marketplace sau khi hiển thị preview nội dung, diff, vị trí cài đặt và yêu cầu xác nhận rõ ràng từ người dùng.

**Mức ưu tiên:** Must have

### FR-36: Quản lý permission của skill tool

Hệ thống phải cho phép cấu hình permission cho native `skill` tool ở mức global hoặc theo agent, gồm allow, ask và deny.

**Mức ưu tiên:** Must have

## 6.8. Nhóm MCP

### FR-37: Danh sách MCP server

Hệ thống phải hiển thị các MCP server đã cấu hình và trạng thái nếu OpenCode cung cấp.

**Mức ưu tiên:** Must have

### FR-38: Thêm MCP server

Hệ thống phải cho phép thêm MCP server local hoặc remote.

**Mức ưu tiên:** Must have

### FR-39: Cấu hình OAuth/header/env cho MCP

Hệ thống nên hỗ trợ cấu hình OAuth, header và biến môi trường cho MCP server.

**Mức ưu tiên:** Should have

### FR-40: Quản lý MCP theo agent

Hệ thống nên cho phép bật MCP server cho agent cụ thể thay vì bật toàn cục.

**Mức ưu tiên:** Should have

## 6.9. Nhóm Command

### FR-41: Tạo command

Hệ thống phải cho phép tạo custom command với template, description, agent, model và argument.

**Mức ưu tiên:** Should have

### FR-42: Chỉnh sửa command

Hệ thống phải cho phép chỉnh sửa hoặc xoá command hiện có.

**Mức ưu tiên:** Should have

### FR-43: Preview command

Hệ thống nên cho phép xem trước prompt/template trước khi lưu.

**Mức ưu tiên:** Should have

## 6.10. Nhóm Session & Chat Runtime

### FR-44: Quản lý session

Hệ thống phải cho phép xem danh sách, mở và tạo session nếu API/server hỗ trợ.
Hệ thống phải cho phép thay đổi Model, Agent và chọn Skills, MCPs theo từng session.

**Mức ưu tiên:** Should have

### FR-45: Gửi prompt đến OpenCode

Hệ thống nên cho phép gửi prompt đến OpenCode session từ web chatbot.
Khi hiển thị phản hồi, UI phải tách reasoning/activity parts khỏi nội dung chính, render reasoning bằng text mờ khi có dữ liệu, và hỗ trợ markdown phổ biến gồm heading, list, code block và bảng markdown.

**Mức ưu tiên:** Should have

### FR-46: Export session

Hệ thống nên cho phép export session để lưu trữ hoặc phân tích.

**Mức ưu tiên:** Could have

## 6.11. Nhóm Observability & Logs

### FR-47: Hiển thị log thao tác

Hệ thống phải lưu lịch sử thao tác cấu hình: ai thay đổi, thay đổi gì, lúc nào, kết quả ra sao.

**Mức ưu tiên:** Should have

### FR-48: Hiển thị lỗi dễ hiểu

Khi OpenCode trả lỗi hoặc file config sai, hệ thống phải chuyển lỗi kỹ thuật thành thông báo dễ hiểu.

**Mức ưu tiên:** Must have

### FR-49: Kiểm tra cấu hình sau khi apply

Sau khi lưu cấu hình, hệ thống nên chạy kiểm tra lại hoặc gọi API tương ứng để đảm bảo OpenCode vẫn hoạt động.

**Mức ưu tiên:** Should have

## 7. Yêu cầu phi chức năng

## 7.1. Bảo mật

### NFR-01: Không lưu secret thô nếu chưa được mã hoá

Hệ thống không được lưu API key, password hoặc token dạng plain text trong database nếu chưa có cơ chế mã hoá phù hợp.

### NFR-02: Ưu tiên dùng biến môi trường hoặc file secret

Khi cấu hình provider hoặc MCP, hệ thống nên khuyến khích dùng `{env:VARIABLE_NAME}` hoặc `{file:path}` thay vì ghi trực tiếp secret vào config.

### NFR-03: Xác nhận trước hành động rủi ro cao

Mọi thay đổi có thể làm agent chạy lệnh shell, sửa file, ghi đè cấu hình, bật wildcard permission hoặc tắt cơ chế an toàn đều phải yêu cầu xác nhận.

### NFR-04: Phân quyền tối thiểu

Nếu có hệ thống user nội bộ, mỗi user chỉ được thao tác với project/server được cấp quyền.

### NFR-05: Kiểm soát nguồn skill online

Khi tìm kiếm hoặc cài đặt skill từ mạng, hệ thống phải hiển thị nguồn, nội dung, license, compatibility và cảnh báo độ tin cậy trước khi cho phép cài đặt.

### NFR-06: Không tự động tin cậy nội dung skill marketplace

Skill tải từ marketplace phải được coi là nội dung chưa tin cậy cho đến khi được validate, preview và người dùng xác nhận. Hệ thống không được tự động ghi đè skill hiện có nếu chưa có diff và backup.

## 7.2. Tính đúng đắn

### NFR-07: Config sinh ra phải hợp lệ

Cấu hình do hệ thống sinh ra phải đúng schema OpenCode ở mức tốt nhất có thể.

### NFR-08: Không làm mất cấu hình không liên quan

Vì OpenCode merge nhiều nguồn cấu hình, hệ thống không được xoá hoặc ghi đè các field không liên quan khi người dùng chỉ chỉnh một nhóm cấu hình nhỏ.

### NFR-09: Có diff và backup

Mọi thay đổi file cấu hình phải có diff trước khi lưu và có backup để khôi phục.

## 7.3. Khả dụng và dễ dùng

### NFR-10: Giao diện dễ hiểu với người mới

Các field kỹ thuật phải có mô tả ngắn, ví dụ và cảnh báo.

### NFR-11: Hỗ trợ cả chatbot và form

Người dùng có thể cấu hình bằng hội thoại hoặc bằng form. Chatbot phù hợp với yêu cầu tự nhiên, form phù hợp với dữ liệu có cấu trúc.

### NFR-12: Không yêu cầu người dùng nhớ lệnh CLI

Các thao tác phổ biến phải được thể hiện bằng nút, form hoặc wizard.

## 7.4. Hiệu năng

### NFR-13: Phản hồi giao diện nhanh

Các thao tác đọc cấu hình, render form và preview diff nên phản hồi trong thời gian ngắn để không làm gián đoạn flow cấu hình.

### NFR-14: Không block UI khi gọi OpenCode

Các thao tác gọi server, validate, kiểm tra MCP hoặc session phải chạy bất đồng bộ và có trạng thái loading/error rõ ràng.

## 7.5. Độ tin cậy

### NFR-15: Không ghi file khi validate thất bại

Nếu cấu hình mới không hợp lệ, hệ thống không được ghi đè file cấu hình hiện tại.

### NFR-16: Có cơ chế khôi phục

Nếu ghi file thất bại hoặc OpenCode không chạy được sau khi apply, hệ thống phải hướng dẫn khôi phục backup.

## 7.6. Khả năng mở rộng

### NFR-17: Thiết kế module theo nhóm cấu hình

Các nhóm như model, provider, agent, tool, permission, skill, Skill Marketplace, MCP, command, TUI config nên được thiết kế thành module riêng để dễ mở rộng.

### NFR-18: Dễ bổ sung field mới

Vì OpenCode có thể thay đổi schema, hệ thống nên thiết kế parser/form generator đủ linh hoạt để thêm field mới mà không phải viết lại toàn bộ.

## 7.7. Khả năng bảo trì

### NFR-19: Có test cho parser và config writer

Các phần đọc, merge, validate và ghi config phải có unit test.

### NFR-20: Có log nội bộ

Hệ thống cần log rõ request đến OpenCode, lỗi parse config, lỗi validate và lỗi ghi file.

## 7.8. Tính tương thích

### NFR-21: Hỗ trợ Windows, macOS, Linux ở mức thiết kế

Vì OpenCode có đường dẫn cấu hình khác nhau theo hệ điều hành, hệ thống phải xử lý path theo platform.

### NFR-22: Tôn trọng cấu hình hiện có của OpenCode

Hệ thống không được giả định chỉ có project config. Cần nhận biết global config, project config, custom config, inline config hoặc managed config nếu có thể.

## 8. Ràng buộc và giả định

### 8.1. Ràng buộc

- OpenCode phải được cài đặt hoặc có server đang chạy.
- Website phụ thuộc vào API/CLI/config format mà OpenCode cung cấp.
- Tính năng tìm kiếm skill online phụ thuộc vào nguồn marketplace, registry hoặc web search được cấu hình.
- Một số chức năng có thể bị giới hạn nếu OpenCode server không bật API tương ứng.
- Một số cấu hình cấp managed/admin có thể không được phép chỉnh sửa.
- CORS và authentication phải được cấu hình đúng nếu frontend chạy khác origin với OpenCode server.

### 8.2. Giả định

- Người dùng mục tiêu đã có nhu cầu sử dụng OpenCode cho lập trình hoặc tự động hoá project.
- Phiên bản đầu tiên ưu tiên chạy local hoặc trong môi trường cá nhân/nhóm nhỏ.
- Hệ thống sẽ không tự ý gửi secret lên dịch vụ bên ngoài.
- Khi tìm kiếm skill online, hệ thống chỉ gửi truy vấn cần thiết và không gửi nội dung project/private config nếu không có sự đồng ý.
- Chatbot phải preview các thay đổi cấu hình trước khi apply. Lưu ý trạng thái hiện tại vẫn có một số thao tác file-level viết trực tiếp như command create/delete, agent delete, skill delete và MCP delete; các ngoại lệ này cần được giữ có backup/audit hoặc chuyển sang preview/apply nếu mở rộng phạm vi an toàn.
- Các chức năng nguy hiểm cần xác nhận thủ công.

## 9. Đề xuất phạm vi MVP

Phiên bản MVP nên tập trung vào các phần sau:

1. Kết nối OpenCode server local.
2. Đọc và hiển thị `opencode.json` / `opencode.jsonc`.
3. Chỉnh sửa các nhóm cấu hình cơ bản:
   - server
   - model/provider
   - agent
   - tool/permission
   - skill/Skill Marketplace
   - MCP
4. Chatbot tạo đề xuất cấu hình từ yêu cầu tự nhiên.
5. Preview JSON và diff.
6. Validate cấu hình trước khi lưu.
7. Backup file cấu hình trước khi ghi.
8. Hiển thị trạng thái server và lỗi cơ bản.
9. Hiển thị danh sách skill hiện có và hỗ trợ tìm kiếm skill online ở mức cơ bản.

Các phần nên để sau MVP:

- Quản lý session nâng cao.
- Plugin marketplace.
- Multi-user/multi-tenant.
- RBAC phức tạp.
- Tích hợp cloud deployment.
- Quản lý managed config cấp doanh nghiệp.

## 10. Tiêu chí thành công

Dự án được xem là đạt mục tiêu ban đầu nếu:

- Người dùng có thể cấu hình OpenCode cơ bản mà không cần sửa JSON thủ công.
- Người dùng có thể tạo agent, đổi model, cấu hình permission, quản lý skill và thêm MCP server bằng giao diện.
- Người dùng có thể xem toàn bộ skill đang có, tìm kiếm skill online và cài đặt skill sau khi xem preview/diff.
- Các thay đổi cấu hình rủi ro có preview diff trước khi apply; các thao tác file-level viết trực tiếp phải được ghi rõ trong API spec và có backup/audit phù hợp.
- Hệ thống không ghi cấu hình sai nếu validate thất bại.
- Người dùng hiểu được tác động của thay đổi thông qua giải thích của chatbot.
- Có thể rollback cấu hình khi thao tác sai.
- Giao diện đủ đơn giản để người mới dùng OpenCode có thể thao tác theo hướng dẫn.

## 11. Ghi chú thiết kế ban đầu

Kiến trúc ban đầu có thể chia thành các lớp sau:

- **Frontend Web UI:** chatbot, form cấu hình, wizard, diff viewer, dashboard trạng thái.
- **Backend API:** xử lý auth, gọi OpenCode API/CLI, đọc/ghi file config, validate, backup.
- **OpenCode Adapter:** lớp bọc riêng cho các thao tác với OpenCode để tránh phụ thuộc trực tiếp vào UI.
- **Skill Registry/Marketplace Adapter:** lớp tìm kiếm, lấy metadata, tải preview và kiểm tra nguồn skill từ marketplace hoặc web search được cấu hình.
- **Config Engine:** parse JSON/JSONC, merge config, validate schema, sinh diff, ghi file an toàn.
- **Audit/History Store:** lưu lịch sử thay đổi, backup metadata, log lỗi.

Nguyên tắc quan trọng: **UI không nên ghi trực tiếp vào file cấu hình. Mọi thay đổi nên đi qua Config Engine để validate, diff, backup rồi mới apply.**
