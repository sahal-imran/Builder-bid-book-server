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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const post_1 = __importDefault(require("./routes/post"));
let PORT = process.env.APP_LISTEN_PORT || 4000;
let MODE = process.env.MODE;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: MODE === "dev"
        ? process.env.REQUEST_ORIGIN_DEVELOPMENT
        : process.env.REQUEST_ORIGIN_PRODUCTION,
    credentials: true, //access-control-allow-credentials:true
}));
// Home route
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // res.send(path.join(__dirname, "../index.html"));
    res.send(`Running on port ${PORT}`);
}));
const URL = MODE === "dev"
    ? process.env.DATABASE_URL_DEVELOPMENT
    : process.env.DATABASE_URL_PRODUCTION;
mongoose_1.default
    .connect(URL, {})
    .then(() => {
    app.listen(PORT, () => {
        console.log(`app is listing on port ${PORT}`);
    });
    // LogInfo("Path", __dirname)
    app.use(auth_1.default);
    app.use(post_1.default);
})
    .catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map