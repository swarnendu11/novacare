import Medicine from "../models/Medicine.js";
import MedicineLog from "../models/MedicineLog.js";
import Prescription from "../models/Prescription.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";
import logger from "../utils/logger.js";

// @desc    Get/Search medicine inventory stock
// @route   GET /api/pharmacy/medicines
// @access  Private (Pharmacy/Doctor/Nurse/Admin only)
export const getMedicines = asyncHandler(async (req, res) => {
  const { name, category } = req.query;
  const filter = {};

  if (name) filter.name = { $regex: name, $options: "i" };
  if (category) filter.category = category;

  const medicines = await Medicine.find(filter);
  res.json(medicines);
});

// @desc    Restock medicine inventory item
// @route   POST /api/pharmacy/medicines
// @access  Private (Pharmacy/Admin only)
export const restockMedicine = asyncHandler(async (req, res) => {
  const { name, genericName, category, sku, stock, unitPrice, manufacturer, expiryDate } = req.body;

  let medicine = await Medicine.findOne({ sku });

  if (medicine) {
    // Restock existing medicine
    medicine.stock += Number(stock);
    medicine.unitPrice = unitPrice || medicine.unitPrice;
    await medicine.save();
    
    // Log stocked transaction
    await MedicineLog.create({
      medicineId: medicine._id,
      type: "stocked",
      quantity: stock,
      actionBy: req.user._id,
      notes: "Stock refill transaction"
    });

    logger.info(`Medicine refilled: ${medicine.name} (SKU: ${sku}) with quantity ${stock}`);
    res.json(medicine);
  } else {
    // Create new medicine
    medicine = await Medicine.create({
      name,
      genericName,
      category,
      sku,
      stock,
      unitPrice,
      manufacturer,
      expiryDate
    });

    await MedicineLog.create({
      medicineId: medicine._id,
      type: "stocked",
      quantity: stock,
      actionBy: req.user._id,
      notes: "Initial inventory setup"
    });

    logger.info(`New medicine profile created: ${medicine.name} (SKU: ${sku}) with quantity ${stock}`);
    res.status(201).json(medicine);
  }
});

// @desc    Dispense prescription medicines to patient
// @route   POST /api/pharmacy/dispense/:prescriptionId
// @access  Private (Pharmacy only)
export const dispensePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.prescriptionId);
  if (!prescription) {
    res.status(404);
    throw new Error("Prescription order not found");
  }

  if (prescription.dispensationStatus === "dispensed") {
    res.status(400);
    throw new Error("Prescription has already been fully dispensed");
  }

  // Deduct inventory stock for each prescribed medicine
  for (const item of prescription.medicines) {
    const medicine = await Medicine.findOne({ name: { $regex: `^${item.name}$`, $options: "i" } });
    
    if (medicine) {
      if (medicine.stock >= item.quantity) {
        medicine.stock -= item.quantity;
        await medicine.save();

        await MedicineLog.create({
          medicineId: medicine._id,
          type: "dispensed",
          quantity: item.quantity,
          referenceId: prescription._id,
          actionBy: req.user._id,
          notes: `Dispensed to patient prescription ID: ${prescription._id}`
        });
      } else {
        logger.warn(`Insufficient stock to fulfill: ${item.name} (Needed: ${item.quantity}, In Stock: ${medicine.stock})`);
      }
    }
  }

  prescription.dispensationStatus = "dispensed";
  await prescription.save();

  logger.info(`Pharmacy fulfilled prescription: ${prescription._id}`);

  // Notify patient
  await createNotification({
    recipientId: prescription.patientId,
    title: "Medication Order Fulfilled",
    message: "Your e-prescription has been successfully packed and dispensed by the pharmacy.",
    type: "prescription"
  });

  res.json({ message: "Prescription packed and dispensed successfully", prescription });
});
