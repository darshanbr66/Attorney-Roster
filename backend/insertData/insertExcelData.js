const xlsx = require("xlsx");
const User = require("../models/User"); 
const mongoose = require("mongoose");
require('dotenv').config();

const insertDataFromExcel = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Connected to MongoDB");

    // Define file paths
    const filePaths = [
      "C:/Users/ADMIN/OneDrive/Desktop/Task/backend/insertData/ActiveAttorneyRoster3.xlsx"
    ];

    let allUsers = [];

    for (const filePath of filePaths) {
      // Read each Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Map sheet data to your schema
      const users = sheetData.map((row) => ({
        slNo: row["Sl No"],
        name: row["Name"],
        organization: row["Organization/Law Firm Name"],
        addressLine1: row["Address Line 1"],
        addressLine2: row["Address Line 2"],
        city: row["City"],
        state: row["State"],
        country: row["Country"],
        zipcode: row["Zipcode"],
        phoneNumber: row["Phone Number"],
        regCode: row["Reg Code"],
        agentAttorney: row["Agent/Attorney"],
        dateOfPatent: row["Date of Patent Agent Licensed "],
        agentLicensed: row["Date of Patent Attorney Licensed"],
        firmOrOrganization: row["Firm or Organization"],
        updatedPhoneNumber: row["Updated Phone Number"],
        emailAddress: row["Email Address"],
        updatedOrganization: row["Updated Organization/Law Firm Name"],
        firmUrl: row["Firm/Organization URL"],
        updatedAddress: row["Updated Address"],
        updatedCity: row["Updated City"],
        updatedState: row["Updated State"],
        updatedCountry: row["Updated Country"],
        updatedZipcode: row["Updated Zipcode"],
        linkedInProfile: row["LinkedIn Profile URL"],
        notes: row["Notes"],
        initials: row["Initials"],
        dataUpdatedAsOn: row["Data Updated as on"],
        userId: row["User Id"],
      }));

      allUsers = allUsers.concat(users);
    }

    // Insert all users into the database
    await User.insertMany(allUsers);
    console.log("Data inserted successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
};

insertDataFromExcel();