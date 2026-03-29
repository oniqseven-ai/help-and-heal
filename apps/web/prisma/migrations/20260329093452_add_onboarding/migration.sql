-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'PROVIDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMISSION_REQUESTED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "provider_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "fullName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "dateOfBirth" TEXT,
    "gender" TEXT,
    "tier" "ProviderTier" NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "specialties" TEXT[],
    "languages" TEXT[],
    "requestedRate" INTEGER NOT NULL,
    "yearsExperience" INTEGER NOT NULL DEFAULT 0,
    "governmentIdType" TEXT,
    "governmentIdNumber" TEXT,
    "aadhaarNumber" TEXT,
    "panNumber" TEXT,
    "highestDegree" TEXT,
    "university" TEXT,
    "graduationYear" INTEGER,
    "degreeCertNumber" TEXT,
    "rciRegistrationNo" TEXT,
    "nmcRegistrationNo" TEXT,
    "registrationExpiry" TIMESTAMP(3),
    "hasIndemnityInsurance" BOOLEAN NOT NULL DEFAULT false,
    "insurancePolicyNumber" TEXT,
    "codeOfEthicsAgreed" BOOLEAN NOT NULL DEFAULT false,
    "dpdpConsentAgreed" BOOLEAN NOT NULL DEFAULT false,
    "termsAgreed" BOOLEAN NOT NULL DEFAULT false,
    "trainingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "trainingCompletedAt" TIMESTAMP(3),
    "backgroundCheckStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_checklist_items" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "compliance_checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provider_applications_userId_key" ON "provider_applications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_checklist_items_applicationId_key_key" ON "compliance_checklist_items"("applicationId", "key");

-- AddForeignKey
ALTER TABLE "provider_applications" ADD CONSTRAINT "provider_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_checklist_items" ADD CONSTRAINT "compliance_checklist_items_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "provider_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
