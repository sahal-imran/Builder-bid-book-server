import express, { Request, Response } from 'express';
import { LogError, LogInfo, LogWarning } from '../utils/Log';
import MongoDBErrorController from '../utils/MongoDBErrorController';
import Post from '../models/Post';
import authenticate from '../middleware/authenticate';
import Stripe from 'stripe';

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
        // Calculate the timestamp for the same date of the next month
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);
        const nextMonthTimestamp = Math.floor(nextMonth.getTime() / 1000);

        // Create Subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: 'price_1NWzjbCca3TdSJXphb19wGYu' }],
            billing_cycle_anchor: currentTimestamp,
            trial_end: nextMonthTimestamp,
        });
        res.status(200).json({ subscriptionId: subscription.id, Customer: customer.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
        LogError("subscription(create-subscription)", error)
    }
})

export default router