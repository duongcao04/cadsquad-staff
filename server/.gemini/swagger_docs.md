# Log Tài Liệu Hóa API Swagger (Bản Chi Tiết Cuối Cùng - 15 Modules)

Tệp này ghi lại toàn bộ các thay đổi để tài liệu hóa API bằng Swagger cho tất cả 15 modules, với chi tiết đầy đủ cho từng endpoint theo yêu cầu.

---

### **1. Module: Xác thực (Auth)**
- **Tags:** `Auth`
- **Description:** API đăng ký, đăng nhập, và quản lý phiên.

#### Endpoint: `POST /auth/login`
- **Mô tả:** Đăng nhập vào hệ thống.
- **Xác thực:** Không yêu cầu.
- **Request Body:** `LoginUserDto`
  ```json
  { "email": "user@example.com", "password": "password123" }
  ```
- **Response (200 OK):** `LoginResponse`
  ```json
  {
    "accessToken": "ey...",
    "user": { "id": "uuid-user-1", "displayName": "User Name", "role": "USER" }
  }
  ```
- **Error Responses:** 401 (Unauthorized).

#### Endpoint: `POST /auth/register`
- **Mô tả:** Đăng ký tài khoản mới.
- **Xác thực:** Không.
- **Request Body:** `RegisterUserDto`
  ```json
  { "firstName": "Van", "lastName": "A", "email": "vana@example.com", "password": "password123" }
  ```
- **Response (201 Created):** `UserResponseDto`.
- **Error Responses:** 409 (Conflict).

#### Endpoint: `GET /auth/profile`
- **Mô tả:** Lấy thông tin của người dùng đang đăng nhập.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** `UserResponseDto`.

#### Endpoint: `GET /auth/validate-token`
- **Mô tả:** Kiểm tra token còn hợp lệ hay không.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** `{ "isValid": 1 }`.
- **Error Responses:** 401 (Unauthorized).

---

### **2. Module: Đăng ký Trình duyệt (Browser Subscribes)**
- **Tags:** `Browser Subscribes`
- **Description:** API quản lý subscription của trình duyệt để gửi push notification.

#### Endpoint: `POST /browser-subscribes`
- **Mô tả:** Tạo subscription mới.
- **Xác thực:** Không.
- **Request Body:** `CreateBrowserSubscribeDto`.
- **Response (201 Created):** `BrowserSubscribe`.

#### Endpoint: `GET /browser-subscribes`
- **Mô tả:** Lấy tất cả subscriptions.
- **Xác thực:** Không.
- **Response (200 OK):** Mảng `BrowserSubscribe`.

#### Endpoint: `GET /browser-subscribes/:id`
- **Mô tả:** Lấy chi tiết subscription theo ID.
- **Xác thực:** Không.
- **Path Parameter:** `id`.
- **Response (200 OK):** `BrowserSubscribe`.

#### Endpoint: `PATCH /browser-subscribes/:id`
- **Mô tả:** Cập nhật subscription.
- **Xác thực:** Không.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateBrowserSubscribeDto`.
- **Response (200 OK):** `BrowserSubscribe`.

#### Endpoint: `DELETE /browser-subscribes/:id`
- **Mô tả:** Xóa subscription theo ID.
- **Xác thực:** Không.
- **Path Parameter:** `id`.
- **Response (204 No Content):** Không có nội dung.

#### Endpoint: `DELETE /browser-subscribes/by-endpoint`
- **Mô tả:** Xóa subscription dựa trên endpoint.
- **Xác thực:** Không.
- **Request Body:** `{ "endpoint": "https://..." }`.
- **Response (204 No Content):** Không có nội dung.

---

### **3. Module: Bình luận (Comments)**
- **Tags:** `Comments`
- **Description:** API quản lý bình luận trên công việc.

#### Endpoint: `POST /comments`
- **Mô tả:** Tạo bình luận mới.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Request Body:** `CreateCommentDto`.
- **Response (201 Created):** `CommentResponseDto`.

#### Endpoint: `GET /comments/job/:jobId`
- **Mô tả:** Lấy tất cả bình luận của một công việc.
- **Xác thực:** Không.
- **Path Parameter:** `jobId`.
- **Response (200 OK):** Mảng `CommentResponseDto`.

#### Endpoint: `GET /comments/:id`
- **Mô tả:** Lấy chi tiết bình luận.
- **Xác thực:** Không.
- **Path Parameter:** `id`.
- **Response (200 OK):** `CommentResponseDto`.

#### Endpoint: `PATCH /comments/:id`
- **Mô tả:** Cập nhật bình luận.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateCommentDto`.
- **Response (200 OK):** `CommentResponseDto`.

