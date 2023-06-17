"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const genralContractorProposalSchema = new mongoose_1.default.Schema({
    csiDivision: {
        type: String,
        required: [true, "Proposal must have a Csi Division"],
    },
    county: {
        type: String,
        required: [true, "Proposal must have a County"],
    },
    keywords: [
        {
            type: String,
            required: true,
        },
    ],
    pdfFile: {
        type: String,
        required: [true, "Proposal must have a pdf File"],
    },
});
const GeneralContractorProposal = mongoose_1.default.models.GeneralContractorProposal ||
    mongoose_1.default.model("GeneralContractorProposal", genralContractorProposalSchema);
exports.default = GeneralContractorProposal;
//# sourceMappingURL=GeneralContractorProposal.js.map