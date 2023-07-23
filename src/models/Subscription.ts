import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    customer: {
        type: Object,
        required: true
    },
    subscription: {
        type: Object,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: null },
});

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);

export default Subscription;