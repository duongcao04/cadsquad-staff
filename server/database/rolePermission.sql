-- rolePermission.sql (Keep existing, Fill missing)

-- ==============================================================================================
-- 1. INSERT ROLES
-- Strategy: Use fixed UUIDs. If role exists (by code), DO NOTHING (Preserve DB state).
-- ==============================================================================================
INSERT INTO "Role" ("id", "displayName", "code", "hexColor") VALUES 
('role-0000-0000-0000-0000-000000000001', 'Administrator', 'admin',      '#ef4444'),
('role-0000-0000-0000-0000-000000000002', 'Staff',         'staff',      '#3b82f6'),
('role-0000-0000-0000-0000-000000000003', 'Accountant',    'accounting', '#10b981')
ON CONFLICT ("code") DO NOTHING;


-- ==============================================================================================
-- 2. INSERT PERMISSION GROUPS
-- Strategy: If group exists, DO NOTHING.
-- ==============================================================================================
INSERT INTO "PermissionGroup" ("id", "displayName", "code", "order", "updatedAt") VALUES 
('group-0000-0000-0000-0000-000000000001', 'Recruitment Management', 'GROUP_RECRUITMENT', 1, NOW()),
('group-0000-0000-0000-0000-000000000002', 'Staff Management',       'GROUP_STAFF',       2, NOW()),
('group-0000-0000-0000-0000-000000000003', 'Finance & CRM',          'GROUP_FINANCE',     3, NOW()),
('group-0000-0000-0000-0000-000000000004', 'Community & Social',     'GROUP_SOCIAL',      4, NOW()),
('group-0000-0000-0000-0000-000000000005', 'System Settings',        'GROUP_SYSTEM',      99, NOW())
ON CONFLICT ("code") DO NOTHING;


-- ==============================================================================================
-- 3. INSERT PERMISSIONS
-- Strategy: Identify by 'entityAction' (e.g., job.read). If exists, DO NOTHING.
-- ==============================================================================================
INSERT INTO "Permission" ("id", "displayName", "code", "entity", "action", "entityAction", "permissionGroupId", "description") VALUES 

-- === GROUP 1: RECRUITMENT (Jobs) ===
(gen_random_uuid(), 'View Jobs',               'JOB_READ',                'JOB'::"EntityEnum", 'read',          'job.read',          'group-0000-0000-0000-0000-000000000001', 'View jobs assigned'),
(gen_random_uuid(), 'View All Jobs',           'JOB_READ_ALL',            'JOB'::"EntityEnum", 'readAll',       'job.readAll',       'group-0000-0000-0000-0000-000000000001', 'View all jobs (assigned & unassigned)'),
(gen_random_uuid(), 'View Sensitive Data',     'JOB_READ_SENSITIVE',      'JOB'::"EntityEnum", 'readSensitive', 'job.readSensitive', 'group-0000-0000-0000-0000-000000000001', 'View salary/cost info'),
(gen_random_uuid(), 'Create Jobs',             'JOB_CREATE',              'JOB'::"EntityEnum", 'create',        'job.create',        'group-0000-0000-0000-0000-000000000001', 'Create new jobs'),
(gen_random_uuid(), 'Update Jobs',             'JOB_UPDATE',              'JOB'::"EntityEnum", 'update',        'job.update',        'group-0000-0000-0000-0000-000000000001', 'Update job details'),
(gen_random_uuid(), 'Delete Jobs',             'JOB_DELETE',              'JOB'::"EntityEnum", 'delete',        'job.delete',        'group-0000-0000-0000-0000-000000000001', 'Delete jobs'),
(gen_random_uuid(), 'Publish Jobs',            'JOB_PUBLISH',             'JOB'::"EntityEnum", 'publish',       'job.publish',       'group-0000-0000-0000-0000-000000000001', 'Publish jobs to public'),
(gen_random_uuid(), 'Deliver Jobs',            'JOB_DELIVER',             'JOB'::"EntityEnum", 'deliver',       'job.deliver',       'group-0000-0000-0000-0000-000000000001', 'Submit deliverables'),
(gen_random_uuid(), 'Mark Paid',               'JOB_PAID',                'JOB'::"EntityEnum", 'paid',          'job.paid',          'group-0000-0000-0000-0000-000000000001', 'Mark job as paid'),
(gen_random_uuid(), 'Review Jobs',             'JOB_REVIEW',              'JOB'::"EntityEnum", 'review',        'job.review',        'group-0000-0000-0000-0000-000000000001', 'Approve/Reject deliverables'),
(gen_random_uuid(), 'Assign Member',           'JOB_ASSIGN_MEMBER',       'JOB'::"EntityEnum", 'assignMember',  'job.assignMember',  'group-0000-0000-0000-0000-000000000001', 'Assign staff to jobs'),

