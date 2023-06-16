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
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
        pass: process.env.NEXT_PUBLIC_NODEMAILER_APP_PASSWORD,
    },
});
const sendMail = (receiver, subject, message, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        from: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
        to: receiver,
        subject: subject,
        text: message,
    };
    transporter.sendMail(options, (error, info) => {
        if (error) {
            cb(error);
        }
        else {
            return cb();
        }
    });
});
exports.default = sendMail;
//# sourceMappingURL=sendMail.js.map