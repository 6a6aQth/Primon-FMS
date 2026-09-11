-- CreateEnum
CREATE TYPE "Role" AS ENUM ('supervisor', 'ops_manager', 'admin', 'client', 'executive');

-- CreateEnum
CREATE TYPE "WorkOrderSource" AS ENUM ('client_supplied', 'auto_generated', 'website');

-- CreateEnum
CREATE TYPE "CropType" AS ENUM ('tobacco', 'grain', 'both');

-- CreateEnum
CREATE TYPE "Scale" AS ENUM ('industrial', 'smallholder', 'household');

-- CreateEnum
CREATE TYPE "FccStatus" AS ENUM ('draft', 'in_progress', 'under_review', 'certified', 'flagged');

-- CreateEnum
CREATE TYPE "FumigationType" AS ENUM ('container', 'sheeted_stack');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('deduction', 'addition', 'adjustment');

-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('compliant', 'critical', 'action_taken');

-- CreateEnum
CREATE TYPE "SignatureRole" AS ENUM ('supervising_fumigator', 'supplier_rep', 'certifying_officer');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('in_app', 'email');

-- CreateEnum
CREATE TYPE "PendingSubmissionStatus" AS ENUM ('pending', 'converted', 'rejected');

-- CreateEnum
CREATE TYPE "PendingSubmissionSourceType" AS ENUM ('work_order', 'rfq', 'rfw');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'supervisor',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "source" "WorkOrderSource" NOT NULL DEFAULT 'auto_generated',
    "cropType" "CropType" NOT NULL DEFAULT 'tobacco',
    "scale" "Scale" NOT NULL DEFAULT 'industrial',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "clientId" TEXT,
    "salesOrderNo" TEXT,
    "shipmentNo" TEXT,
    "deliveryNo" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fccs" (
    "id" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "certificateNumber" TEXT,
    "status" "FccStatus" NOT NULL DEFAULT 'draft',
    "certifiedAt" TIMESTAMP(3),
    "certifiedById" TEXT,
    "qrCodeUrl" TEXT,
    "verificationUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fccs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_instructions" (
    "id" TEXT NOT NULL,
    "fccId" TEXT NOT NULL,
    "tobaccoSupplier" TEXT,
    "tobaccoSupplierAddress" TEXT,
    "consignee" TEXT,
    "consigneeAddress" TEXT,
    "fumigationContractor" TEXT DEFAULT 'Primon Enterprises Limited',
    "cropYear" TEXT,
    "tobaccoType" TEXT,
    "netWeight" DOUBLE PRECISION,
    "quantity" INTEGER,
    "polylined" BOOLEAN,
    "gradeName" TEXT,
    "caseNos" TEXT,
    "countryOfOrigin" TEXT,
    "location" TEXT,
    "warehouseSection" TEXT,
    "lockedAt" TIMESTAMP(3),

    CONSTRAINT "shipping_instructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fumigants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "fumigants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formulations" (
    "id" TEXT NOT NULL,
    "fumigantId" TEXT NOT NULL,
    "cropType" "CropType" NOT NULL DEFAULT 'both',
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'g',

    CONSTRAINT "formulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_levels" (
    "id" TEXT NOT NULL,
    "formulationId" TEXT NOT NULL,
    "quantityOnHand" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lowStockThreshold" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "formulationId" TEXT NOT NULL,
    "workOrderId" TEXT,
    "type" "StockMovementType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "performedById" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fumigation_descriptions" (
    "id" TEXT NOT NULL,
    "fccId" TEXT NOT NULL,
    "fumigationType" "FumigationType" NOT NULL DEFAULT 'sheeted_stack',
    "fumigantId" TEXT NOT NULL,
    "formulationId" TEXT NOT NULL,
    "doseGm3" DOUBLE PRECISION NOT NULL,
    "totalVolumeM3" DOUBLE PRECISION NOT NULL,
    "totalFumigantUsedG" DOUBLE PRECISION NOT NULL,
    "recordedById" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fumigation_descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gas_readings" (
    "id" TEXT NOT NULL,
    "fccId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "readingDate" TIMESTAMP(3) NOT NULL,
    "airspacePpm" DOUBLE PRECISION NOT NULL,
    "probeCasePpm" DOUBLE PRECISION NOT NULL,
    "ambientTempC" DOUBLE PRECISION,
    "productTempC" DOUBLE PRECISION,
    "relativeHumidityPct" DOUBLE PRECISION,
    "status" "ReadingStatus" NOT NULL DEFAULT 'compliant',
    "enteredById" TEXT NOT NULL,
    "enteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gas_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corrective_actions" (
    "id" TEXT NOT NULL,
    "gasReadingId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actionTakenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "loggedById" TEXT NOT NULL,

    CONSTRAINT "corrective_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fumigation_closeout" (
    "id" TEXT NOT NULL,
    "fccId" TEXT NOT NULL,
    "datePlaced" TIMESTAMP(3) NOT NULL,
    "aerationBegan" TIMESTAMP(3),
    "aerationCompleted" TIMESTAMP(3),
    "durationHours" DOUBLE PRECISION,

    CONSTRAINT "fumigation_closeout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signatures" (
    "id" TEXT NOT NULL,
    "fccId" TEXT NOT NULL,
    "role" "SignatureRole" NOT NULL,
    "signerName" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'in_app',
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "diff" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "household_clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "address" TEXT,
    "lastServiceDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "household_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "household_reminders" (
    "id" TEXT NOT NULL,
    "householdClientId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "channel" TEXT NOT NULL DEFAULT 'email',

    CONSTRAINT "household_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_submissions" (
    "id" TEXT NOT NULL,
    "sourceType" "PendingSubmissionSourceType" NOT NULL DEFAULT 'work_order',
    "payload" JSONB NOT NULL,
    "status" "PendingSubmissionStatus" NOT NULL DEFAULT 'pending',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedById" TEXT,

    CONSTRAINT "pending_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_code_key" ON "work_orders"("code");

-- CreateIndex
CREATE UNIQUE INDEX "fccs_workOrderId_key" ON "fccs"("workOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "fccs_certificateNumber_key" ON "fccs"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_instructions_fccId_key" ON "shipping_instructions"("fccId");

-- CreateIndex
CREATE UNIQUE INDEX "fumigants_name_key" ON "fumigants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "stock_levels_formulationId_key" ON "stock_levels"("formulationId");

-- CreateIndex
CREATE UNIQUE INDEX "fumigation_descriptions_fccId_key" ON "fumigation_descriptions"("fccId");

-- CreateIndex
CREATE UNIQUE INDEX "corrective_actions_gasReadingId_key" ON "corrective_actions"("gasReadingId");

-- CreateIndex
CREATE UNIQUE INDEX "fumigation_closeout_fccId_key" ON "fumigation_closeout"("fccId");

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fccs" ADD CONSTRAINT "fccs_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fccs" ADD CONSTRAINT "fccs_certifiedById_fkey" FOREIGN KEY ("certifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_instructions" ADD CONSTRAINT "shipping_instructions_fccId_fkey" FOREIGN KEY ("fccId") REFERENCES "fccs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formulations" ADD CONSTRAINT "formulations_fumigantId_fkey" FOREIGN KEY ("fumigantId") REFERENCES "fumigants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_levels" ADD CONSTRAINT "stock_levels_formulationId_fkey" FOREIGN KEY ("formulationId") REFERENCES "formulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_formulationId_fkey" FOREIGN KEY ("formulationId") REFERENCES "formulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fumigation_descriptions" ADD CONSTRAINT "fumigation_descriptions_fccId_fkey" FOREIGN KEY ("fccId") REFERENCES "fccs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fumigation_descriptions" ADD CONSTRAINT "fumigation_descriptions_fumigantId_fkey" FOREIGN KEY ("fumigantId") REFERENCES "fumigants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fumigation_descriptions" ADD CONSTRAINT "fumigation_descriptions_formulationId_fkey" FOREIGN KEY ("formulationId") REFERENCES "formulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fumigation_descriptions" ADD CONSTRAINT "fumigation_descriptions_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_readings" ADD CONSTRAINT "gas_readings_fccId_fkey" FOREIGN KEY ("fccId") REFERENCES "fccs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_readings" ADD CONSTRAINT "gas_readings_enteredById_fkey" FOREIGN KEY ("enteredById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrective_actions" ADD CONSTRAINT "corrective_actions_gasReadingId_fkey" FOREIGN KEY ("gasReadingId") REFERENCES "gas_readings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrective_actions" ADD CONSTRAINT "corrective_actions_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fumigation_closeout" ADD CONSTRAINT "fumigation_closeout_fccId_fkey" FOREIGN KEY ("fccId") REFERENCES "fccs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_fccId_fkey" FOREIGN KEY ("fccId") REFERENCES "fccs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_reminders" ADD CONSTRAINT "household_reminders_householdClientId_fkey" FOREIGN KEY ("householdClientId") REFERENCES "household_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_submissions" ADD CONSTRAINT "pending_submissions_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
