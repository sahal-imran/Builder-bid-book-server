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
// import bcrypt from "bcrypt"
// Instances
const router = express_1.default.Router();
// Sign up
// router.get("/signup", async (req: Request, res: Response) => {
//     try {
//         const body = req.body;
//         const password = await bcrypt.hash(body.password, 12)
//         const createUser = await User.create({ ...body, password });
//         sendMail(createUser?.companyEmail, "Welcome", "Hi Welcome to the app", (error) => {
//             if (error) LogError("/signup(sendMail)", error)
//             res.status(201).json({ message: "Registered" })
//         })
//     } catch (error) {
//         const errorHandler: any = MongoDBErrorController(error)
//         if (errorHandler.status === 403) {
//             LogWarning("/signup(Validation)", errorHandler.message)
//             res.status(errorHandler.status).json({ message: errorHandler.message })
//         }
//         else if (errorHandler.status === 409) {
//             LogWarning("/signup(Duplication)", errorHandler.message)
//             res.status(errorHandler.status).json({ message: errorHandler.message })
//         }
//         else {
//             LogError("/signup", error)
//             res.status(500).json({ message: "Server error" })
//         }
//     }
// });
// Sign up
router.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map