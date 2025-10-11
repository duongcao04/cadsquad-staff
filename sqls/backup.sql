-- JOB STATUS DATA
INSERT INTO
	public."JobStatus" (
		id,
		"displayName",
		code,
		"thumbnailUrl",
		"hexColor",
		"order",
		icon,
		"nextStatusOrder",
		"prevStatusOrder",
		"createdAt",
		"updatedAt"
	)
VALUES
	(
		'e5a8c177-8a69-4f9c-8f4d-bb7c2f43d11a',
		'Delivered',
		'delivered',
		'https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159965/Cadsquad/STAFF/JOB_STATUS/JOB-DELIVERED_tsnmqv.png',
		'#960ebf',
		2,
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-check-icon lucide-package-check"><path d="m16 16 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>',
		3,
		4,
		'2025-10-02 13:50:58.615',
		'2025-10-02 13:50:58.615'
	),
	(
		'9b8dcb2c-f7cf-440f-95de-7c16bb4f34de',
		'Revision',
		'revision',
		'https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159955/Cadsquad/STAFF/JOB_STATUS/JOB_IN_REVISION_pu2pnu.png',
		'#de575b',
		4,
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-ccw-icon lucide-refresh-ccw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
		2,
		NULL,
		'2025-10-02 13:50:58.615',
		'2025-10-02 13:50:58.615'
	),
	(
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'Finish',
		'finish',
		'https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159965/Cadsquad/STAFF/JOB_STATUS/JOB-_FINISH_xipa75.png',
		'#64b249',
		5,
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hand-coins-icon lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>',
		NULL,
		NULL,
		'2025-10-02 13:50:58.615',
		'2025-10-02 13:50:58.615'
	),
	(
		'0fd0a749-48e4-4c89-9bbd-6f21542c11d3',
		'Completed',
		'completed',
		'https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159964/Cadsquad/STAFF/JOB_STATUS/JOB-_COMPLETED_e0xlg9.png',
		'#5f8fe8',
		3,
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big-icon lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>',
		5,
		NULL,
		'2025-10-02 13:50:58.615',
		'2025-10-02 13:50:58.615'
	),
	(
		'f6db8c15-94cb-47d4-9d73-3b72c0dd19a7',
		'In Progress',
		'in-progress',
		'https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159965/Cadsquad/STAFF/JOB_STATUS/JOB-_IN_PROGRESS_oofjpd.png',
		'#dc9b40',
		1,
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-icon lucide-loader"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>',
		2,
		NULL,
		'2025-10-02 13:50:58.615',
		'2025-10-02 13:50:58.615'
	);

-- JOB TITLE
INSERT INTO
	public."JobTitle" (
		id,
		"displayName",
		notes,
		code,
		"createdAt",
		"updatedAt"
	)
VALUES
	(
		'8f49df5c-5d6b-48ea-9f8a-0b7e8e727f68',
		'Mobile Developer',
		NULL,
		'mobile_dev',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'7b9370c6-0873-4690-8e6c-7469f2a9a68',
		'Web Developer',
		NULL,
		'web_dev',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'dd30de6d-cc28-4d49-a9e1-3f6a8d71a97e',
		'Production Engineer',
		NULL,
		'production_engineer',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'4f7aebc1-10a4-4a5a-8a07-82778c4a3056',
		'Industrial Engineer',
		NULL,
		'industrial_engineer',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'16c7c34e-85f4-4d34-a657-89601b7f40a0',
		'Quality Engineer',
		NULL,
		'quality_engineer',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'79b82a17-11b1-48c4-83f5-f3c9b24b7b0f',
		'CNC Programmer',
		NULL,
		'cnc_programmer',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'b2315ec2-9b67-457c-8260-1fc761db9c2a',
		'Process Engineer',
		NULL,
		'process_engineer',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'c5b9c2ed-f032-41b0-bf63-d846b8fc6aa4',
		'Automation Engineer',
		NULL,
		'automation_engineer',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'6fb479c3-d1cc-4a73-8b7a-1b80e50ec1c1',
		'Reliability Engineer',
		NULL,
		'reliability_engineer',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'8c7fd9a4-2d2e-47ab-93d0-28b4b58de9c7',
		'COO',
		NULL,
		'coo',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'd23f6d14-b5d8-4e2f-9ebf-6b9ef28f1dc8',
		'Tooling Engineer',
		NULL,
		'tooling_engineer',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'4a1fdd62-b77d-4c18-a7b6-56c7f44a4d1e',
		'CEO',
		NULL,
		'ceo',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'37c6fb5a-0b0e-4b5d-8c9c-8cfe8b7ecb14',
		'CTO',
		NULL,
		'cto',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'b0d91d34-f5f1-4b94-9b29-3c0c24e20e91',
		'CFO',
		NULL,
		'cfo',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'26e5f7f1-1b6f-4db0-baf4-1cf7cde271ab',
		'Maintenance Engineer',
		NULL,
		'maintenance_engineer',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'7c6d12b1-bbb4-44f7-88af-25746a9c9eb8',
		'Tax Accountant',
		NULL,
		'tax_accountant',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'e8c4a5b4-1af9-44a6-8d0d-d5f3c9fa07ef',
		'Mechanical Engineer',
		NULL,
		'mechanical_engineer',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'8f1f0f3e-d828-45db-9a19-1a30a0c0c5a5',
		'Accountant',
		NULL,
		'accountant',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'fb2c6c56-7e07-4b82-b2f6-290d9c6d8f9b',
		'Manufacturing Engineer',
		NULL,
		'manufacturing_engineer',
		'2025-10-02 13:50:34.058',
		'2025-10-02 13:50:34.058'
	),
	(
		'f4c342b2-0f5e-4b73-a5ff-30dbf24a7762',
		'System Administrator',
		NULL,
		'sys_admin',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'4b6c02ae-2f8d-4baf-95f4-143bfe4a17e3',
		'SEO Specialist',
		NULL,
		'seo_specialist',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'3d745eb0-4cc7-442f-bf0c-bdfdd7a9935a',
		'Support Specialist',
		NULL,
		'support_specialist',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'38f1c86e-8db3-4a1b-b2d4-97216ec2a1d4',
		'Sales Executive',
		NULL,
		'sales_exec',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'2b67fc5b-4f36-4d9d-9c7b-97e4d1f776b4',
		'Content Creator',
		NULL,
		'content_creator',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'7d593b87-0cd1-44e0-84e5-fac6c079f97d',
		'Sales Manager',
		NULL,
		'sales_manager',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'5d6c1d5d-3d64-4720-b9b8-72a1a89b0eb9',
		'Machine Design Engineer',
		NULL,
		'machine_design_engineer',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	),
	(
		'0d8d3d59-f1cb-48ff-b815-21cb930f5e67',
		'Customer Service Representative',
		NULL,
		'customer_service',
		'2025-10-02 13:50:34.057',
		'2025-10-02 13:50:34.057'
	);

