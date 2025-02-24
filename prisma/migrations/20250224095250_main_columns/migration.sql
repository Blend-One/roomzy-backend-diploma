-- CreateTable
CREATE TABLE "AttributeRelationship" (
    "id" TEXT NOT NULL,
    "parentAttributeId" TEXT NOT NULL,
    "childAtttributeId" TEXT NOT NULL,

    CONSTRAINT "AttributeRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeType" (
    "id" TEXT NOT NULL,
    "roomSectionTypeId" TEXT NOT NULL,

    CONSTRAINT "AttributeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attributeTypeId" TEXT NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControversialIssue" (
    "id" TEXT NOT NULL,
    "rentId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ControversialIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteRoom" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "FavoriteRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceUnit" (
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RentStatus" (
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Rent" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rentStatus" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "updatedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomImage" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "RoomImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomSectionType" (
    "id" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,

    CONSTRAINT "RoomSectionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomSection" (
    "id" TEXT NOT NULL,
    "floorNumber" INTEGER NOT NULL,
    "roomSectionTypeId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "RoomSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomStatus" (
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RoomType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rentStatus" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "priceUnit" TEXT NOT NULL,
    "physControl" BOOLEAN NOT NULL,
    "physControlInstructions" TEXT,
    "accessInstructions" TEXT,
    "street" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "appartment" TEXT,
    "isCommercial" BOOLEAN NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionAttributeValue" (
    "id" TEXT NOT NULL,
    "roomSectionId" TEXT NOT NULL,
    "roomSectionTypeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "attributeTypeId" TEXT NOT NULL,

    CONSTRAINT "SectionAttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceUnit_name_key" ON "PriceUnit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RentStatus_name_key" ON "RentStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RoomImage_id_key" ON "RoomImage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomStatus_name_key" ON "RoomStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RoomType_name_key" ON "RoomType"("name");

-- AddForeignKey
ALTER TABLE "AttributeRelationship" ADD CONSTRAINT "AttributeRelationship_parentAttributeId_fkey" FOREIGN KEY ("parentAttributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeRelationship" ADD CONSTRAINT "AttributeRelationship_childAtttributeId_fkey" FOREIGN KEY ("childAtttributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeType" ADD CONSTRAINT "AttributeType_roomSectionTypeId_fkey" FOREIGN KEY ("roomSectionTypeId") REFERENCES "RoomSectionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControversialIssue" ADD CONSTRAINT "ControversialIssue_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControversialIssue" ADD CONSTRAINT "ControversialIssue_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRoom" ADD CONSTRAINT "FavoriteRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRoom" ADD CONSTRAINT "FavoriteRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_rentStatus_fkey" FOREIGN KEY ("rentStatus") REFERENCES "RentStatus"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomImage" ADD CONSTRAINT "RoomImage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomSectionType" ADD CONSTRAINT "RoomSectionType_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomSection" ADD CONSTRAINT "RoomSection_roomSectionTypeId_fkey" FOREIGN KEY ("roomSectionTypeId") REFERENCES "RoomSectionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomSection" ADD CONSTRAINT "RoomSection_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_status_fkey" FOREIGN KEY ("status") REFERENCES "RoomStatus"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_rentStatus_fkey" FOREIGN KEY ("rentStatus") REFERENCES "RentStatus"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionAttributeValue" ADD CONSTRAINT "SectionAttributeValue_roomSectionId_fkey" FOREIGN KEY ("roomSectionId") REFERENCES "RoomSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionAttributeValue" ADD CONSTRAINT "SectionAttributeValue_roomSectionTypeId_fkey" FOREIGN KEY ("roomSectionTypeId") REFERENCES "RoomSectionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionAttributeValue" ADD CONSTRAINT "SectionAttributeValue_attributeTypeId_fkey" FOREIGN KEY ("attributeTypeId") REFERENCES "AttributeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