-- === GROUP 2: STAFF MANAGEMENT (Users) ===
(gen_random_uuid(), 'View Users',              'USER_READ',               'USER'::"EntityEnum", 'read',          'user.read',          'group-0000-0000-0000-0000-000000000002', 'View staff list'),
(gen_random_uuid(), 'Create Users',            'USER_CREATE',             'USER'::"EntityEnum", 'create',        'user.create',        'group-0000-0000-0000-0000-000000000002', 'Invite new staff'),
(gen_random_uuid(), 'Update Users',            'USER_UPDATE',             'USER'::"EntityEnum", 'update',        'user.update',        'group-0000-0000-0000-0000-000000000002', 'Update staff profiles'),
(gen_random_uuid(), 'Delete Users',            'USER_DELETE',             'USER'::"EntityEnum", 'delete',        'user.delete',        'group-0000-0000-0000-0000-000000000002', 'Remove staff'),
(gen_random_uuid(), 'Reset Password',          'USER_RESET_PASSWORD',     'USER'::"EntityEnum", 'resetPassword', 'user.resetPassword', 'group-0000-0000-0000-0000-000000000002', 'Force reset password'),
(gen_random_uuid(), 'Block User',              'USER_BLOCK',              'USER'::"EntityEnum", 'block',         'user.block',         'group-0000-0000-0000-0000-000000000002', 'Block/Ban user access'),


-- === GROUP: ANALYSIS ===
(gen_random_uuid(), 'Read Analysis',            'ANALYTICS_READ',             'ANALYTICS'::"EntityEnum", 'read',        'analytics.read',        'group-0000-0000-0000-0000-000000000003', 'Read Analysis'),
(gen_random_uuid(), 'Report Analysis',            'ANALYTICS_REPORT',             'ANALYTICS'::"EntityEnum", 'report',        'analytics.report',        'group-0000-0000-0000-0000-000000000003', 'Report Analysis'),
-- === GROUP 3: FINANCE & CRM ===
(gen_random_uuid(), 'View Clients',            'CLIENT_READ',             'CLIENT'::"EntityEnum", 'read',        'client.read',        'group-0000-0000-0000-0000-000000000003', 'View clients'),
(gen_random_uuid(), 'Manage Clients',          'CLIENT_WRITE',            'CLIENT'::"EntityEnum", 'write',       'client.write',       'group-0000-0000-0000-0000-000000000003', 'Create/Edit clients'),

-- Payment Channels (Granular)
(gen_random_uuid(), 'View Payment Channels',   'PAY_READ',                'PAYMENT_CHANNEL'::"EntityEnum", 'read',      'payment.read',      'group-0000-0000-0000-0000-000000000003', 'View available payment methods'),
(gen_random_uuid(), 'View All Payments',       'PAY_READ_ALL',            'PAYMENT_CHANNEL'::"EntityEnum", 'readAll',   'payment.readAll',   'group-0000-0000-0000-0000-000000000003', 'View all payment details including sensitive info'),
(gen_random_uuid(), 'Create Payment Channel',  'PAY_CREATE',              'PAYMENT_CHANNEL'::"EntityEnum", 'create',    'payment.create',    'group-0000-0000-0000-0000-000000000003', 'Create new payment channel'),
(gen_random_uuid(), 'Update Payment Channel',  'PAY_UPDATE',              'PAYMENT_CHANNEL'::"EntityEnum", 'update',    'payment.update',    'group-0000-0000-0000-0000-000000000003', 'Update payment channel details'),
(gen_random_uuid(), 'Delete Payment Channel',  'PAY_DELETE',              'PAYMENT_CHANNEL'::"EntityEnum", 'delete',    'payment.delete',    'group-0000-0000-0000-0000-000000000003', 'Delete payment channel'),

