import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

const ADMIN_EMAIL = "admin@ias-dcs.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "IAS DCS Admin";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "instructor", "student", "news_editor", "super_admin"],
      default: "student",
    },
    is_verify: { type: Boolean, default: false },
    profilePicture: { type: String, default: "default-profile.png" },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    emailVerified: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    skipDeviceApproval: { type: Boolean, default: true },
  },
  { timestamps: true }
);

async function main() {
  console.log("🔗 Connecting to MongoDB Atlas...");
  console.log("URI:", MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const User = mongoose.models.User || mongoose.model("User", userSchema);

  // List existing users with admin / super_admin role or matching email
  const existingAdmins = await User.find({
    $or: [
      { role: { $in: ["admin", "super_admin"] } },
      { email: { $regex: "admin", $options: "i" } },
      { email: ADMIN_EMAIL }
    ]
  });
  console.log("Existing admin accounts found:", existingAdmins.map(u => ({ id: u._id, email: u.email, role: u.role })));

  const salt = parseInt(process.env.SALT) || 10;
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (existing) {
    existing.password = hashedPassword;
    existing.role = "admin";
    existing.fullName = ADMIN_NAME;
    existing.isActive = true;
    existing.status = "active";
    existing.emailVerified = true;
    existing.is_verify = true;
    existing.isBanned = false;
    existing.skipDeviceApproval = true;
    await existing.save();
    console.log(`✅ Admin credentials reset successfully for: ${ADMIN_EMAIL}`);
  } else {
    const admin = new User({
      fullName: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      is_verify: true,
      isActive: true,
      status: "active",
      emailVerified: true,
      isBanned: false,
      skipDeviceApproval: true,
    });
    await admin.save();
    console.log(`✅ Admin user created successfully: ${ADMIN_EMAIL}`);
  }

  console.log("-----------------------------------------");
  console.log(`📧 Email    : ${ADMIN_EMAIL}`);
  console.log(`🔑 Password : ${ADMIN_PASSWORD}`);
  console.log(`👑 Role     : admin`);
  console.log("-----------------------------------------");

  await mongoose.disconnect();
  console.log("🔌 Disconnected. Done!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  mongoose.disconnect();
  process.exit(1);
});
