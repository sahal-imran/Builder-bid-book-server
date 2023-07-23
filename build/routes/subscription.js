"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Log_1 = require("../utils/Log");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const stripe_1 = __importDefault(require("stripe"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_kEY, {
    apiVersion: '2022-11-15'
});
const router = express_1.default.Router();
router.post("/create-subscription", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { paymentMethodId } = req.body;
    try {
        // create customer
        const customer = yield stripe.customers.create({
            payment_method: paymentMethodId,
            email: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyEmail,
            name: `${(_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.firstName} ${(_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.lastName}`,
            phone: (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.phone,
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
        let price = ((_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.role) === "subContractor" ? "price_1NWzjbCca3TdSJXphb19wGYu" : "price_1NX17ZCca3TdSJXpzMtMrdAf";
        const subscription = yield stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price }],
            billing_cycle_anchor: nextMonthTimestamp,
            trial_end: currentTimestamp,
        });
        yield Subscription_1.default.create({ customer, subscription, user: (_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f._id });
        res.status(200).json({ message: "Subscribed" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        (0, Log_1.LogError)("subscription(create-subscription)", error);
    }
}));
exports.default = router;
//# sourceMappingURL=subscription.js.map