#### Endpoint: `DELETE /comments/:id`
- **Mô tả:** Xóa bình luận.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **4. Module: Cấu hình (Configs)**
- **Tags:** `Configs`
- **Description:** API quản lý cấu hình hệ thống.

#### Endpoint: `POST /configs`
- **Mô tả:** Tạo cấu hình mới.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Request Body:** `CreateConfigDto`.
- **Response (201 Created):** `ConfigResponseDto`.

#### Endpoint: `GET /configs`
- **Mô tả:** Lấy danh sách cấu hình của người dùng.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** Mảng `ConfigResponseDto`.

#### Endpoint: `GET /configs/:id`
- **Mô tả:** Lấy chi tiết cấu hình theo ID.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** `ConfigResponseDto`.

#### Endpoint: `GET /configs/code/:code`
- **Mô tả:** Lấy chi tiết cấu hình theo mã.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `code`.
- **Response (200 OK):** `ConfigResponseDto`.

#### Endpoint: `PATCH /configs/:id`
- **Mô tả:** Cập nhật cấu hình theo ID.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateConfigDto`.
- **Response (200 OK):** `ConfigResponseDto`.

#### Endpoint: `PATCH /configs/code/:code`
- **Mô tả:** Cập nhật cấu hình theo mã.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `code`.
- **Request Body:** `UpdateConfigDto`.
- **Response (200 OK):** `ConfigResponseDto`.

#### Endpoint: `DELETE /configs/:id`
- **Mô tả:** Xóa cấu hình.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **5. Module: Phòng ban (Departments)**
- **Tags:** `Departments`
- **Description:** API quản lý phòng ban.

#### Endpoint: `POST /departments`
- **Mô tả:** Tạo phòng ban mới.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Request Body:** `CreateDepartmentDto`.
- **Response (201 Created):** `DepartmentResponseDto`.

#### Endpoint: `GET /departments`
- **Mô tả:** Lấy danh sách phòng ban.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** Mảng `DepartmentResponseDto`.

#### Endpoint: `GET /departments/:id`
- **Mô tả:** Lấy chi tiết phòng ban.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** `DepartmentResponseDto`.

#### Endpoint: `PATCH /departments/:id`
- **Mô tả:** Cập nhật phòng ban.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateDepartmentDto`.
- **Response (200 OK):** `DepartmentResponseDto`.

#### Endpoint: `DELETE /departments/:id`
- **Mô tả:** Xóa phòng ban.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **6. Module: Thư viện (Gallery)**
- **Tags:** `Gallery`
- **Description:** API tải lên và quản lý hình ảnh.

#### Endpoint: `POST /gallery/upload`
- **Mô tả:** Tải ảnh lên.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Request:** `multipart/form-data` chứa `file`.
- **Response (201 Created):** `GalleryResponseDto`.

#### Endpoint: `GET /gallery`
- **Mô tả:** Lấy danh sách ảnh của người dùng hiện tại.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** Mảng `GalleryResponseDto`.

#### Endpoint: `DELETE /gallery/:id`
- **Mô tả:** Xóa ảnh.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Query Parameter:** `publicId`.
- **Response (200 OK):** Thông báo thành công.

---

### **7. Module: Công việc (Jobs)**
- **Tags:** `Jobs`
- **Description:** API quản lý công việc.

