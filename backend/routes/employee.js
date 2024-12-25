const express = require("express");
const UserModel = require("../models/User"); 
const xlsx = require("xlsx");
const path = require("path");

const router = express.Router();

router.post("/add-user", async (req, res) => {
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
  const { slNo } = req.params;
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
      { slNo: slNo+1 },
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
  const users = req.body; 

  try {
    
    const updatePromises = users.map((user) =>
      UserModel.findOneAndUpdate(
        { slNo: user.slNo }, 
        {
          name: user.name,
          organization: user.organization,
          addressLine1: user.addressLine1,
          addressLine2: user.addressLine2,
          city: user.city,
          state: user.state,
          country: user.country,
          zipcode: user.zipcode,
          phoneNumber: user.phoneNumber,
          regCode: user.regCode,
          agentAttorney: user.agentAttorney,
          dateOfPatent: user.dateOfPatent,
          agentLicensed: user.agentLicensed,
          firmOrOrganization: user.firmOrOrganization,
          updatedPhoneNumber: user.updatedPhoneNumber,
          emailAddress: user.emailAddress,
          updatedOrganization: user.updatedOrganization,
          firmUrl: user.firmUrl,
          updatedAddress: user.updatedAddress,
          updatedCity: user.updatedCity,
          updatedState: user.updatedState,
          updatedCountry: user.updatedCountry,
          updatedZipcode: user.updatedZipcode,
          linkedInProfile: user.linkedInProfile,
          notes: user.notes,
          initials: user.initials,
          dataUpdatedAsOn: user.dataUpdatedAsOn,
        },
        { new: true }
      )
    );


    const updatedUsers = await Promise.all(updatePromises);
    
    const filePath = path.join(__dirname, "../insertData/activeAttorneyRoster.xlsx");
    console.log(__dirname);
    
    const workbook = xlsx.readFile(filePath);

    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    
    updatedUsers.forEach((user, index) => {
      const row = index + 2; 

      
      worksheet[`A${row}`] = { v: user.slNo }; 
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
      worksheet[`Z${row}`] = { v: user.notes}; 
      worksheet[`AA${row}`] = { v: user.initials  }; 
      worksheet[`AB${row}`] = { v: user.dataUpdatedAsOn  };


    });

    
    xlsx.writeFile(workbook, filePath);

    res.status(200).json({
      message: "All users updated successfully and Excel file updated.",
      data: updatedUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating users." });
  }
});

router.get("/fetch-users", async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log("Received userId:", userId);

    // Check if userId exists in the query
    if (!userId) {
      console.error("No userId provided");
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