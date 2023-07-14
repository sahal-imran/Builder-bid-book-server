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
const Post_1 = __importDefault(require("../models/Post"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const router = express_1.default.Router();
// Create post
router.post("/post", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== "generalContractor")
            res.status(401).json({ message: "Oops! Unauthorized" }); // Unauthorized
        const newPost = req.body;
        yield Post_1.default.create(Object.assign(Object.assign({}, newPost), { gc: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id }));
        res.status(201).json({ message: "Post created successfully" });
    }
    catch (error) {
        const errorHandler = (0, MongoDBErrorController_1.default)(error);
        if ((errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler.status) === 403) {
            (0, Log_1.LogWarning)("/post(Validation)", errorHandler.message);
            res.status(errorHandler.status).json({ message: errorHandler.message });
        }
        else {
            (0, Log_1.LogError)("/post", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}));
// Get all posts with pagination
router.get("/post", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.query.page;
        const pageNumber = parseInt(page);
        const recordsPerPage = 10;
        const posts = yield Post_1.default.find().limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const totalRecords = yield Post_1.default.find().count();
        res.status(200).json({ posts, totalRecords });
    }
    catch (error) {
        (0, Log_1.LogError)("/post/:page", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// get Single post by id
router.get("/post/:id", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield Post_1.default.findById({ _id: id });
        res.status(200).json({ post });
    }
    catch (error) {
        (0, Log_1.LogError)("/postById/:id", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// get Single posts by CSI_Division
router.post("/post/CSIDivision", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.query;
        const pageNumber = parseInt(page);
        const recordsPerPage = 10;
        const filters = req.body;
        const posts = yield Post_1.default.find(filters).populate("gc").limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const totalRecords = posts.length;
        res.status(200).json({ posts, totalRecords });
    }
    catch (error) {
        (0, Log_1.LogError)("/post/CSIDivision", error);
        res.status(500).json({ message: "Server error" });
    }
}));
exports.default = router;
//# sourceMappingURL=post.js.map