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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { LogError } from "src/utils/Log";
// import jwt from "jsonwebtoken"
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "User must have an email"],
        unique: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    companyPhone: {
        type: Number,
        required: true,
    },
    csiDivision: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});
// ==> When user will login this function will call to generate token and store it in database for authentication
// userSchema.methods.generateAuthToken = async function () {
//   try {
//     let Token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
//     this.token = Token;
//     await this.save();
//     return Token;
//   } catch (error) {
//     console.log("Error while generation auth token", error);
//   }
// };
// Comparing the user entered password with the relavent user password (got via email)
userSchema.methods.comparePassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield bcrypt_1.default.compare(candidatePassword, userPassword);
        }
        catch (error) {
            console.log("Failed to compare user password via bcrypt");
        }
    });
};
// Encrypting the user password via bcrypt before storing the document to database
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            this.password = yield bcrypt_1.default.hash(this.password, 12);
        }
        catch (error) {
            console.log("Error while ecncrypting password");
        }
    });
});
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map