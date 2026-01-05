-- rolePermission.sql (UUID Version)

-- ==========================================
-- 1. INSERT ROLES (Using hardcoded UUIDs for mapping)
-- ==========================================
INSERT INTO "Role" ("id", "displayName", "code", "hexColor") VALUES 
('role-0000-0000-0000-0000-000000000001', 'Administrator', 'admin',      '#ef4444'),
('role-0000-0000-0000-0000-000000000002', 'Staff',         'staff',      '#3b82f6'),
('role-0000-0000-0000-0000-000000000003', 'Accountant',    'accounting', '#10b981')
ON CONFLICT ("code") DO UPDATE 
SET "displayName" = EXCLUDED."displayName", "hexColor" = EXCLUDED."hexColor";

-- ==========================================
-- 2. INSERT PERMISSION GROUPS
-- ==========================================
INSERT INTO "PermissionGroup" ("id", "displayName", "code", "order", "updatedAt") VALUES 
('group-0000-0000-0000-0000-000000000001', 'Recruitment Management', 'GROUP_RECRUITMENT', 1, NOW()),
('group-0000-0000-0000-0000-000000000002', 'Staff Management',       'GROUP_STAFF',       2, NOW()),
('group-0000-0000-0000-0000-000000000003', 'Finance & CRM',          'GROUP_FINANCE',     3, NOW()),
('group-0000-0000-0000-0000-000000000004', 'Community & Social',     'GROUP_SOCIAL',      4, NOW()),
('group-0000-0000-0000-0000-000000000005', 'System Settings',        'GROUP_SYSTEM',      99, NOW())
ON CONFLICT ("code") DO UPDATE 
SET "displayName" = EXCLUDED."displayName", "order" = EXCLUDED."order";

-- ==========================================
-- 3. INSERT PERMISSIONS (With Group IDs)
-- ==========================================
INSERT INTO "Permission" ("id", "displayName", "code", "entity", "action", "entityAction", "permissionGroupId", "description") VALUES 

-- GROUP 1: RECRUITMENT (Jobs)
(gen_random_uuid(), 'View Jobs',       'JOB_READ',    'JOB'::"EntityEnum", 'read',    'job.read',    'group-0000-0000-0000-0000-000000000001', 'View jobs assigned'),
(gen_random_uuid(), 'View Jobs',       'JOB_READ_ALL',    'JOB'::"EntityEnum", 'readAll',    'job.readAll',    'group-0000-0000-0000-0000-000000000001', 'View all jobs (both assigned or not assigned)'),
(gen_random_uuid(), 'View Job Sensitive data',       'JOB_READ_SENSITIVE_DATA',    'JOB'::"EntityEnum", 'readSensitive',    'job.readSensitive',    'group-0000-0000-0000-0000-000000000001', 'View all job sensitive data'),
(gen_random_uuid(), 'Create Jobs',     'JOB_CREATE',  'JOB'::"EntityEnum", 'create',  'job.create',  'group-0000-0000-0000-0000-000000000001', 'Create jobs'),
(gen_random_uuid(), 'Update Jobs',     'JOB_UPDATE',  'JOB'::"EntityEnum", 'update',  'job.update',  'group-0000-0000-0000-0000-000000000001', 'Update jobs'),
(gen_random_uuid(), 'Deliver Jobs',     'JOB_DELIVER',  'JOB'::"EntityEnum", 'deliver',  'job.deliver',  'group-0000-0000-0000-0000-000000000001', 'Deliver jobs'),
(gen_random_uuid(), 'Update Jobs',     'JOB_PAID',  'JOB'::"EntityEnum", 'paid',  'job.paid',  'group-0000-0000-0000-0000-000000000001', 'Paid jobs'),
(gen_random_uuid(), 'Update Jobs',     'JOB_REVIEW',  'JOB'::"EntityEnum", 'review',  'job.review',  'group-0000-0000-0000-0000-000000000001', 'Approve or Reject job when job in Wait_review status'),
(gen_random_uuid(), 'Delete Jobs',     'JOB_DELETE',  'JOB'::"EntityEnum", 'delete',  'job.delete',  'group-0000-0000-0000-0000-000000000001', 'Delete jobs'),
(gen_random_uuid(), 'Publish Jobs',    'JOB_PUBLISH', 'JOB'::"EntityEnum", 'publish', 'job.publish', 'group-0000-0000-0000-0000-000000000001', 'Publish jobs'),
(gen_random_uuid(), 'Assign member',    'JOB_ASSIGN_MEMBER', 'JOB'::"EntityEnum", 'assignMember', 'job.assignMember', 'group-0000-0000-0000-0000-000000000001', 'Assign member to job'),

