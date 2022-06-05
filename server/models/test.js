const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema(
  {
    one: String,
    tow: String,
  },
  { timestamps: true }
);
const Test = mongoose.model("Test", TestSchema);
module.exports = Test;