-- JOB TYPE
INSERT INTO
	public."JobType" (
		id,
		code,
		"displayName",
		"hexColor",
		"createdAt",
		"updatedAt"
	)
VALUES
	(
		'9c78d5e6-4f11-47d4-8cb3-dfe287d9b763',
		'PCM',
		'Corporation',
		NULL,
		'2025-10-02 13:50:42.307',
		'2025-10-02 13:50:42.307'
	),
	(
		'2f9c6060-7f9b-42a5-b6fa-df3ac9627c42',
		'FV',
		'Fiverr',
		NULL,
		'2025-10-02 13:50:42.307',
		'2025-10-02 13:50:42.307'
	),
	(
		'f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb',
		'OTH',
		'Other',
		NULL,
		'2025-10-02 13:50:42.307',
		'2025-10-02 13:50:42.307'
	),
	(
		'f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af',
		'XP',
		'Xplora',
		NULL,
		'2025-10-02 13:50:42.307',
		'2025-10-02 13:50:42.307'
	);

-- PAYMENT CHANNEL
INSERT INTO
	public."PaymentChannel" (
		id,
		"displayName",
		"hexColor",
		"logoUrl",
		"ownerName",
		"cardNumber",
		"createdAt",
		"updatedAt"
	)
VALUES
	(
		'4e6c64c7-08fb-46df-83aa-49c2bb91f9db',
		'CSD.PAYPAL',
		NULL,
		NULL,
		NULL,
		NULL,
		'2025-10-02 13:50:51.617',
		'2025-10-02 13:50:51.617'
	),
	(
		'c9f134a5-3a72-42e1-b9fa-4f2b3b2b85a9',
		'FV.CSD',
		NULL,
		NULL,
		NULL,
		NULL,
		'2025-10-02 13:50:51.617',
		'2025-10-02 13:50:51.617'
	),
	(
		'2f8a5a4d-6c4e-4f90-8f64-94bde3acbd2d',
		'FV.PTP',
		NULL,
		NULL,
		NULL,
		NULL,
		'2025-10-02 13:50:51.617',
		'2025-10-02 13:50:51.617'
	),
	(
		'7f2e2b76-16e0-4e0c-83b7-91a924f1ef62',
		'CSD.PAYONEER',
		NULL,
		NULL,
		NULL,
		NULL,
		'2025-10-02 13:50:51.617',
		'2025-10-02 13:50:51.617'
	),
	(
		'a18d5a9b-d067-493f-a7d7-2fb6b31d54de',
		'CSD.ACB',
		NULL,
		NULL,
		NULL,
		NULL,
		'2025-10-02 13:50:51.617',
		'2025-10-02 13:50:51.617'
	),
	(
		'5b7d2d1f-2c9a-4f4b-a38d-7fbb3f0797d6',
		'CSD.BINANCE',
		NULL,
		NULL,
		NULL,
		NULL,
		'2025-10-02 13:50:51.617',
		'2025-10-02 13:50:51.617'
	);

-- DEPARTMENT
INSERT INTO
	public."Department" (
		id,
		"displayName",
		notes,
		code,
		"hexColor",
		"createdAt",
		"updatedAt"
	)
VALUES
	(
		'760a1ffa-2ce5-435c-b778-7a109b74e220',
		'Engineering',
		NULL,
		'engineering',
		'#fda53c',
		'2025-10-02 13:50:36.86',
		'2025-10-02 13:50:36.86'
	),
	(
		'5aac88f8-e4f7-47e2-a9ef-652c44116c8c',
		'Management',
		NULL,
		'management',
		'#f65333',
		'2025-10-02 13:50:36.86',
		'2025-10-02 13:50:36.86'
	),
	(
		'b92a66c3-a0e6-4b4c-a4c6-2759ea97a9c2',
		'Administration',
		NULL,
		'administration',
		'#3cb371',
		'2025-10-02 13:50:36.86',
		'2025-10-02 13:50:36.86'
	),
	(
		'e3551dd9-7be9-42f3-91e2-c826004b693d',
		'Sales & Marketing',
		NULL,
		'sales-and-marketing',
		'#ffd633',
		'2025-10-02 13:50:36.86',
		'2025-10-02 13:50:36.86'
	),
	(
		'09f4216e-e20c-4bf5-aa3e-3c65da7613eb',
		'Finance & Accounting',
		NULL,
		'finance-and-accounting',
		'#3b82f6',
		'2025-10-02 13:50:36.86',
		'2025-10-02 13:50:36.86'
	);

-- USER
INSERT INTO
	public."User" (
		id,
		email,
		username,
		"displayName",
		password,
		avatar,
		"departmentId",
		"phoneNumber",
		role,
		"isActive",
		"lastLoginAt",
		"createdAt",
		"updatedAt"
	)