#### Endpoint: `POST /jobs`
- **Mô tả:** Tạo công việc mới.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Request Body:** `CreateJobDto`.
- **Response (201 Created):** `JobResponseDto`.

#### Endpoint: `GET /jobs`
- **Mô tả:** Lấy danh sách công việc (phân trang, lọc, sắp xếp).
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Query Parameters:** `JobQueryDto`.
- **Response (200 OK):** Mảng `JobResponseDto`.

#### Endpoint: `GET /jobs/search`
- **Mô tả:** Tìm kiếm công việc theo từ khóa.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Query Parameter:** `keywords`.
- **Response (200 OK):** Mảng `JobResponseDto`.

#### Endpoint: `GET /jobs/deadline/:isoDate`
- **Mô tả:** Lấy công việc theo ngày hết hạn.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `isoDate`.
- **Response (200 OK):** Mảng `JobResponseDto`.

#### Endpoint: `GET /jobs/no/:jobNo`
- **Mô tả:** Tìm công việc theo mã.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `jobNo`.
- **Response (200 OK):** `JobResponseDto`.

#### Endpoint: `GET /jobs/columns`
- **Mô tả:** Lấy cấu hình cột cho bảng công việc của người dùng.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** Cấu hình cột.

#### Endpoint: `GET /jobs/dueOn/:inputDate`
- **Mô tả:** Lấy công việc hết hạn vào một ngày cụ thể.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `inputDate`.
- **Response (200 OK):** Mảng `JobResponseDto`.

#### Endpoint: `GET /jobs/:id`
- **Mô tả:** Lấy chi tiết công việc.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Response (200 OK):** `JobResponseDto`.

#### Endpoint: `GET /jobs/:id/activity-log`
- **Mô tả:** Lấy nhật ký hoạt động của công việc.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Mảng `ActivityLog`.

#### Endpoint: `GET /jobs/:id/assignees`
- **Mô tả:** Lấy danh sách người được giao của công việc.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Mảng người dùng.

#### Endpoint: `PATCH /jobs/:id`
- **Mô tả:** Cập nhật công việc.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateJobDto`.
- **Response (200 OK):** `JobResponseDto`.

#### Endpoint: `PATCH /jobs/:id/change-status`
- **Mô tả:** Thay đổi trạng thái công việc.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Request Body:** `ChangeStatusDto`.
- **Response (200 OK):** `JobResponseDto`.

#### Endpoint: `PATCH /jobs/:id/reschedule`
- **Mô tả:** Dời ngày hết hạn của công việc.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Request Body:** `RescheduleJobDto`.
- **Response (200 OK):** `JobResponseDto`.

#### Endpoint: `PATCH /jobs/:id/mark-paid`
- **Mô tả:** Đánh dấu công việc đã thanh toán.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Response (200 OK):** `JobResponseDto`.

#### Endpoint: `POST /jobs/bulk/change-status`
- **Mô tả:** Thay đổi trạng thái hàng loạt công việc.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Request Body:** `BulkChangeStatusDto`.
- **Response (200 OK):** Thông báo thành công.

#### Endpoint: `PATCH /jobs/:id/assign-member`
- **Mô tả:** Cập nhật người được giao cho công việc.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateJobMembersDto`.
- **Response (200 OK):** `JobResponseDto`.

#### Endpoint: `DELETE /jobs/:id`
- **Mô tả:** Xóa công việc.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **8. Module: Trạng thái Công việc (Job Statuses)**
- **Tags:** `Job Statuses`
- **Description:** API quản lý trạng thái công việc.

#### Endpoint: `POST /job-statuses`
- **Mô tả:** Tạo trạng thái mới.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Request Body:** `CreateJobStatusDto`.
- **Response (201 Created):** `JobStatusResponseDto`.

#### Endpoint: `GET /job-statuses`
- **Mô tả:** Lấy danh sách trạng thái.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** Mảng `JobStatusResponseDto`.

