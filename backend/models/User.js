const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  slNo: { type: Number, required: true },
  name: { type: String, required: true },
  organization: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: false },
  city: { type: String, required: true },
  state: { type: String, required: false },
  country: { type: String, required: true },
  zipcode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  regCode: { type: String, required: true },
  agentAttorney: { type: String, required: true },
  dateOfPatent: { type: String, required: false },
  agentLicensed: { type: String, required: false },
  firmOrOrganization: { type: String, required: true },
  updatedPhoneNumber: { type: String, required: false },
  emailAddress: { type: String, required: false },
  updatedOrganization: { type: String, required: true },
  firmUrl: { type: String, required: false },
  updatedAddress: { type: String, required: true },
  updatedCity: { type: String, required: true },
  updatedState: { type: String, required: true },
  updatedCountry: { type: String, required: true },
  updatedZipcode: { type: String, required: true },
  linkedInProfile: { type: String, required: false },
  notes: { type: String, required: true },
  initials: { type: String, required: true },
  dataUpdatedAsOn: { type: Date, required: true },
});


module.exports = mongoose.model("exceldatas", UserSchema);