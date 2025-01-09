const router = require('express').Router();
const UserModel = require("../models/User"); 
const UserLoginsModel = require("../models/Login");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

router.post("/add-user", async (req, res) => {
  console.log('Inside add-user Section');
  const {
    name,
    organization,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    zipcode,
    phoneNumber,
    regCode,
    agentAttorney,
    dateOfPatent,
    agentLicensed,
    firmOrOrganization,
    updatedPhoneNumber,
    emailAddress,
    updatedOrganization,
    firmUrl,
    updatedAddress,
    updatedCity,
    updatedState,
    updatedCountry,
    updatedZipcode,
    linkedInProfile,
    notes,
    initials,
    dataUpdatedAsOn,
    userId,
  } = req.body;
  console.log('Inside add-user Section and userid:', userId);
  try {
    // Get the next slNo
    const lastUser = await UserModel.findOne().sort({ slNo: -1 }).exec();
    const nextSlNo = lastUser ? lastUser.slNo + 1 : 1;

    // Save to MongoDB
    const newUser = new UserModel({
      slNo: nextSlNo,
      name,
      organization,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      zipcode,
      phoneNumber,
      regCode,
      agentAttorney,
      dateOfPatent,
      agentLicensed,
      firmOrOrganization,
      updatedPhoneNumber,
      emailAddress,
      updatedOrganization,
      firmUrl,
      updatedAddress,
      updatedCity,
      updatedState,
      updatedCountry,
      updatedZipcode,
      linkedInProfile,
      notes,
      initials,
      dataUpdatedAsOn,
      userId,
    });

    const savedUser = await newUser.save();

    // Write to Excel file
    const filePath = path.resolve(__dirname, "../insertData/ActiveAttorneyRoster3.xlsx");

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: `Excel file not found: ${filePath}` });
    }

    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const range = worksheet["!ref"];
    const decodedRange = range ? xlsx.utils.decode_range(range) : { s: { r: 0 }, e: { r: 0 } };
    const nextRow = decodedRange.e.r + 2;

    worksheet[`A${nextRow}`] = { v: savedUser.slNo };
    worksheet[`B${nextRow}`] = { v: savedUser.name };
    worksheet[`C${nextRow}`] = { v: savedUser.organization };
    worksheet[`D${nextRow}`] = { v: savedUser.addressLine1 };
    worksheet[`E${nextRow}`] = { v: savedUser.addressLine2 };
    worksheet[`F${nextRow}`] = { v: savedUser.city };
    worksheet[`G${nextRow}`] = { v: savedUser.state };
    worksheet[`H${nextRow}`] = { v: savedUser.country };
    worksheet[`I${nextRow}`] = { v: savedUser.zipcode };
    worksheet[`J${nextRow}`] = { v: savedUser.phoneNumber };
    worksheet[`K${nextRow}`] = { v: savedUser.regCode };
    worksheet[`L${nextRow}`] = { v: savedUser.agentAttorney };
    worksheet[`M${nextRow}`] = { v: savedUser.dateOfPatent };
    worksheet[`N${nextRow}`] = { v: savedUser.agentLicensed };
    worksheet[`O${nextRow}`] = { v: savedUser.firmOrOrganization };
    worksheet[`P${nextRow}`] = { v: savedUser.updatedPhoneNumber };
    worksheet[`Q${nextRow}`] = { v: savedUser.emailAddress };
    worksheet[`R${nextRow}`] = { v: savedUser.updatedOrganization };
    worksheet[`S${nextRow}`] = { v: savedUser.firmUrl };
    worksheet[`T${nextRow}`] = { v: savedUser.updatedAddress };
    worksheet[`U${nextRow}`] = { v: savedUser.updatedCity };
    worksheet[`V${nextRow}`] = { v: savedUser.updatedState };
    worksheet[`W${nextRow}`] = { v: savedUser.updatedCountry };
    worksheet[`X${nextRow}`] = { v: savedUser.updatedZipcode };
    worksheet[`Y${nextRow}`] = { v: savedUser.linkedInProfile };
    worksheet[`Z${nextRow}`] = { v: savedUser.notes };
    worksheet[`AA${nextRow}`] = { v: savedUser.initials };
    worksheet[`AB${nextRow}`] = { v: new Date(savedUser.dataUpdatedAsOn).toISOString() };
    worksheet[`AC${nextRow}`] = { v: savedUser.userId };

    decodedRange.e.r = nextRow - 1;
    worksheet["!ref"] = xlsx.utils.encode_range(decodedRange);

    xlsx.writeFile(workbook, filePath);

    res.status(201).json({ message: "User added successfully", data: savedUser });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/update-user/:slNo", async (req, res) => {
  console.log('now inside the update-user/:slNo section');
  // const { slNo } = req.params;
  const { name,
    organization,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    zipcode,
    phoneNumber,
    regCode,
    agentAttorney,
    dateOfPatent,
    agentLicensed,
    firmOrOrganization,
    updatedPhoneNumber,
    emailAddress,
    updatedOrganization,
    firmUrl,
    updatedAddress,
    updatedCity,
    updatedState,
    updatedCountry,
    updatedZipcode,
    linkedInProfile,
    notes,
    initials,
    dataUpdatedAsOn } = req.body;

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      // { slNo: slNo+1 },
      { name,
        organization,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        zipcode,
        phoneNumber,
        regCode,
        agentAttorney,
        dateOfPatent,
        agentLicensed,
        firmOrOrganization,
        updatedPhoneNumber,
        emailAddress,
        updatedOrganization,
        firmUrl,
        updatedAddress,
        updatedCity,
        updatedState,
        updatedCountry,
        updatedZipcode,
        linkedInProfile,
        notes,
        initials,
        dataUpdatedAsOn },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating user." });
  }
});

