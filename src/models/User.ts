import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
    },
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
    },
    subscription: {
        type: Array,
        default: null
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: null },
    lastUpdateBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null,
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;