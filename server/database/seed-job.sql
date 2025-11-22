-- ==========================================
-- Raw INSERTS for 50 Jobs (dot-number format)
-- ==========================================
-- Replace with your actual existing JobType, JobStatus, User, PaymentChannel IDs as needed.
-- These examples assume at least one record in each table.
DO $$
DECLARE
  v_type RECORD;
  v_status RECORD;
  v_creator RECORD;
  v_payment RECORD;
  v_job_no TEXT;
  v_seq INT := 1;
BEGIN
  FOR i IN 1..50 LOOP
    -- random job type
    SELECT * INTO v_type FROM "JobType" ORDER BY random() LIMIT 1;
    SELECT * INTO v_status FROM "JobStatus" ORDER BY random() LIMIT 1;
    SELECT * INTO v_creator FROM "User" ORDER BY random() LIMIT 1;
    SELECT * INTO v_payment FROM "PaymentChannel" ORDER BY random() LIMIT 1;

    -- next job number by type (dot format)
    SELECT COALESCE(MAX((regexp_replace(no, '.*\.', ''))::int), 0) + 1
    INTO v_seq
    FROM "Job"
    WHERE "typeId" = v_type.id;

    v_job_no := v_type.code || '.' || LPAD(v_seq::text, 4, '0');

    INSERT INTO "Job" (
      id, no, "typeId", "displayName", "clientName",
      "incomeCost", "staffCost", "statusId",
      "createdById", "paymentChannelId",
      "isPaid", "isPinned", "isPublished", "dueAt", "createdAt", "updatedAt"
    )
    VALUES (
      gen_random_uuid(),
      v_job_no,
      v_type.id,
      (ARRAY['Design','Analysis','Optimization','Testing','Upgrade','Redesign','Development','Implementation','Maintenance','Installation','Calibration','Inspection','Simulation','Validation','Integration'])[1 + floor(random() * 15)::int]
      || ' of ' ||
      (ARRAY['Automated Assembly Line','HVAC System','Robotic Arm','Heat Exchanger','Conveyor Belt System','Pneumatic System','Turbine Blade','Gear Box','Hydraulic Press','Vibration Damping System','Engine Cooling System','CNC Machine Tool','Bearing Analysis','Compressor Performance','Material Handling System','Pump Station','Valve Control System','Shaft Design','Boiler System','Clutch Mechanism','Brake System','Suspension System','Transmission System','Flywheel Design','Pressure Vessel','Piping Network','Cooling Tower','Centrifugal Fan','Steam Turbine','Gas Compressor'])[1 + floor(random() * 30)::int],
      'Client ' || i,
      (100 + floor(random() * 900))::int,
      ((100 + floor(random() * 900))::int) * 26385,
      v_status.id,
      v_creator.id,
      v_payment.id,
      (random() < 0.5),
      (random() < 0.5),
      (random() < 0.5),
      NOW() + ((1 + floor(random() * 70))::text || ' days')::interval,
      NOW(),
      NOW()
    );
  END LOOP;
END $$;