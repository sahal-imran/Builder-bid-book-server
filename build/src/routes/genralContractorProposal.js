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
const GeneralContractorProposal_1 = __importDefault(require("../../models/GeneralContractorProposal"));
const router = express_1.default.Router();
router.get("/generalcontractorproposals", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allGeneralContractorProposals = yield GeneralContractorProposal_1.default.find();
        res.status(200).json({
            status: "Success",
            data: {
                allGeneralContractorProposals,
            },
        });
    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            messege: err,
        });
    }
}));
router.get("/generalcontractorproposals/:keyword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchedKeyword = req.params.keyword;
        const filterdGeneralContractorProposals = yield GeneralContractorProposal_1.default.find({
            keywords: { $in: [searchedKeyword] },
        });
        res.status(200).json({
            status: "Success",
            data: {
                filterdGeneralContractorProposals,
            },
        });
    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            messege: err,
        });
    }
}));
router.post("/generalcontractorproposals", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { csiDivision, county, pdfFile, keywords } = req.body;
        const newGeneralContractorProposal = yield GeneralContractorProposal_1.default.create({ csiDivision, county, pdfFile, keywords });
        res.status(201).json({
            status: "Success",
            data: {
                newGeneralContractorProposal,
            },
        });
    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            messege: err,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=genralContractorProposal.js.map