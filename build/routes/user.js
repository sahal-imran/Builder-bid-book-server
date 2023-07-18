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
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Get all venders(Sub-contractors) with filters and pagination;
router.post("/subcontractors", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== "generalContractor")
        res.status(401).json({ message: "Oops! Not generalContractor" }); // Unauthorized
    try {
        const { page } = req.query;
        const pageNumber = parseInt(page);
        const recordsPerPage = 10;
        const filters = req.body;
        const SBs = yield User_1.default.find(Object.assign(Object.assign({}, filters), { role: "subContractor" })).limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const totalRecords = SBs.length;
        res.status(200).json({ SBs, totalRecords });
    }
    catch (error) {
        (0, Log_1.LogError)("/user/subcontractors", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// get user data by ID
router.get("/user", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const _id = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id;
        const user = yield User_1.default.findById({ _id });
        res.status(200).json({ user });
    }
    catch (error) {
        (0, Log_1.LogError)("/user/user", error);
        res.status(500).json({ message: "Server error" });
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map