#### Endpoint: `GET /job-statuses/order/:orderNum`
- **Mô tả:** Tìm trạng thái theo số thứ tự.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `orderNum`.
- **Response (200 OK):** `JobStatusResponseDto`.

#### Endpoint: `GET /job-statuses/code/:statusCode/jobs`
- **Mô tả:** Lấy công việc theo mã trạng thái.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `statusCode`.
- **Response (200 OK):** Mảng `JobResponseDto`.

#### Endpoint: `GET /job-statuses/:id`
- **Mô tả:** Lấy chi tiết trạng thái.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** `JobStatusResponseDto`.

#### Endpoint: `PATCH /job-statuses/:id`
- **Mô tả:** Cập nhật trạng thái.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateJobStatusDto`.
- **Response (200 OK):** `JobStatusResponseDto`.

#### Endpoint: `DELETE /job-statuses/:id`
- **Mô tả:** Xóa trạng thái.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **9. Module: Chức danh (Job Titles)**
- **Tags:** `Job Titles`
- **Description:** API quản lý chức danh.

#### Endpoint: `POST /job-titles`
- **Mô tả:** Tạo chức danh mới.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Request Body:** `CreateJobTitleDto`.
- **Response (201 Created):** `JobTitleResponseDto`.

#### Endpoint: `GET /job-titles`
- **Mô tả:** Lấy danh sách chức danh.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** Mảng `JobTitleResponseDto`.

#### Endpoint: `GET /job-titles/:id`
- **Mô tả:** Lấy chi tiết chức danh.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** `JobTitleResponseDto`.

#### Endpoint: `PATCH /job-titles/:id`
- **Mô tả:** Cập nhật chức danh.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateJobTitleDto`.
- **Response (200 OK):** `JobTitleResponseDto`.

#### Endpoint: `DELETE /job-titles/:id`
- **Mô tả:** Xóa chức danh.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **10. Module: Loại công việc (Job Types)**
- **Tags:** `Job Types`
- **Description:** API quản lý loại công việc.

#### Endpoint: `POST /job-types`
- **Mô tả:** Tạo loại công việc mới.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Request Body:** `CreateJobTypeDto`.
- **Response (201 Created):** `JobTypeResponseDto`.

#### Endpoint: `GET /job-types`
- **Mô tả:** Lấy danh sách loại công việc.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** Mảng `JobTypeResponseDto`.

#### Endpoint: `GET /job-types/:id`
- **Mô tả:** Lấy chi tiết loại công việc.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** `JobTypeResponseDto`.

#### Endpoint: `PATCH /job-types/:id`
- **Mô tả:** Cập nhật loại công việc.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateJobTypeDto`.
- **Response (200 OK):** `JobTypeResponseDto`.

#### Endpoint: `DELETE /job-types/:id`
- **Mô tả:** Xóa loại công việc.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **11. Module: Thông báo (Notifications)**
- **Tags:** `Notifications`
- **Description:** API quản lý thông báo.

#### Endpoint: `POST /notifications/send`
- **Mô tả:** Gửi thông báo mới.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Request Body:** `CreateNotificationDto`.
- **Response (201 Created):** `NotificationResponseDto`.

#### Endpoint: `GET /notifications`
- **Mô tả:** Lấy danh sách thông báo của người dùng.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** Mảng `NotificationResponseDto`.

#### Endpoint: `GET /notifications/:id`
- **Mô tả:** Lấy chi tiết thông báo.
- **Xác thực:** Không.
- **Path Parameter:** `id`.
- **Response (200 OK):** `NotificationResponseDto`.

#### Endpoint: `PATCH /notifications/:id`
- **Mô tả:** Cập nhật thông báo (VD: đánh dấu đã đọc).
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateNotificationDto`.
- **Response (200 OK):** `NotificationResponseDto`.

#### Endpoint: `DELETE /notifications/:id`
- **Mô tả:** Xóa thông báo.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **12. Module: Kênh thanh toán (Payment Channels)**
- **Tags:** `Payment Channels`
- **Description:** API quản lý kênh thanh toán.

