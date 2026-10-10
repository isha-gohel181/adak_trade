import mongoose from "mongoose";
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

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

async function main() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

  const keys = [
    { key: "RAZORPAY_KEY_ID", value: "rzp_test_SPTvNCnEWS87X0" },
    { key: "RAZORPAY_KEY_SECRET", value: "cDfILCS073PveeDO9y0zt40D" }
  ];

  for (const item of keys) {
    await Setting.findOneAndUpdate(
      { key: item.key },
      { $set: { value: item.value } },
      { upsert: true, new: true }
    );
    console.log(`✅ Upserted ${item.key} in database`);
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected. Done!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
