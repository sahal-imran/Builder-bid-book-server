import express from "express";
import GeneralContractorProposal from "../../models/GeneralContractorProposal";

const router = express.Router();

router.get("/generalcontractorproposals", async (req, res) => {
  try {
    const allGeneralContractorProposals =
      await GeneralContractorProposal.find();
    res.status(200).json({
      status: "Success",
      data: {
        allGeneralContractorProposals,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      messege: err,
    });
  }
});

router.get("/generalcontractorproposals/:keyword", async (req, res) => {
  try {
    const searchedKeyword = req.params.keyword;
    const filterdGeneralContractorProposals =
      await GeneralContractorProposal.find({
        keywords: { $in: [searchedKeyword] },
      });
    res.status(200).json({
      status: "Success",
      data: {
        filterdGeneralContractorProposals,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      messege: err,
    });
  }
});
router.post("/generalcontractorproposals", async (req, res) => {
  try {
    const { csiDivision, county, pdfFile, keywords } = req.body;
    const newGeneralContractorProposal = await GeneralContractorProposal.create(
      { csiDivision, county, pdfFile, keywords }
    );
    res.status(201).json({
      status: "Success",
      data: {
        newGeneralContractorProposal,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      messege: err,
    });
  }
});

export default router;
