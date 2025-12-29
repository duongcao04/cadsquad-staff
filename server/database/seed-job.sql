DO $$
DECLARE
    v_type RECORD;
    v_status RECORD;
    v_creator RECORD;
    v_payment RECORD;
    v_client RECORD;
    v_job_id UUID;
    v_job_no TEXT;
    v_user RECORD;
    v_num_assignees INT;
    v_income FLOAT;
BEGIN
    FOR i IN 1..50 LOOP
        -- Select random relations
        SELECT * INTO v_type FROM "JobType" ORDER BY random() LIMIT 1;
        SELECT * INTO v_status FROM "JobStatus" ORDER BY random() LIMIT 1;
        SELECT * INTO v_creator FROM "User" ORDER BY random() LIMIT 1;
        SELECT * INTO v_payment FROM "PaymentChannel" ORDER BY random() LIMIT 1;
        SELECT * INTO v_client FROM "Client" ORDER BY random() LIMIT 1;

        v_job_id := gen_random_uuid();
        
        -- Generate Job No (Type.000i)
        v_job_no := v_type.code || '.' || LPAD(i::text, 4, '0');
        v_income := (500 + floor(random() * 5000));

        -- 1. Insert the Job
        INSERT INTO "Job" (
            id, no, "typeId", "clientId", "displayName", "incomeCost", 
            "statusId", "createdById", "paymentChannelId", "priority",
            "dueAt", "createdAt", "updatedAt"
        )
        VALUES (
            v_job_id, v_job_no, v_type.id, v_client.id, 
            (ARRAY['Design','Analysis','Consulting','Repair','Dev'])[1 + floor(random() * 5)::int] || ' for ' || v_client.name,
            v_income, v_status.id, v_creator.id, v_payment.id,
            (ARRAY['LOW','MEDIUM','HIGH','URGENT'])[1 + floor(random() * 4)::int]::"JobPriority",
            NOW() + (floor(random() * 30 + 1) || ' days')::interval,
            NOW(), NOW()
        );

        -- 2. Seed JobAssignment (Each assignee has their own staffCost)
        v_num_assignees := 1 + floor(random() * 3)::int;
        FOR v_user IN (SELECT id FROM "User" ORDER BY random() LIMIT v_num_assignees) LOOP
            INSERT INTO "JobAssignment" (id, "jobId", "userId", "staffCost", "assignedAt")
            VALUES (
                gen_random_uuid(),
                v_job_id,
                v_user.id,
                (100 + random() * 300), -- Unique cost per staff
                NOW()
            );
        END LOOP;

        -- 3. Seed JobStatusHistory (Initial entry)
        INSERT INTO "JobStatusHistory" (id, "jobId", "statusId", "changedById", "startedAt", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_job_id, v_status.id, v_creator.id, NOW(), NOW(), NOW());

    END LOOP;
END $$;