VALUES
	(
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d',
		'pt.phong@cadsquad.vn',
		'pt.phong',
		'Phạm Tiền Phong',
		'cadsquad123',
		'https://ui-avatars.com/api/?name=Phong+Pham&background=random',
		'5aac88f8-e4f7-47e2-a9ef-652c44116c8c',
		'+1-555-0002',
		'ADMIN',
		true,
		NULL,
		'2025-10-02 13:50:48.827',
		'2025-10-02 13:50:48.827'
	),
	(
		'f77e8bb3-d633-46cb-a269-4e2f17e91173',
		'nc.hieu@cadsquad.vn',
		'nc.hieu',
		'Nguyễn Chí Hiếu',
		'cadsquad123',
		'https://ui-avatars.com/api/?name=Hieu+Nguyen&background=random',
		'760a1ffa-2ce5-435c-b778-7a109b74e220',
		'+1-555-0005',
		'USER',
		true,
		NULL,
		'2025-10-02 13:50:48.827',
		'2025-10-02 13:50:48.827'
	),
	(
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403',
		'lt.dat@cadsquad.vn',
		'lt.dat',
		'Lê Thành Đạt',
		'cadsquad123',
		'https://ui-avatars.com/api/?name=Dat+Le&background=random',
		'760a1ffa-2ce5-435c-b778-7a109b74e220',
		'+1-555-0004',
		'USER',
		true,
		NULL,
		'2025-10-02 13:50:48.827',
		'2025-10-02 13:50:48.827'
	),
	(
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65',
		'nkh.minh@cadsquad.vn',
		'nkh.minh',
		'Nguyễn Khoa Hải Minh',
		'cadsquad123',
		'https://ui-avatars.com/api/?name=Minh+Nguyen&background=random',
		'760a1ffa-2ce5-435c-b778-7a109b74e220',
		'+1-555-0006',
		'USER',
		true,
		NULL,
		'2025-10-02 13:50:48.827',
		'2025-10-02 13:50:48.827'
	),
	(
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24',
		'nb.vy@cadsquad.vn',
		'nb.vy',
		'Nguyễn Bảo Vy',
		'cadsquad123',
		'https://ui-avatars.com/api/?name=Vy+Nguyen&background=random',
		'09f4216e-e20c-4bf5-aa3e-3c65da7613eb',
		'+1-555-0007',
		'ACCOUNTING',
		true,
		NULL,
		'2025-10-02 13:50:48.827',
		'2025-10-02 13:50:48.827'
	),
	(
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290',
		'dc.son@cadsquad.vn',
		'dc.son',
		'Đặng Ngọc Sơn',
		'cadsquad123',
		'https://ui-avatars.com/api/?name=Son+Dang&background=random',
		'760a1ffa-2ce5-435c-b778-7a109b74e220',
		'+1-555-0003',
		'USER',
		true,
		NULL,
		'2025-10-02 13:50:48.827',
		'2025-10-02 13:50:48.827'
	),
	(
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70',
		'ch.duong@cadsquad.vn',
		'duong.cao',
		'Duong Cao',
		'$2b$10$/Ezt8NhLfQXPEh6G49qspOhOUaLIjzNh33ZHJeT84ruDMYU5hva1G',
		'https://ui-avatars.com/api/?name=Duong+Cao&background=random',
		'b92a66c3-a0e6-4b4c-a4c6-2759ea97a9c2',
		'0862248332',
		'ADMIN',
		true,
		NULL,
		'2025-10-02 13:50:48.827',
		'2025-10-03 05:01:21.19'
	);

-- Insert data into Config table
INSERT INTO
	public."Config" (
		id,
		"userId",
		"displayName",
		code,
		value,
		"createdAt",
		"updatedAt"
	)
VALUES
	(
		'282aa180-f72c-46f5-9e7e-e57ab8f8bde1',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70',
		'',
		'onboarding-activeTab-hide-finish-items',
		'1',
		'2025-10-03 03:19:25.895',
		'2025-10-03 03:19:25.931'
	);

-- Insert data into Job table (only complete records)
INSERT INTO
	public."Job" (
		id,
		no,
		"typeId",
		"displayName",
		description,
		"attachmentUrls",
		"clientName",
		"incomeCost",
		"staffCost",
		"createdById",
		"paymentChannelId",
		"statusId",
		"startedAt",
		priority,
		"isPinned",
		"isPublished",
		"isPaid",
		"dueAt",
		"completedAt",
		"createdAt",
		"updatedAt",
		"deletedAt"
	)