#### Endpoint: `POST /payment-channels`
- **Mô tả:** Tạo kênh thanh toán mới.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Request Body:** `CreatePaymentChannelDto`.
- **Response (201 Created):** `PaymentChannelResponseDto`.

#### Endpoint: `GET /payment-channels`
- **Mô tả:** Lấy danh sách kênh thanh toán.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** Mảng `PaymentChannelResponseDto`.

#### Endpoint: `GET /payment-channels/:id`
- **Mô tả:** Lấy chi tiết kênh thanh toán.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** `PaymentChannelResponseDto`.

#### Endpoint: `PATCH /payment-channels/:id`
- **Mô tả:** Cập nhật kênh thanh toán.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdatePaymentChannelDto`.
- **Response (200 OK):** `PaymentChannelResponseDto`.

#### Endpoint: `DELETE /payment-channels/:id`
- **Mô tả:** Xóa kênh thanh toán.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **13. Module: Tải lên (Upload)**
- **Tags:** `Upload`
- **Description:** API chung để tải file.

#### Endpoint: `POST /upload/images`
- **Mô tả:** Tải lên một ảnh.
- **Xác thực:** Không.
- **Request:** `multipart/form-data` chứa `image`.
- **Response (201 Created):** `{ "url": "..." }`.

#### Endpoint: `DELETE /upload/images/:id`
- **Mô tả:** Xóa một ảnh.
- **Xác thực:** Không.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **14. Module: Người dùng (Users)** - (Chi tiết hơn)
- **Tags:** `Users`
- **Description:** API quản lý người dùng.

#### Endpoint: `PATCH /users/:id/reset-password`
- **Mô tả:** Admin reset mật khẩu cho người dùng.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Request Body:** `ResetPasswordDto`.
- **Response (200 OK):** Thông báo thành công.

#### Endpoint: `GET /users/username/:username`
- **Mô tả:** Kiểm tra username có hợp lệ (đã tồn tại) hay không.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `username`.
- **Response (200 OK):** Boolean.

#### Endpoint: `GET /users/:id`
- **Mô tả:** Lấy chi tiết người dùng.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** `UserResponseDto`.

#### Endpoint: `PATCH /users/:id`
- **Mô tả:** Cập nhật thông tin người dùng.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateUserDto`.
- **Response (200 OK):** `UserResponseDto`.

#### Endpoint: `DELETE /users/:id`
- **Mô tả:** Xóa người dùng.
- **Xác thực:** Yêu cầu `Bearer Token` & `Admin`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.

---

### **15. Module: Thiết bị Người dùng (User Devices)**
- **Tags:** `User Devices`
- **Description:** API quản lý thiết bị người dùng.

#### Endpoint: `POST /user-devices`
- **Mô tả:** Tạo một thiết bị người dùng mới.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Request Body:** `CreateUserDeviceDto`.
- **Response (201 Created):** `UserDeviceResponseDto`.

#### Endpoint: `GET /user-devices`
- **Mô tả:** Lấy danh sách tất cả thiết bị.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Response (200 OK):** Mảng `UserDeviceResponseDto`.

#### Endpoint: `GET /user-devices/user/:userId`
- **Mô tả:** Lấy danh sách thiết bị của một người dùng.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `userId`.
- **Response (200 OK):** Mảng `UserDeviceResponseDto`.

#### Endpoint: `GET /user-devices/:id`
- **Mô tả:** Lấy chi tiết thiết bị.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** `UserDeviceResponseDto`.

#### Endpoint: `PATCH /user-devices/:id`
- **Mô tả:** Cập nhật thiết bị.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Request Body:** `UpdateUserDeviceDto`.
- **Response (200 OK):** `UserDeviceResponseDto`.

#### Endpoint: `DELETE /user-devices/:id`
- **Mô tả:** Xóa thiết bị.
- **Xác thực:** Yêu cầu `Bearer Token`.
- **Path Parameter:** `id`.
- **Response (200 OK):** Thông báo thành công.