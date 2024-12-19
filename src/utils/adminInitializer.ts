import bcrypt from "bcrypt";
import usersModel from "../models/users";

const initializeAdminAccount = async () => {
  const adminEmail = "admin@gmail.com"; // Change to your preferred admin email
  const adminPassword = "password"; // Change to a secure password

  try {
    const existingAdmin = await usersModel.findOne({ email: adminEmail, role: 1 });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await usersModel.create({
        firstName: "Admin",
        lastName:"Admin",
        email: adminEmail,
        hashed_password: hashedPassword,
        role: 1,
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
