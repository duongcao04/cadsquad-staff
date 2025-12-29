# Swagger Documentation Generation Log

This file logs the changes made to the project to add Swagger documentation.

## Job Module

- **`src/modules/job/dto/create-job.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job/job.controller.ts`**:
    - Added `@ApiTags('Jobs')` to the controller.
    - Added `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods.
    - Added `@ApiQuery` and `@ApiParam` where applicable.
- **`src/modules/job/dto/job-response.dto.ts`**: Added `@ApiProperty` decorators to all properties, including nested DTOs.
- **`src/modules/user/dto/user-response.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/comment/dto/comment-response.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job-type/dto/job-type-response.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job-status/dto/job-status-response.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/payment-channel/dto/payment-channel-response.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job/dto/job-filters.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job/dto/job-query.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job/dto/update-job.dto.ts`**: Added `@ApiProperty` decorator for `attachmentUrls`.
- **`src/modules/job/dto/change-status.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job/dto/reschedule-job.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job/dto/bulk-change-status.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job/dto/update-job-members.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job/dto/get-jobs-due.dto.ts`**: No changes needed, already had `@ApiProperty`.

---

## Auth Module

- **`src/modules/auth/dto/login-user.dto.ts`**: Added descriptions to `@ApiProperty` decorators.
- **`src/modules/auth/dto/register-user.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/auth/dto/token-payload.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/auth/auth.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods. Defined a `LoginResponse` class for the login endpoint.

---

## Browser Subscribes Module

- **`src/modules/browser-subscribes/dto/create-browser-subscribe.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/browser-subscribes/dto/update-browser-subscribe.dto.ts`**: Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`.
- **`src/modules/browser-subscribes/browser-subscribes.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, and `@ApiResponse` to all methods. Defined an `EndpointDto` for the `removeByEndpoint` method.

---

## Comment Module

- **`src/modules/comment/dto/create-comment.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/comment/dto/update-comment.dto.ts`**: Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`.
- **`src/modules/comment/comment.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods.

---

## Config Module

- **`src/modules/config/dto/create-config.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/config/dto/update-config.dto.ts`**: Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`.
- **`src/modules/config/config.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods. Defined a `ConfigResponseDto` for the response.

---

## Department Module

- **`src/modules/department/dto/create-department.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/department/dto/update-department.dto.ts`**: Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`.
- **`src/modules/department/dto/department-response.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/department/department.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods.

---

## Gallery Module

- **`src/modules/gallery/gallery.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`, and `@ApiConsumes` to all methods.
- **`src/modules/gallery/dto/upload-gallery.dto.ts`**: No changes needed, already decorated.
- **`src/modules/gallery/dto/update-gallery.dto.ts`**: No changes needed, already decorated.
- **`src/modules/gallery/dto/gallery-response.dto.ts`**: No changes needed, already decorated.

---

## Notification Module

- **`src/modules/notification/dto/create-notification.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/notification/dto/update-notification.dto.ts`**: Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`.
- **`src/modules/notification/dto/notification-response.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/notification/notification.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods.

---

## Payment Channel Module

- **`src/modules/payment-channel/dto/create-payment-channel.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/payment-channel/dto/update-payment-channel.dto.ts`**: Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`.
- **`src/modules/payment-channel/payment-channel.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods.

---

## Upload Module

- **`src/modules/upload/upload.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiConsumes` to all methods. Defined a `UploadResponseDto` for the response.

---

## User Module

- **`src/modules/user/dto/create-user.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/user/dto/update-user.dto.ts`**: Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`.
- **`src/modules/user/dto/protect-user-response.dto.ts`**: Renamed class to `ProtectUserResponseDto` and added `@ApiProperty` decorators to all properties.
- **`src/modules/user/dto/reset-password.dto.ts`**: Added `@ApiProperty` decorator to the `newPassword` property.
- **`src/modules/user/dto/update-password.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/user/user.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods. Corrected a typo in the `create` method.

---

## User Devices Module

- **`src/modules/user-devices/dto/create-user-device.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/user-devices/dto/update-user-device.dto.ts`**: Changed `PartialType` import and added `@ApiProperty` decorators.
- **`src/modules/user-devices/user-devices.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods. Added `JwtGuard` to all methods and defined a `UserDeviceResponseDto` for the response.

---

## Job Status Module

- **`src/modules/job-status/dto/create-job-status.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job-status/dto/update-job-status.dto.ts`**: Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`.
- **`src/modules/job-status/job-status.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods.

---

## Job Title Module

- **`src/modules/job-title/dto/create-job-title.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job-title/dto/update-job-title.dto.ts`**: Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`.
- **`src/modules/job-title/dto/job-title-response.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job-title/job-title.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods.

---

## Job Type Module

- **`src/modules/job-type/dto/create-job-type.dto.ts`**: Added `@ApiProperty` decorators to all properties.
- **`src/modules/job-type/dto/update-job-type.dto.ts`**: Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`.
- **`src/modules/job-type/job-type.controller.ts`**: Added `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` to all methods.