router.put("/update-users", async (req, res) => {
  console.log("now inside the update-users section");
  const users = req.body;

  try {
    const updatePromises = users.map(async (user) => {
      const { slNo } = user;

      const updatedUser = await UserModel.findOneAndUpdate(
        { slNo }, // Match user by slNo
        { ...user }, // Update with user data
        { new: true } // Return updated document
      );

      return updatedUser;
    });

    const updatedUsers = await Promise.all(updatePromises);

    const filePath = path.resolve(
      __dirname,
      "../insertData/ActiveAttorneyRoster3.xlsx"
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    updatedUsers.forEach((user, index) => {
      const row = index + 2;

      worksheet[`B${row}`] = { v: user.name };
      worksheet[`C${row}`] = { v: user.organization };
      worksheet[`D${row}`] = { v: user.addressLine1 };
      worksheet[`E${row}`] = { v: user.addressLine2 };
      worksheet[`F${row}`] = { v: user.city };
      worksheet[`G${row}`] = { v: user.state };
      worksheet[`H${row}`] = { v: user.country };
      worksheet[`I${row}`] = { v: user.zipcode };
      worksheet[`J${row}`] = { v: user.phoneNumber };
      worksheet[`K${row}`] = { v: user.regCode };
      worksheet[`L${row}`] = { v: user.agentAttorney };
      worksheet[`M${row}`] = { v: user.dateOfPatent };
      worksheet[`N${row}`] = { v: user.agentLicensed };
      worksheet[`O${row}`] = { v: user.firmOrOrganization };
      worksheet[`P${row}`] = { v: user.updatedPhoneNumber };
      worksheet[`Q${row}`] = { v: user.emailAddress };
      worksheet[`R${row}`] = { v: user.updatedOrganization };
      worksheet[`S${row}`] = { v: user.firmUrl };
      worksheet[`T${row}`] = { v: user.updatedAddress };
      worksheet[`U${row}`] = { v: user.updatedCity };
      worksheet[`V${row}`] = { v: user.updatedState };
      worksheet[`W${row}`] = { v: user.updatedCountry };
      worksheet[`X${row}`] = { v: user.updatedZipcode };
      worksheet[`Y${row}`] = { v: user.linkedInProfile };
      worksheet[`Z${row}`] = { v: user.notes };
      worksheet[`AA${row}`] = { v: user.initials };
      worksheet[`AB${row}`] = { v: user.dataUpdatedAsOn };
    });

    xlsx.writeFile(workbook, filePath);

    res.status(200).json({
      message: "All users updated successfully and Excel file updated.",
      data: updatedUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "An error occurred." });
  }
});

router.get("/fetch-users", async (req, res) => {
  console.log('now inside the fetch users section');

  try {
    const userId = req.query.userId;
    console.log("Received userId:", userId);

    // Check if userId exists in the query
    if (!userId) {
      console.error("No userId provided");
      console.log(process.env.NODE_ENV);

      return res.status(400).json({ error: "UserId is required" });
    }

    // Query the database
    const users = await UserModel.find({userId: userId});
    // console.log("Fetched users:", users);

    // Check if users are found
    if (!users.length) {
      console.error(`No data found for userId: ${userId}`);
      return res.status(404).json({ message: "No data found for this userId" });
    }

    res.status(200).json({
      message: "Data fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

router.get("/all-users", async (req, res) => {
  console.log('now inside the all users section');

  try {
    const users = await UserModel.find();
    
    if (!users.length) {
      console.error(`No data found for userId: ${userId}`);
      return res.status(404).json({ message: "No data found for this userId" });
    }
    res.status(200).json({
      message: "Data fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});


router.get("/all-users", async (req, res) => {
  try {
    const users = await UserLoginsModel.find();
    console.log("Fetched users:", users);  // Log the users fetched from the database

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json({ data: users });
  } catch (err) {
    console.error("Error fetching users:", err);  // Log any errors
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});


module.exports = router;