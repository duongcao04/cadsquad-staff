1. Thông tin chung (Global Information)
Phần này nằm ở đầu trang Swagger, giúp người mới vào dự án hiểu tổng quan.

Title & Description: Tên dự án và mô tả ngắn gọn về mục đích của API Server.

Version: Phiên bản hiện tại của API (VD: v1.0.3).

Servers: Danh sách các môi trường (Base URL).

Local: http://localhost:3000

Staging: https://api-stg.domain.com

Production: https://api.domain.com

Authentication: Hướng dẫn cách xác thực.

Nút Authorize phải hoạt động được (cấu hình Bearer Token hoặc API Key).

Ghi chú rõ token lấy ở đâu (VD: "Login API để lấy accessToken").

2. Phân nhóm API (Tags)
Đừng để API tràn lan. Hãy gom nhóm chúng lại.

Tags: Chia theo Controller hoặc Module (VD: Auth, Users, Products, Orders).

Description: Mô tả ngắn về chức năng của nhóm này (VD: Users: Quản lý thông tin cá nhân và profile).

3. Chi tiết từng Endpoint (Operations) - Quan trọng nhất
Đây là phần FE đọc nhiều nhất. Mỗi API cần có đủ:

A. Tiêu đề & Mô tả
Summary: Tên ngắn gọn (VD: "Đăng nhập hệ thống").

Description (Optional): Giải thích logic phức tạp nếu có (VD: "API này sẽ kiểm tra user active, nếu chưa active sẽ trả về lỗi 403").

B. Input (Dữ liệu đầu vào)
Parameters:

Query: Các tham số lọc, phân trang (VD: ?page=1&limit=10, keyword=...).

Path: Các ID trên URL (VD: /users/{id}).

Header: Các header đặc biệt (nếu có, VD: x-custom-lang).

Request Body:

Cấu trúc JSON cần gửi lên.

Trường nào là Required (bắt buộc), trường nào là Optional.

C. Output (Dữ liệu đầu ra) - Thường bị thiếu
Rất nhiều backend chỉ làm mỗi case 200 OK. Bạn cần liệt kê đủ:

Success Response (200/201):

Schema trả về trông như thế nào?

Ví dụ cụ thể (Example Value).

Error Responses (400, 401, 403, 404, 500):

400 Bad Request: Khi thiếu trường hoặc sai format.

401 Unauthorized: Khi chưa đăng nhập hoặc token hết hạn.

403 Forbidden: Khi không có quyền (VD: User thường đòi xóa Admin).

404 Not Found: Khi không tìm thấy tài nguyên.

409 Conflict: Khi dữ liệu bị trùng (VD: Trùng email đăng ký).

4. Chi tiết DTO (Data Transfer Objects)
Khi bấm vào tab Schema hoặc Model ở cuối trang Swagger, hoặc khi mở rộng phần Request/Response:

Field Description: Giải thích từng trường có ý nghĩa gì.

VD: status: "0: Pending, 1: Active, 2: Blocked".

Data Type: String, Integer, Boolean, Enum.

Example Value: Cực kỳ quan trọng.

Đừng để string, 0 mặc định.

Hãy để: email: "admin@example.com", phone: "0901234567".

Constraints:

MinLength, MaxLength (VD: password tối thiểu 6 ký tự).

Default Value (nếu user không gửi thì server lấy giá trị gì).