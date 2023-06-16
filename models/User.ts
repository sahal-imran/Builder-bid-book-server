import mongoose from "mongoose"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({

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

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;