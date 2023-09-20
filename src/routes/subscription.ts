import express, { Request, Response } from 'express';
import { LogError } from '../utils/Log';
import authenticate from '../middleware/authenticate';
import Stripe from 'stripe';
import Subscription from '../models/Subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_kEY, {
    apiVersion: '2022-11-15'
});

const router = express.Router();

interface IRequest extends Request {
    user: any;
}

router.post("/create-subscription", authenticate, async (req: IRequest, res: Response) => {
    const { paymentMethodId, coupon } = req.body;
    try {
        // create customer
        const customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            email: req?.user?.companyEmail,
            name: `${req?.user?.firstName} ${req?.user?.lastName}`,
            phone: req?.user?.phone,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // Calculate the timestamp for the current date and time
        const currentTimestamp = Math.floor(Date.now() / 1000);
        // Calculate the timestamp for the 1st day of the next month
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);
        const nextMonthTimestamp = Math.floor(nextMonth.getTime() / 1000);

        // Create Subscription
        let price = req?.user?.role === "subContractor" ? process.env.SUBCONTRACTOR_PRODUCT_ID : process.env.GENERAL_CONTRACTOR_PRODUCT_ID
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price }],
            coupon
        });
        await Subscription.create({ customer: customer?.id, subscription: subscription?.id, user: req?.user?._id, status: "active" })
        res.status(200).json({ message: "Subscribed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        LogError("subscription(create-subscription)", error)
    }
})

router.post("/cancel-subscription", authenticate, async (req: IRequest, res: Response) => {
    const user = req?.user?._id
    try {
        const match = await Subscription.findOne({ user });
        const subscriptions = await stripe.subscriptions.list({
            customer: match?.customer?.id,
            status: 'active', // You can also filter by other subscription statuses if needed
        });
        const subscriptionId = subscriptions.data[0].id;
        const customer = subscriptions.data[0]?.customer;
        await stripe.subscriptions.del(subscriptionId);
        match.status = 'cancelled';
        match.updatedAt = new Date().toISOString();
        await match.save();
        res.status(200).json({ message: 'Subscription canceled successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        LogError("subscription(cancel-subscription)", error)
    }
})

router.post("/reactivate-subscription", authenticate, async (req: IRequest, res: Response) => {
    const user = req?.user?._id
    try {
        const match = await Subscription.findOne({ user, status: "cancelled" });
        if (!match) return res.status(404).json({ error: 'Subscription not found or cannot be reactivated.' });

        let price = req?.user?.role === "subContractor" ? process.env.SUBCONTRACTOR_PRODUCT_ID : process.env.GENERAL_CONTRACTOR_PRODUCT_ID
        const reactivatedSubscription = await stripe.subscriptions.create({
            customer: match?.customer,
            items: [{ price }]
        });
        // Update the status of the new subscription in your local database
        match.status = 'reactivate';
        match.subscription = reactivatedSubscription.id; // Store the new subscription ID
        match.updatedAt = new Date().toISOString();
        await match.save();
        res.status(200).json({ message: 'Subscription reactivated successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        LogError("subscription(reactivate-subscription)", error)
    }
})


export default router