const express = require("express");
const UserModel = require("../models/User"); 
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.post("/add-user", async (req, res) => {
  console.log('now inside the add-user section');
  const { slNo: nextSlNo,
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
    dataUpdatedAsOn } = req.body;

  try {

    const lastUser = await UserModel.findOne().sort({ slNo: -1 }).exec();
    const nextSlNo = lastUser ? lastUser.slNo + 1 : 1; 

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
      dataUpdatedAsOn

    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User added successfully",
      data: savedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while adding user." });
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

module.exports = router;