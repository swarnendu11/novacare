import connectDB, { disconnectDB } from "../config/db.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";

const runSanityTest = async () => {
  logger.info("==================================================================");
  logger.info("             NOVACARE CENTRALIZED BACKEND SANITY TEST             ");
  logger.info("==================================================================");
  
  try {
    // 1. Establish Database Connection (triggers MongoMemoryServer automatically)
    logger.info("[Test] Step 1: Connecting to Database...");
    await connectDB();
    logger.info("[Test] Step 1: PASSED. Database connected.");

    // 2. Perform CRUD operations on User model
    logger.info("[Test] Step 2: Creating a new Admin user...");
    const testUser = new User({
      name: "Dr. Swarn Admin",
      email: "swarn.admin@novacare.com",
      password: "SuperSecurePassword123",
      role: "admin",
      phone: "+919876543210",
      gender: "Male"
    });

    const savedUser = await testUser.save();
    logger.info(`[Test] Step 2: PASSED. User created with ID: ${savedUser._id}`);

    // 3. Verify Password Hashing
    logger.info("[Test] Step 3: Verifying password hashing Pre-Save hook...");
    if (savedUser.password === "SuperSecurePassword123") {
      throw new Error("Password Hashing failed! Password is still in plain text.");
    }
    logger.info("[Test] Step 3: PASSED. Password successfully hashed.");

    // 4. Verify password verification method
    logger.info("[Test] Step 4: Verifying password match method...");
    const isMatched = await savedUser.matchPassword("SuperSecurePassword123");
    const isNotMatched = await savedUser.matchPassword("WrongPassword123");
    
    if (!isMatched || isNotMatched) {
      throw new Error("matchPassword verification method is malfunctioning!");
    }
    logger.info("[Test] Step 4: PASSED. matchPassword verification successful.");

    // 5. Query and verify record from database
    logger.info("[Test] Step 5: Querying user from database...");
    const queriedUser = await User.findOne({ email: "swarn.admin@novacare.com" });
    if (!queriedUser || queriedUser.name !== "Dr. Swarn Admin" || queriedUser.role !== "admin") {
      throw new Error("Database query retrieved corrupt or missing data!");
    }
    logger.info("[Test] Step 5: PASSED. Query verified.");

    // 6. Graceful Disconnect
    logger.info("[Test] Step 6: Disconnecting from Database...");
    await disconnectDB();
    logger.info("[Test] Step 6: PASSED. Disconnected cleanly.");

    logger.info("==================================================================");
    logger.info(" 🎉 SANITY TEST PASSED! CONSOLIDATED BACKEND BUILD IS 100% HEALTHY");
    logger.info("==================================================================");
    process.exit(0);
  } catch (error) {
    logger.error(`❌ SANITY TEST FAILED: ${error.message}`, { stack: error.stack });
    try {
      await disconnectDB();
    } catch (e) {}
    process.exit(1);
  }
};

runSanityTest();
