import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"],
      unique: true, 
      lowercase: true,
      trim: true,
      index: true
    },
    password: { 
      type: String, 
      required: [true, "Password is required"] 
    },
    role: {
      type: String,
      required: true,
      default: "patient",
      enum: [
        "patient",
        "doctor",
        "admin",
        "receptionist",
        "nurse",
        "wardboy",
        "pharmacy",
        "lab_technician",
        "ambulance_staff"
      ],
      index: true
    },
    phone: { 
      type: String, 
      default: "",
      index: true
    },
    gender: { 
      type: String, 
      default: "Unspecified",
      enum: ["Male", "Female", "Other", "Unspecified"]
    },
    dob: { 
      type: Date 
    },
    address: { 
      type: String, 
      default: "" 
    },
    
    // Patient specific biometrics / record fields
    bloodGroup: { 
      type: String, 
      default: "Unknown" 
    },
    allergies: { 
      type: String, 
      default: "None" 
    },
    emergencyContact: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      relation: { type: String, default: "" }
    },
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        notes: String
      }
    ],

    // Staff specific professional fields (Doctors, Nurses, Technicians, Ambulance Drivers)
    specialization: { type: String, default: "" },
    department: { type: String, default: "" },
    licenseNumber: { type: String, default: "" },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected", "active", "inactive", "on-leave"]
    },

    // Session / Security / OTP details
    googleId: { type: String, default: null },
    avatar: { type: String, default: "" },
    refreshToken: { type: String, default: null },
    otp: {
      code: { type: String, default: null },
      expiresAt: { type: Date, default: null }
    }
  },
  {
    timestamps: true,
  }
);

// Method to verify passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Auto-hash password on saving if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
