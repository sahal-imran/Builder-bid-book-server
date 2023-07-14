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
const MongoDBErrorController_1 = __importDefault(require("../utils/MongoDBErrorController"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const Bid_1 = __importDefault(require("../models/Bid"));
const router = express_1.default.Router();
// Create Bid
router.post("/bid", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== "subContractor")
        res.status(401).json({ message: "Oops! Unauthorized, Sub Contractor can bid only!" }); // Unauthorized
    try {
        const { postId } = req.query;
        const subContractor_ID = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id;
        const bid = Object.assign(Object.assign({}, req.body), { post: postId, SC: subContractor_ID });
        yield Bid_1.default.create(bid);
        res.status(201).json({ message: "Proposal posted successfully" });
    }
    catch (error) {
        const errorHandler = (0, MongoDBErrorController_1.default)(error);
        if ((errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler.status) === 403) {
            (0, Log_1.LogWarning)("/Bid(Validation)", errorHandler.message);
            res.status(errorHandler.status).json({ message: errorHandler.message });
        }
        else {
            (0, Log_1.LogError)("/Bid", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}));
// Get all bids with pagination
router.get("/bid", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.role) !== "subContractor")
        res.status(401).json({ message: "Oops! Unauthorized, Sub Contractor can bid only!" }); // Unauthorized
    try {
        const { page } = req.query.page;
        const pageNumber = parseInt(page);
        const recordsPerPage = 10;
        const bids = yield Bid_1.default.find().limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const totalRecords = yield Bid_1.default.find().count();
        res.status(200).json({ bids, totalRecords });
    }
    catch (error) {
        (0, Log_1.LogError)("/bid/:page", error);
        res.status(500).json({ message: "Server error" });
    }
}));
exports.default = router;
//# sourceMappingURL=bid.js.map