-- === GROUP 4: COMMUNITY & SOCIAL ===
(gen_random_uuid(), 'View Community',          'COMM_READ',               'COMMUNITY'::"EntityEnum", 'read',     'community.read',     'group-0000-0000-0000-0000-000000000004', 'View communities'),
(gen_random_uuid(), 'Create Community',        'COMM_CREATE',             'COMMUNITY'::"EntityEnum", 'create',   'community.create',   'group-0000-0000-0000-0000-000000000004', 'Create communities'),
(gen_random_uuid(), 'Create Post',             'POST_CREATE',             'POST'::"EntityEnum",      'create',   'post.create',        'group-0000-0000-0000-0000-000000000004', 'Create posts'),

-- === GROUP 5: SYSTEM SETTINGS ===
-- Files & Configs
(gen_random_uuid(), 'View Files',              'FILE_READ',               'FILE'::"EntityEnum",      'read',     'file.read',          'group-0000-0000-0000-0000-000000000005', 'View files'),
(gen_random_uuid(), 'Upload Files',            'FILE_WRITE',              'FILE'::"EntityEnum",      'write',    'file.write',         'group-0000-0000-0000-0000-000000000005', 'Upload files'),
(gen_random_uuid(), 'System Config',           'SYS_MANAGE',              'SYSTEM'::"EntityEnum",    'manage',   'system.manage',      'group-0000-0000-0000-0000-000000000005', 'Manage configs'),

-- Departments
(gen_random_uuid(), 'View Departments',        'DEPT_READ',               'DEPARTMENT'::"EntityEnum", 'read',    'department.read',    'group-0000-0000-0000-0000-000000000005', 'View departments'),
(gen_random_uuid(), 'Create Department',       'DEPT_CREATE',             'DEPARTMENT'::"EntityEnum", 'create',  'department.create',  'group-0000-0000-0000-0000-000000000005', 'Create departments'),
(gen_random_uuid(), 'Update Department',       'DEPT_UPDATE',             'DEPARTMENT'::"EntityEnum", 'update',  'department.update',  'group-0000-0000-0000-0000-000000000005', 'Update departments'),
(gen_random_uuid(), 'Delete Department',       'DEPT_DELETE',             'DEPARTMENT'::"EntityEnum", 'delete',  'department.delete',  'group-0000-0000-0000-0000-000000000005', 'Delete departments'),

-- Job Titles
(gen_random_uuid(), 'View Job Titles',         'TITLE_READ',              'JOB_TITLE'::"EntityEnum", 'read',     'jobTitle.read',      'group-0000-0000-0000-0000-000000000005', 'View job titles'),
(gen_random_uuid(), 'Create Job Title',        'TITLE_CREATE',            'JOB_TITLE'::"EntityEnum", 'create',   'jobTitle.create',    'group-0000-0000-0000-0000-000000000005', 'Create job titles'),
(gen_random_uuid(), 'Update Job Title',        'TITLE_UPDATE',            'JOB_TITLE'::"EntityEnum", 'update',   'jobTitle.update',    'group-0000-0000-0000-0000-000000000005', 'Update job titles'),
(gen_random_uuid(), 'Delete Job Title',        'TITLE_DELETE',            'JOB_TITLE'::"EntityEnum", 'delete',   'jobTitle.delete',    'group-0000-0000-0000-0000-000000000005', 'Delete job titles'),

