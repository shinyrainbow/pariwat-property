-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyListing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "listingType" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "location" TEXT,
    "size" TEXT,
    "price" TEXT,
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Portfolio_isActive_idx" ON "Portfolio"("isActive");

-- CreateIndex
CREATE INDEX "Portfolio_order_idx" ON "Portfolio"("order");

-- CreateIndex
CREATE INDEX "PropertyListing_status_idx" ON "PropertyListing"("status");

-- CreateIndex
CREATE INDEX "PropertyListing_createdAt_idx" ON "PropertyListing"("createdAt");

-- CreateIndex
CREATE INDEX "PropertyListing_listingType_idx" ON "PropertyListing"("listingType");
