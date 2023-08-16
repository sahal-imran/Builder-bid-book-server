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
const Post_1 = __importDefault(require("../models/Post"));
const router = express_1.default.Router();
// Create Bid
router.post("/bid", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== "subContractor") {
        res.status(401).json({ message: "Oops! Unauthorized, Sub Contractor can bid only!" }); // Unauthorized
        return;
    }
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
router.get("/bids", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.role) !== "subContractor") {
        res.status(401).json({ message: "Oops! Unauthorized, Sub Contractor can bid only!" }); // Unauthorized
        return;
    }
    try {
        const { page } = req.query.page;
        const pageNumber = parseInt(page);
        const recordsPerPage = 10;
        const bids = yield Bid_1.default.find().limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const totalRecords = bids.length;
        res.status(200).json({ bids, totalRecords });
    }
    catch (error) {
        (0, Log_1.LogError)("/bid/:page", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// Get bids/proposal for a specific GC with pagination
router.get("/GCbids", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    if (((_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.role) !== "generalContractor") {
        res.status(401).json({ message: "Oops! Unauthorized, General Contract can access proposals only!" }); // Unauthorized
        return;
    }
    try {
        const { page } = req.query.page;
        const pageNumber = parseInt(page);
        const recordsPerPage = 10;
        const generalContractor_ID = (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e._id;
        const postIDs = yield Post_1.default.find({ gc: generalContractor_ID }, { _id: 1 }).sort({ createdAt: 1 }).limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const bids = yield Bid_1.default.find({ post: { $in: postIDs === null || postIDs === void 0 ? void 0 : postIDs.map(obj => obj._id) } }).populate("SC").populate("post").sort({ createdAt: -1 });
        const totalRecords = bids.length;
        res.status(200).json({ bids, totalRecords });
    }
    catch (error) {
        (0, Log_1.LogError)("/bid/:page", error);
        res.status(500).json({ message: "Server error" });
    }
}));
exports.default = router;
//# sourceMappingURL=bid.js.map