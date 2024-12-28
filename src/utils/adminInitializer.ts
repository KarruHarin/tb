import bcrypt from "bcrypt";
import adminModel from "../models/admin";

const initializeAdminAccount = async () => {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "password";
  try {
    const existingAdmin = await adminModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await adminModel.create({
        name: "Admin",
        email: adminEmail,
        hashed_password: hashedPassword,
        is_deleted: false,
      });
      console.log("Admin account initialized successfully.");
    } else {
      console.log("Admin account already exists.");
    }
  } catch (err) {
    console.error("Error initializing admin account:", err);
  }
};

export default initializeAdminAccount;
