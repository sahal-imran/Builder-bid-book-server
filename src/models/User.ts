import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { LogError } from "../utils/Log";

const userSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        lowercase: true,
    },
    companyEmail: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
        lowercase: true,
    },
    county: {
        type: String,
        required: true,
        lowercase: true,
    },
    csiDivision: {
        type: String,
        lowercase: true,
        default: null
    },
    role: {
        type: String,
        required: true,
        lowercase: true,
    },
    token: {
        type: String,
        default: null
    },
    subscription: {
        type: Array,
        default: null
    }
});

// ==> When user will login this function will call to generate token and store it in database for authentication
userSchema.methods.generateAuthToken = async function () {
    try {
        let Token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.token = Token;
        await this.save();
        return Token;
    } catch (error) {
        LogError("Login(generateAuthToken)", error)
    }
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;