VALUES
	(
		'2f7430ea-7d7c-4c45-9eab-6596ab56004c',
		'XP-0001',
		'f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af',
		'Implementation of Transmission System',
		NULL,
		'{}',
		'Diana Wunsch',
		298,
		7862730,
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65',
		'5b7d2d1f-2c9a-4f4b-a38d-7fbb3f0797d6',
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'2025-10-02 13:51:02.555',
		'MEDIUM',
		false,
		false,
		false,
		'2025-11-17 13:51:02.534',
		NULL,
		'2025-10-02 13:51:02.555',
		'2025-10-02 13:51:02.555',
		NULL
	),
	(
		'9692699d-d52d-4fb6-bbeb-b2e923df7f43',
		'XP-0002',
		'f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af',
		'Maintenance of Turbine Blade',
		NULL,
		'{}',
		'Sarah Kertzmann',
		462,
		12189870,
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70',
		'5b7d2d1f-2c9a-4f4b-a38d-7fbb3f0797d6',
		'9b8dcb2c-f7cf-440f-95de-7c16bb4f34de',
		'2025-10-02 13:51:02.582',
		'MEDIUM',
		true,
		false,
		false,
		'2025-12-02 13:51:02.581',
		NULL,
		'2025-10-02 13:51:02.582',
		'2025-10-02 13:51:02.582',
		NULL
	),
	(
		'c124f6bf-1f37-4022-b4c3-b44a295446b9',
		'XP-0003',
		'f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af',
		'Development of Turbine Blade',
		NULL,
		'{}',
		'Mr. Edwin Wintheiser',
		591,
		15593535,
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403',
		'4e6c64c7-08fb-46df-83aa-49c2bb91f9db',
		'0fd0a749-48e4-4c89-9bbd-6f21542c11d3',
		'2025-10-02 13:51:02.603',
		'MEDIUM',
		false,
		false,
		false,
		'2025-11-15 13:51:02.602',
		NULL,
		'2025-10-02 13:51:02.603',
		'2025-10-02 13:51:02.603',
		NULL
	),
	(
		'1ed6a1c7-e0b2-4c11-801d-48bff0051477',
		'FV-0002',
		'2f9c6060-7f9b-42a5-b6fa-df3ac9627c42',
		'Upgrade of Boiler System',
		NULL,
		'{}',
		'Hubert Kuhic',
		252,
		6649020,
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70',
		'5b7d2d1f-2c9a-4f4b-a38d-7fbb3f0797d6',
		'9b8dcb2c-f7cf-440f-95de-7c16bb4f34de',
		'2025-10-02 13:51:02.612',
		'MEDIUM',
		true,
		false,
		false,
		'2025-10-22 13:51:02.612',
		NULL,
		'2025-10-02 13:51:02.612',
		'2025-10-02 13:51:02.612',
		NULL
	),
	(
		'90031892-9e80-4918-ac93-105171d8e745',
		'PCM-0001',
		'9c78d5e6-4f11-47d4-8cb3-dfe287d9b763',
		'Analysis of CNC Machine Tool',
		NULL,
		'{}',
		'Dora Runolfsdottir IV',
		752,
		19841520,
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290',
		'5b7d2d1f-2c9a-4f4b-a38d-7fbb3f0797d6',
		'0fd0a749-48e4-4c89-9bbd-6f21542c11d3',
		'2025-10-02 13:51:02.625',
		'MEDIUM',
		false,
		true,
		true,
		'2025-11-29 13:51:02.624',
		NULL,
		'2025-10-02 13:51:02.625',
		'2025-10-02 13:51:02.625',
		NULL
	),
	(
		'40aa2080-09bc-42b5-8f82-5844b6d4508e',
		'OTH-0001',
		'f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb',
		'Design of Piping Network',
		NULL,
		'{}',
		'Mrs. Valerie Kerluke',
		281,
		7414185,
		'f77e8bb3-d633-46cb-a269-4e2f17e91173',
		'c9f134a5-3a72-42e1-b9fa-4f2b3b2b85a9',
		'e5a8c177-8a69-4f9c-8f4d-bb7c2f43d11a',
		'2025-10-02 13:51:02.635',
		'MEDIUM',
		false,
		false,
		true,
		'2025-10-12 13:51:02.635',
		NULL,
		'2025-10-02 13:51:02.635',
		'2025-10-02 13:51:02.635',
		NULL
	),
	(
		'281c2aa4-1394-445f-92d4-3879011b0f16',
		'OTH-0002',
		'f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb',
		'Validation of Robotic Arm',
		NULL,
		'{}',
		'Harriet Lebsack-Bashirian',
		558,
		14722830,
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24',
		'a18d5a9b-d067-493f-a7d7-2fb6b31d54de',
		'9b8dcb2c-f7cf-440f-95de-7c16bb4f34de',
		'2025-10-02 13:51:02.644',
		'MEDIUM',
		true,
		false,
		true,
		'2025-11-21 13:51:02.643',
		NULL,
		'2025-10-02 13:51:02.644',
		'2025-10-02 13:51:02.644',
		NULL
	),
	(
		'f431aba5-89ef-4292-a067-44e59e7d2151',
		'XP-0004',
		'f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af',
		'Upgrade of HVAC System',
		NULL,
		'{}',
		'Lois Yost II',
		281,
		7414185,
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65',
		'7f2e2b76-16e0-4e0c-83b7-91a924f1ef62',
		'f6db8c15-94cb-47d4-9d73-3b72c0dd19a7',
		'2025-10-02 13:51:02.652',
		'MEDIUM',
		false,
		true,
		false,
		'2025-10-13 13:51:02.651',
		NULL,
		'2025-10-02 13:51:02.652',
		'2025-10-02 13:51:02.652',
		NULL
	),
	(
		'f6ebbeba-39f2-452d-9a41-17c4111587ec',
		'FV-0003',
		'2f9c6060-7f9b-42a5-b6fa-df3ac9627c42',
		'Validation of Bearing Analysis',
		NULL,
		'{}',
		'Dr. Ricardo Wintheiser',
		735,
		19392975,
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290',
		'c9f134a5-3a72-42e1-b9fa-4f2b3b2b85a9',
		'e5a8c177-8a69-4f9c-8f4d-bb7c2f43d11a',
		'2025-10-02 13:51:02.661',
		'MEDIUM',
		true,
		true,
		false,
		'2025-10-19 13:51:02.661',
		NULL,
		'2025-10-02 13:51:02.661',
		'2025-10-02 13:51:02.661',
		NULL
	),
	(
		'9b919327-14f8-453c-b593-1e76459b5617',
		'OTH-0003',
		'f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb',
		'Development of Vibration Damping System',
		NULL,
		'{}',
		'Noel Boyer',
		731,
		19287435,
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d',
		'4e6c64c7-08fb-46df-83aa-49c2bb91f9db',
		'0fd0a749-48e4-4c89-9bbd-6f21542c11d3',
		'2025-10-02 13:51:02.67',
		'MEDIUM',
		false,
		false,
		true,
		'2025-10-30 13:51:02.67',
		NULL,
		'2025-10-02 13:51:02.67',
		'2025-10-02 13:51:02.67',
		NULL
	),
	(
		'fbd32a19-855c-4ccb-ab5b-9eb340447e59',
		'PCM-0002',
		'9c78d5e6-4f11-47d4-8cb3-dfe287d9b763',
		'Integration of Boiler System',
		NULL,
		'{}',
		'Kim Jakubowski',
		929,
		24511665,
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24',
		'2f8a5a4d-6c4e-4f90-8f64-94bde3acbd2d',
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'2025-10-02 13:51:02.68',
		'MEDIUM',
		true,
		true,
		true,
		'2025-11-08 13:51:02.679',
		NULL,
		'2025-10-02 13:51:02.68',
		'2025-10-02 13:51:02.68',
		NULL
	),
	(
		'9cb57861-33d3-4bc7-93fd-7e2a06a49971',
		'FV-0004',
		'2f9c6060-7f9b-42a5-b6fa-df3ac9627c42',
		'Optimization of Clutch Mechanism',
		NULL,
		'{}',
		'Noel Shields-Marquardt',
		300,
		7915500,
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290',
		'2f8a5a4d-6c4e-4f90-8f64-94bde3acbd2d',
		'e5a8c177-8a69-4f9c-8f4d-bb7c2f43d11a',
		'2025-10-02 13:51:02.689',
		'MEDIUM',
		false,
		true,
		false,
		'2025-11-15 13:51:02.689',
		NULL,
		'2025-10-02 13:51:02.689',
		'2025-10-02 13:51:02.689',
		NULL
	),
	(
		'13291fba-7190-455e-9c6a-66fc30f98480',
		'PCM-0003',
		'9c78d5e6-4f11-47d4-8cb3-dfe287d9b763',
		'Analysis of Turbine Blade',
		NULL,
		'{}',
		'David Senger',
		223,
		5883855,
		'f77e8bb3-d633-46cb-a269-4e2f17e91173',
		'2f8a5a4d-6c4e-4f90-8f64-94bde3acbd2d',
		'0fd0a749-48e4-4c89-9bbd-6f21542c11d3',
		'2025-10-02 13:51:02.698',
		'MEDIUM',
		false,
		false,
		false,
		'2025-11-25 13:51:02.697',
		NULL,
		'2025-10-02 13:51:02.698',
		'2025-10-02 13:51:02.698',
		NULL
	),
	(
		'00207423-3d6a-48f4-91a1-b9aed7d00bd3',
		'XP-0005',
		'f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af',
		'Maintenance of HVAC System',
		NULL,
		'{}',
		'Ms. Vickie Braun',
		289,
		7625265,
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70',
		'a18d5a9b-d067-493f-a7d7-2fb6b31d54de',
		'e5a8c177-8a69-4f9c-8f4d-bb7c2f43d11a',
		'2025-10-02 13:51:02.707',
		'MEDIUM',
		false,
		false,
		false,
		'2025-11-19 13:51:02.707',
		NULL,
		'2025-10-02 13:51:02.707',
		'2025-10-02 13:51:02.707',
		NULL
	),
	(
		'972dab06-84fe-4686-a6e0-ce5c7f7b7704',
		'OTH-0004',
		'f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb',
		'Optimization of Valve Control System',
		NULL,
		'{}',
		'Mr. Edmund Hackett',
		123,
		3245355,
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403',
		'a18d5a9b-d067-493f-a7d7-2fb6b31d54de',
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'2025-10-02 13:51:02.717',
		'MEDIUM',
		true,
		false,
		false,
		'2025-10-09 13:51:02.716',
		NULL,
		'2025-10-02 13:51:02.717',
		'2025-10-02 13:51:02.717',
		NULL
	),
	(
		'dbc15d37-5d55-4597-adae-77cd170c255b',
		'PCM-0004',
		'9c78d5e6-4f11-47d4-8cb3-dfe287d9b763',
		'Design of Clutch Mechanism',
		NULL,
		'{}',
		'Dr. Colleen Corwin',
		395,
		10422075,
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290',
		'5b7d2d1f-2c9a-4f4b-a38d-7fbb3f0797d6',
		'9b8dcb2c-f7cf-440f-95de-7c16bb4f34de',
		'2025-10-02 13:51:02.725',
		'MEDIUM',
		false,
		false,
		true,
		'2025-10-31 13:51:02.725',
		NULL,
		'2025-10-02 13:51:02.725',
		'2025-10-02 13:51:02.725',
		NULL
	),
	(
		'19180537-95fa-4a0a-8e06-138d0de899e5',
		'OTH-0005',
		'f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb',
		'Maintenance of Clutch Mechanism',
		NULL,
		'{}',
		'Rex Rath-Wyman',
		822,
		21688470,
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d',
		'5b7d2d1f-2c9a-4f4b-a38d-7fbb3f0797d6',
		'9b8dcb2c-f7cf-440f-95de-7c16bb4f34de',
		'2025-10-02 13:51:02.733',
		'MEDIUM',
		true,
		false,
		false,
		'2025-12-09 13:51:02.733',
		NULL,
		'2025-10-02 13:51:02.733',
		'2025-10-02 13:51:02.733',
		NULL
	),
	(
		'f4496740-e546-4c01-b4c8-9243a720f08a',
		'FV-0005',
		'2f9c6060-7f9b-42a5-b6fa-df3ac9627c42',
		'Redesign of Centrifugal Fan',
		NULL,
		'{}',
		'Mr. Tracy Bauch',
		648,
		17097480,
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d',
		'c9f134a5-3a72-42e1-b9fa-4f2b3b2b85a9',
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'2025-10-02 13:51:02.743',
		'MEDIUM',
		false,
		false,
		false,
		'2025-10-15 13:51:02.742',
		NULL,
		'2025-10-02 13:51:02.743',
		'2025-10-02 13:51:02.743',
		NULL
	),
	(
		'8b84a09c-ddeb-446f-ad33-a2f5e8cd4ca3',
		'PCM-0005',
		'9c78d5e6-4f11-47d4-8cb3-dfe287d9b763',
		'Redesign of Cooling Tower',
		NULL,
		'{}',
		'Oscar Nienow',
		414,
		10923390,
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403',
		'4e6c64c7-08fb-46df-83aa-49c2bb91f9db',
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'2025-10-02 13:51:02.755',
		'MEDIUM',
		true,
		true,
		true,
		'2025-11-06 13:51:02.755',
		NULL,
		'2025-10-02 13:51:02.755',
		'2025-10-02 13:51:02.755',
		NULL
	),
	(
		'b2ef1b56-4376-482b-8764-d03c1f492ebd',
		'FV-0006',
		'2f9c6060-7f9b-42a5-b6fa-df3ac9627c42',
		'Implementation of Steam Turbine',
		NULL,
		'{}',
		'Sophie Satterfield',
		627,
		16543395,
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70',
		'2f8a5a4d-6c4e-4f90-8f64-94bde3acbd2d',
		'f6db8c15-94cb-47d4-9d73-3b72c0dd19a7',
		'2025-10-02 13:51:02.764',
		'MEDIUM',
		true,
		false,
		false,
		'2025-11-23 13:51:02.763',
		NULL,
		'2025-10-02 13:51:02.764',
		'2025-10-02 13:51:02.764',
		NULL
	),
	(
		'2848502f-ac24-44af-861f-596b30c7e768',
		'OTH-0006',
		'f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb',
		'Analysis of Cooling Tower',
		NULL,
		'{}',
		'Mr. Wayne Pacocha',
		784,
		20685840,
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d',
		'7f2e2b76-16e0-4e0c-83b7-91a924f1ef62',
		'9b8dcb2c-f7cf-440f-95de-7c16bb4f34de',
		'2025-10-02 13:51:02.772',
		'MEDIUM',
		true,
		true,
		true,
		'2025-10-11 13:51:02.771',
		NULL,
		'2025-10-02 13:51:02.772',
		'2025-10-02 13:51:02.772',
		NULL
	),
	(
		'ff360411-3683-4ec1-9f76-883ee14da05d',
		'PCM-0006',
		'9c78d5e6-4f11-47d4-8cb3-dfe287d9b763',
		'Implementation of Turbine Blade',
		NULL,
		'{}',
		'Arturo Collins',
		845,
		22295325,
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403',
		'2f8a5a4d-6c4e-4f90-8f64-94bde3acbd2d',
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'2025-10-02 13:51:02.783',
		'MEDIUM',
		true,
		true,
		true,
		'2025-12-08 13:51:02.782',
		NULL,
		'2025-10-02 13:51:02.783',
		'2025-10-02 13:51:02.783',
		NULL
	),
	(
		'5158c40d-f997-493f-93f2-50cbc50bde3b',
		'XP-0006',
		'f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af',
		'Simulation of Centrifugal Fan',
		NULL,
		'{}',
		'Rosemary Mills-Sanford',
		452,
		11926020,
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d',
		'c9f134a5-3a72-42e1-b9fa-4f2b3b2b85a9',
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'2025-10-02 13:51:02.793',
		'MEDIUM',
		false,
		false,
		true,
		'2025-10-15 13:51:02.792',
		NULL,
		'2025-10-02 13:51:02.793',
		'2025-10-02 13:51:02.793',
		NULL
	),
	(
		'89a00274-abde-40f9-93fd-8cf3dfd701f8',
		'OTH-0007',
		'f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb',
		'Integration of Brake System',
		NULL,
		'{}',
		'Sylvester Marquardt',
		207,
		5461695,
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70',
		'7f2e2b76-16e0-4e0c-83b7-91a924f1ef62',
		'9b8dcb2c-f7cf-440f-95de-7c16bb4f34de',
		'2025-10-02 13:51:02.804',
		'MEDIUM',
		true,
		true,
		false,
		'2025-11-07 13:51:02.804',
		NULL,
		'2025-10-02 13:51:02.804',
		'2025-10-02 13:51:02.804',
		NULL
	),
	(
		'ee22c5cc-9e05-4dcd-9ffb-3c17b7b01e89',
		'XP-0007',
		'f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af',
		'Inspection of Valve Control System',
		NULL,
		'{}',
		'Priscilla Gleichner',
		411,
		10844235,
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403',
		'7f2e2b76-16e0-4e0c-83b7-91a924f1ef62',
		'0fd0a749-48e4-4c89-9bbd-6f21542c11d3',
		'2025-10-02 13:51:02.816',
		'MEDIUM',
		false,
		false,
		false,
		'2025-11-22 13:51:02.816',
		NULL,
		'2025-10-02 13:51:02.816',
		'2025-10-02 13:51:02.816',
		NULL
	),
	(
		'81954bc4-20b4-4857-a1a0-38b1dd58ebf2',
		'FV-0007',
		'2f9c6060-7f9b-42a5-b6fa-df3ac9627c42',
		'Redesign of Flywheel Design',
		NULL,
		'{}',
		'Carlos Prohaska',
		972,
		25646220,
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65',
		'4e6c64c7-08fb-46df-83aa-49c2bb91f9db',
		'9b8dcb2c-f7cf-440f-95de-7c16bb4f34de',
		'2025-10-02 13:51:02.826',
		'MEDIUM',
		false,
		true,
		false,
		'2025-11-16 13:51:02.825',
		NULL,
		'2025-10-02 13:51:02.826',
		'2025-10-02 13:51:02.826',
		NULL
	),
	(
		'541a706e-d9c0-4b50-aeb4-4333c8b45a98',
		'OTH-0008',
		'f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb',
		'Installation of Bearing Analysis',
		NULL,
		'{}',
		'Horace Dietrich',
		374,
		9867990,
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290',
		'a18d5a9b-d067-493f-a7d7-2fb6b31d54de',
		'e5a8c177-8a69-4f9c-8f4d-bb7c2f43d11a',
		'2025-10-02 13:51:02.836',
		'MEDIUM',
		false,
		true,
		true,
		'2025-10-10 13:51:02.836',
		NULL,
		'2025-10-02 13:51:02.836',
		'2025-10-02 13:51:02.836',
		NULL
	),
	(
		'611f5ba1-f88a-47bb-a26d-7a088be3242d',
		'FV-0008',
		'2f9c6060-7f9b-42a5-b6fa-df3ac9627c42',
		'Installation of Steam Turbine',
		NULL,
		'{}',
		'Carlos Zulauf',
		705,
		18601425,
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403',
		'7f2e2b76-16e0-4e0c-83b7-91a924f1ef62',
		'e5a8c177-8a69-4f9c-8f4d-bb7c2f43d11a',
		'2025-10-02 13:51:02.846',
		'MEDIUM',
		false,
		true,
		false,
		'2025-11-28 13:51:02.845',
		NULL,
		'2025-10-02 13:51:02.846',
		'2025-10-02 13:51:02.846',
		NULL
	),
	(
		'99d1042a-345e-4cb7-97f0-2223b244bd60',
		'XP-0008',
		'f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af',
		'Testing of Clutch Mechanism',
		NULL,
		'{}',
		'Armando Schroeder-Emmerich',
		133,
		3509205,
		'f77e8bb3-d633-46cb-a269-4e2f17e91173',
		'4e6c64c7-08fb-46df-83aa-49c2bb91f9db',
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'2025-10-02 13:51:02.854',
		'MEDIUM',
		true,
		true,
		false,
		'2025-11-29 13:51:02.853',
		NULL,
		'2025-10-02 13:51:02.854',
		'2025-10-02 13:51:02.854',
		NULL
	),
	(
		'219b0a9c-f057-4b07-9bc1-3892edeb767e',
		'PCM-0007',
		'9c78d5e6-4f11-47d4-8cb3-dfe287d9b763',
		'Upgrade of Shaft Design',
		NULL,
		'{}',
		'Neil Conroy',
		900,
		23746500,
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24',
		'2f8a5a4d-6c4e-4f90-8f64-94bde3acbd2d',
		'f6db8c15-94cb-47d4-9d73-3b72c0dd19a7',
		'2025-10-02 13:51:02.863',
		'MEDIUM',
		true,
		true,
		true,
		'2025-12-02 13:51:02.862',
		NULL,
		'2025-10-02 13:51:02.863',
		'2025-10-02 13:51:02.863',
		NULL
	),
	(
		'266e13dd-c46d-4cd9-b5fc-386e556cc111',
		'XP-0009',
		'f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af',
		'Maintenance of Pump Station',
		NULL,
		'{}',
		'Jeanette Walsh-Heaney',
		379,
		9999915,
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24',
		'c9f134a5-3a72-42e1-b9fa-4f2b3b2b85a9',
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'2025-10-02 13:51:02.87',
		'MEDIUM',
		true,
		false,
		true,
		'2025-12-10 13:51:02.87',
		NULL,
		'2025-10-02 13:51:02.87',
		'2025-10-02 13:51:02.87',
		NULL
	),
	(
		'1a27dce1-b29b-4a08-b2e8-d95531e53cd0',
		'PCM-0008',
		'9c78d5e6-4f11-47d4-8cb3-dfe287d9b763',
		'Simulation of Clutch Mechanism',
		NULL,
		'{}',
		'Brandi Konopelski',
		148,
		3904980,
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70',
		'2f8a5a4d-6c4e-4f90-8f64-94bde3acbd2d',
		'f6db8c15-94cb-47d4-9d73-3b72c0dd19a7',
		'2025-10-02 13:51:02.879',
		'MEDIUM',
		true,
		false,
		true,
		'2025-10-21 13:51:02.878',
		NULL,
		'2025-10-02 13:51:02.879',
		'2025-10-02 13:51:02.879',
		NULL
	),
	(
		'a7204b59-d1e3-4af3-aa19-6e54e376f864',
		'FV-0009',
		'2f9c6060-7f9b-42a5-b6fa-df3ac9627c42',
		'Analysis of Transmission System',
		NULL,
		'{}',
		'Brent Champlin',
		975,
		25725375,
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290',
		'c9f134a5-3a72-42e1-b9fa-4f2b3b2b85a9',
		'3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8',
		'2025-10-02 13:51:02.887',
		'MEDIUM',
		false,
		false,
		true,
		'2025-12-02 13:51:02.887',
		NULL,
		'2025-10-02 13:51:02.887',
		'2025-10-02 13:51:02.887',
		NULL
	);

