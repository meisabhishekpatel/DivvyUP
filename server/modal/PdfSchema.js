const mongoose = require("mongoose");

const PdfDetailsSchema = new mongoose.Schema(
  {
    group: String,
    pdf: String,
  },
  { collection: "PdfDetails" }
);

mongoose.model("PdfDetails", PdfDetailsSchema);
