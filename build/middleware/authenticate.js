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
const Log_1 = require("../utils/Log");
const Session_1 = __importDefault(require("../models/Session"));
const MongoDBErrorController_1 = __importDefault(require("../utils/MongoDBErrorController"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
        req.token = authHeader.split(" ")[1]; // Extract the token from the header
    }
    try {
        const token = req.token;
        const found = yield Session_1.default.findOne({ token }).populate("user");
        if (found) {
            req.user = found === null || found === void 0 ? void 0 : found.user;
            next();
        }
        else
            res.status(401).json({ message: "Oops! Unauthorized" }); // Unauthorized
    }
    catch (error) {
        const errorHandler = (0, MongoDBErrorController_1.default)(error);
        if (errorHandler.status === 403) {
            (0, Log_1.LogWarning)("/authenticate(Validation)", errorHandler.message);
            res.status(errorHandler.status).json({ message: errorHandler.message });
        }
        else {
            (0, Log_1.LogError)("authenticate", error);
            res.status(500).json({ message: "Server error" });
        }
    }
});
exports.default = authenticate;
//# sourceMappingURL=authenticate.js.map