-- GROUP 2: STAFF (Users)
(gen_random_uuid(), 'View Users',      'USER_READ',   'USER'::"EntityEnum", 'read',    'user.read',    'group-0000-0000-0000-0000-000000000002', 'View staff'),
(gen_random_uuid(), 'Create Users',    'USER_CREATE', 'USER'::"EntityEnum", 'create',  'user.create',  'group-0000-0000-0000-0000-000000000002', 'Create staff'),
(gen_random_uuid(), 'Update Users',    'USER_UPDATE', 'USER'::"EntityEnum", 'update',  'user.update',  'group-0000-0000-0000-0000-000000000002', 'Update staff'),
(gen_random_uuid(), 'Delete Users',    'USER_DELETE', 'USER'::"EntityEnum", 'delete',  'user.delete',  'group-0000-0000-0000-0000-000000000002', 'Delete staff'),

-- GROUP 3: FINANCE (Clients, Payments)
(gen_random_uuid(), 'View Clients',    'CLIENT_READ',  'CLIENT'::"EntityEnum", 'read',   'client.read',   'group-0000-0000-0000-0000-000000000003', 'View clients'),
(gen_random_uuid(), 'Manage Clients',  'CLIENT_WRITE', 'CLIENT'::"EntityEnum", 'write',  'client.write',  'group-0000-0000-0000-0000-000000000003', 'Manage clients'),
(gen_random_uuid(), 'View Payments',   'PAY_READ',     'PAYMENT_CHANNEL'::"EntityEnum", 'read', 'payment.read', 'group-0000-0000-0000-0000-000000000003', 'View payments'),
(gen_random_uuid(), 'Manage Payments', 'PAY_WRITE',    'PAYMENT_CHANNEL'::"EntityEnum", 'write', 'payment.write', 'group-0000-0000-0000-0000-000000000003', 'Manage payments'),

-- GROUP 4: SOCIAL
(gen_random_uuid(), 'View Community',  'COMM_READ',   'COMMUNITY'::"EntityEnum", 'read',     'community.read',     'group-0000-0000-0000-0000-000000000004', 'View comms'),
(gen_random_uuid(), 'Create Community','COMM_CREATE', 'COMMUNITY'::"EntityEnum", 'create',   'community.create',   'group-0000-0000-0000-0000-000000000004', 'Create comms'),
(gen_random_uuid(), 'Post Content',    'POST_CREATE', 'POST'::"EntityEnum",      'create',   'post.create',        'group-0000-0000-0000-0000-000000000004', 'Create posts'),

-- GROUP 5: SYSTEM
(gen_random_uuid(), 'View Files',      'FILE_READ',   'FILE'::"EntityEnum",      'read',     'file.read',       'group-0000-0000-0000-0000-000000000005', 'View files'),
(gen_random_uuid(), 'Upload Files',    'FILE_WRITE',  'FILE'::"EntityEnum",      'write',    'file.write',      'group-0000-0000-0000-0000-000000000005', 'Upload files'),
(gen_random_uuid(), 'System Config',   'SYS_MANAGE',  'SYSTEM'::"EntityEnum",    'manage',   'system.manage',   'group-0000-0000-0000-0000-000000000005', 'Configs')

ON CONFLICT ("entityAction") DO UPDATE 
SET "permissionGroupId" = EXCLUDED."permissionGroupId",
    "displayName" = EXCLUDED."displayName";

-- ==========================================
-- 4. MAP PERMISSIONS TO ROLES
-- ==========================================

-- A. ADMIN: Gets ALL permissions
INSERT INTO "_PermissionToRole" ("A", "B")
SELECT id, 'role-0000-0000-0000-0000-000000000001' FROM "Permission"
ON CONFLICT DO NOTHING;

-- B. STAFF: Gets Basic permissions
INSERT INTO "_PermissionToRole" ("A", "B")
SELECT id, 'role-0000-0000-0000-0000-000000000002' FROM "Permission"
WHERE "entityAction" IN (
    'job.read', 'job.create', 'job.update',
    'user.read',
    'client.read',
    'community.read', 'post.create',
    'file.read', 'file.write'
)
ON CONFLICT DO NOTHING;

-- C. ACCOUNTANT: Gets Finance permissions
INSERT INTO "_PermissionToRole" ("A", "B")
SELECT id, 'role-0000-0000-0000-0000-000000000003' FROM "Permission"
WHERE "entityAction" IN (
    'job.read',
    'client.read', 'client.write',
    'payment.read', 'payment.write'
)
ON CONFLICT DO NOTHING;