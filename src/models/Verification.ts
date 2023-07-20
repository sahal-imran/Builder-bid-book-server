import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    expireAt: {
        type: Date,
        index: { expires: '10m' } // Set the expiration time here, '10m'
    }
});

const Verification = mongoose.models.Verification || mongoose.model("Verification", verificationSchema);

export default Verification;