-- Insert data into _UserJobs table
INSERT INTO
	public."_UserJobs" ("A", "B")
VALUES
	(
		'2f7430ea-7d7c-4c45-9eab-6596ab56004c',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'2f7430ea-7d7c-4c45-9eab-6596ab56004c',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'2f7430ea-7d7c-4c45-9eab-6596ab56004c',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'2f7430ea-7d7c-4c45-9eab-6596ab56004c',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'2f7430ea-7d7c-4c45-9eab-6596ab56004c',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'2f7430ea-7d7c-4c45-9eab-6596ab56004c',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'2f7430ea-7d7c-4c45-9eab-6596ab56004c',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'9692699d-d52d-4fb6-bbeb-b2e923df7f43',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'9692699d-d52d-4fb6-bbeb-b2e923df7f43',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'9692699d-d52d-4fb6-bbeb-b2e923df7f43',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'9692699d-d52d-4fb6-bbeb-b2e923df7f43',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'9692699d-d52d-4fb6-bbeb-b2e923df7f43',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'9692699d-d52d-4fb6-bbeb-b2e923df7f43',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'9692699d-d52d-4fb6-bbeb-b2e923df7f43',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'c124f6bf-1f37-4022-b4c3-b44a295446b9',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'c124f6bf-1f37-4022-b4c3-b44a295446b9',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'c124f6bf-1f37-4022-b4c3-b44a295446b9',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'c124f6bf-1f37-4022-b4c3-b44a295446b9',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'c124f6bf-1f37-4022-b4c3-b44a295446b9',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'c124f6bf-1f37-4022-b4c3-b44a295446b9',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'c124f6bf-1f37-4022-b4c3-b44a295446b9',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'1ed6a1c7-e0b2-4c11-801d-48bff0051477',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'1ed6a1c7-e0b2-4c11-801d-48bff0051477',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'1ed6a1c7-e0b2-4c11-801d-48bff0051477',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'1ed6a1c7-e0b2-4c11-801d-48bff0051477',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'1ed6a1c7-e0b2-4c11-801d-48bff0051477',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'1ed6a1c7-e0b2-4c11-801d-48bff0051477',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'1ed6a1c7-e0b2-4c11-801d-48bff0051477',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'90031892-9e80-4918-ac93-105171d8e745',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'90031892-9e80-4918-ac93-105171d8e745',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'90031892-9e80-4918-ac93-105171d8e745',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'90031892-9e80-4918-ac93-105171d8e745',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'90031892-9e80-4918-ac93-105171d8e745',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'90031892-9e80-4918-ac93-105171d8e745',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'90031892-9e80-4918-ac93-105171d8e745',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'40aa2080-09bc-42b5-8f82-5844b6d4508e',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'40aa2080-09bc-42b5-8f82-5844b6d4508e',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'40aa2080-09bc-42b5-8f82-5844b6d4508e',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'40aa2080-09bc-42b5-8f82-5844b6d4508e',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'40aa2080-09bc-42b5-8f82-5844b6d4508e',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'281c2aa4-1394-445f-92d4-3879011b0f16',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'281c2aa4-1394-445f-92d4-3879011b0f16',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'281c2aa4-1394-445f-92d4-3879011b0f16',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'281c2aa4-1394-445f-92d4-3879011b0f16',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'281c2aa4-1394-445f-92d4-3879011b0f16',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'281c2aa4-1394-445f-92d4-3879011b0f16',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'281c2aa4-1394-445f-92d4-3879011b0f16',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'f431aba5-89ef-4292-a067-44e59e7d2151',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'f431aba5-89ef-4292-a067-44e59e7d2151',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'f431aba5-89ef-4292-a067-44e59e7d2151',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'f431aba5-89ef-4292-a067-44e59e7d2151',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'f431aba5-89ef-4292-a067-44e59e7d2151',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'f431aba5-89ef-4292-a067-44e59e7d2151',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'f431aba5-89ef-4292-a067-44e59e7d2151',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'f6ebbeba-39f2-452d-9a41-17c4111587ec',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'f6ebbeba-39f2-452d-9a41-17c4111587ec',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'f6ebbeba-39f2-452d-9a41-17c4111587ec',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'f6ebbeba-39f2-452d-9a41-17c4111587ec',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'f6ebbeba-39f2-452d-9a41-17c4111587ec',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'f6ebbeba-39f2-452d-9a41-17c4111587ec',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'f6ebbeba-39f2-452d-9a41-17c4111587ec',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'9b919327-14f8-453c-b593-1e76459b5617',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'9b919327-14f8-453c-b593-1e76459b5617',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'9b919327-14f8-453c-b593-1e76459b5617',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'9b919327-14f8-453c-b593-1e76459b5617',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'9b919327-14f8-453c-b593-1e76459b5617',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'9b919327-14f8-453c-b593-1e76459b5617',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'9b919327-14f8-453c-b593-1e76459b5617',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'fbd32a19-855c-4ccb-ab5b-9eb340447e59',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'fbd32a19-855c-4ccb-ab5b-9eb340447e59',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'fbd32a19-855c-4ccb-ab5b-9eb340447e59',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'fbd32a19-855c-4ccb-ab5b-9eb340447e59',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'fbd32a19-855c-4ccb-ab5b-9eb340447e59',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'fbd32a19-855c-4ccb-ab5b-9eb340447e59',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'fbd32a19-855c-4ccb-ab5b-9eb340447e59',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'9cb57861-33d3-4bc7-93fd-7e2a06a49971',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'9cb57861-33d3-4bc7-93fd-7e2a06a49971',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'9cb57861-33d3-4bc7-93fd-7e2a06a49971',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'9cb57861-33d3-4bc7-93fd-7e2a06a49971',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'9cb57861-33d3-4bc7-93fd-7e2a06a49971',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'9cb57861-33d3-4bc7-93fd-7e2a06a49971',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'9cb57861-33d3-4bc7-93fd-7e2a06a49971',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'13291fba-7190-455e-9c6a-66fc30f98480',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'13291fba-7190-455e-9c6a-66fc30f98480',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'13291fba-7190-455e-9c6a-66fc30f98480',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'13291fba-7190-455e-9c6a-66fc30f98480',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'13291fba-7190-455e-9c6a-66fc30f98480',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'13291fba-7190-455e-9c6a-66fc30f98480',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'13291fba-7190-455e-9c6a-66fc30f98480',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'00207423-3d6a-48f4-91a1-b9aed7d00bd3',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'00207423-3d6a-48f4-91a1-b9aed7d00bd3',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'00207423-3d6a-48f4-91a1-b9aed7d00bd3',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	),
	(
		'00207423-3d6a-48f4-91a1-b9aed7d00bd3',
		'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65'
	),
	(
		'00207423-3d6a-48f4-91a1-b9aed7d00bd3',
		'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24'
	),
	(
		'00207423-3d6a-48f4-91a1-b9aed7d00bd3',
		'2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70'
	),
	(
		'00207423-3d6a-48f4-91a1-b9aed7d00bd3',
		'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290'
	),
	(
		'972dab06-84fe-4686-a6e0-ce5c7f7b7704',
		'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d'
	),
	(
		'972dab06-84fe-4686-a6e0-ce5c7f7b7704',
		'f77e8bb3-d633-46cb-a269-4e2f17e91173'
	),
	(
		'972dab06-84fe-4686-a6e0-ce5c7f7b7704',
		'e3f41716-3f91-4e6c-8f4c-2df89a9cf403'
	)