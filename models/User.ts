import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import { LogError } from "src/utils/Log";
// import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyPhone: {
    type: Number,
    required: true,
  },
  csiDivision: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// ==> When user will login this function will call to generate token and store it in database for authentication
// userSchema.methods.generateAuthToken = async function () {
//   try {
//     let Token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
//     this.token = Token;
//     await this.save();
//     return Token;
//   } catch (error) {
//     console.log("Error while generation auth token", error);
//   }
// };

// Comparing the user entered password with the relavent user password (got via email)
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  try {
    return await bcrypt.compare(candidatePassword, userPassword);
  } catch (error) {
    console.log("Failed to compare user password via bcrypt");
  }
};

// Encrypting the user password via bcrypt before storing the document to database
userSchema.pre("save", async function () {
  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    console.log("Error while ecncrypting password");
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
