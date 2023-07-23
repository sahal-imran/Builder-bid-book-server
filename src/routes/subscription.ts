import express, { Request, Response } from 'express';
import { LogError } from '../utils/Log';
import MongoDBErrorController from '../utils/MongoDBErrorController';
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
    const { paymentMethodId } = req.body;
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
        let price = req?.user?.role === "subContractor" ? "price_1NWzjbCca3TdSJXphb19wGYu" : "price_1NX17ZCca3TdSJXpzMtMrdAf"
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price }],
            billing_cycle_anchor: nextMonthTimestamp,
            trial_end: currentTimestamp,
        });
        await Subscription.create({ customer, subscription, user: req?.user?._id })
        res.status(200).json({ message: "Subscribed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        LogError("subscription(create-subscription)", error)
    }
})

export default router