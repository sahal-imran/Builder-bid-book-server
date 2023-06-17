import mongoose from "mongoose";

const genralContractorProposalSchema = new mongoose.Schema({
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

const GeneralContractorProposal =
  mongoose.models.GeneralContractorProposal ||
  mongoose.model("GeneralContractorProposal", genralContractorProposalSchema);

export default GeneralContractorProposal;