-- Job Types
(gen_random_uuid(), 'View Job Types',          'JOB_TYPE_READ',           'JOB_TYPE'::"EntityEnum",  'read',     'jobType.read',       'group-0000-0000-0000-0000-000000000005', 'View job types'),
(gen_random_uuid(), 'Create Job Type',         'JOB_TYPE_CREATE',         'JOB_TYPE'::"EntityEnum",  'create',   'jobType.create',     'group-0000-0000-0000-0000-000000000005', 'Create job types'),
(gen_random_uuid(), 'Update Job Type',         'JOB_TYPE_UPDATE',         'JOB_TYPE'::"EntityEnum",  'update',   'jobType.update',     'group-0000-0000-0000-0000-000000000005', 'Update job types'),
(gen_random_uuid(), 'Delete Job Type',         'JOB_TYPE_DELETE',         'JOB_TYPE'::"EntityEnum",  'delete',   'jobType.delete',     'group-0000-0000-0000-0000-000000000005', 'Delete job types'),

-- Job Statuses
(gen_random_uuid(), 'View Job Statuses',       'STATUS_READ',             'JOB_STATUS'::"EntityEnum", 'read',    'jobStatus.read',     'group-0000-0000-0000-0000-000000000005', 'View job statuses'),
(gen_random_uuid(), 'Create Job Status',       'STATUS_CREATE',           'JOB_STATUS'::"EntityEnum", 'create',  'jobStatus.create',   'group-0000-0000-0000-0000-000000000005', 'Create job statuses'),
(gen_random_uuid(), 'Update Job Status',       'STATUS_UPDATE',           'JOB_STATUS'::"EntityEnum", 'update',  'jobStatus.update',   'group-0000-0000-0000-0000-000000000005', 'Update job statuses'),
(gen_random_uuid(), 'Delete Job Status',       'STATUS_DELETE',           'JOB_STATUS'::"EntityEnum", 'delete',  'jobStatus.delete',   'group-0000-0000-0000-0000-000000000005', 'Delete job statuses')

ON CONFLICT ("entityAction") DO NOTHING;


-- ==============================================================================================
-- 4. MAP PERMISSIONS TO ROLES
-- Strategy: Fill if link does not exist. (ON CONFLICT DO NOTHING handle pair uniqueness)
-- ==============================================================================================

-- A. ADMIN: Gets ALL permissions
INSERT INTO "_PermissionToRole" ("A", "B")
SELECT id, 'role-0000-0000-0000-0000-000000000001' FROM "Permission"
ON CONFLICT DO NOTHING;

-- B. STAFF: Gets Basic Operational Permissions
INSERT INTO "_PermissionToRole" ("A", "B")
SELECT id, 'role-0000-0000-0000-0000-000000000002' FROM "Permission"
WHERE "entityAction" IN (
    -- Jobs (Basic)
    'job.read', 'job.create', 'job.update', 'job.deliver', 
    -- User (Self-view implied, but reading list is okay)
    'user.read',
    -- CRM
    'client.read',
    -- Social
    'community.read', 'post.create',
    -- System
    'file.read', 'file.write',
    -- View lookups (Titles, Depts, Types, Statuses)
    'department.read', 'jobTitle.read', 'jobType.read', 'jobStatus.read'
)
ON CONFLICT DO NOTHING;

-- C. ACCOUNTANT: Gets Finance & Read-Only Access
INSERT INTO "_PermissionToRole" ("A", "B")
SELECT id, 'role-0000-0000-0000-0000-000000000003' FROM "Permission"
WHERE "entityAction" IN (
    -- Job Access
    'job.read', 'job.readAll', 'job.readSensitive', 'job.paid',
    -- Client Access
    'client.read', 'client.write',
    -- Payment Access (Granular)
    'payment.read', 'payment.readAll', 'payment.create', 'payment.update', 'payment.delete',
    -- Analytics
    'analytics.read','analytics.report'
)
ON CONFLICT DO NOTHING;