const mongoose = require("mongoose");

const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  jsonData: {
    type: Object,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    default: "",
  },
  source: {
    type: String,
    enum: ["blank", "template"],
    default: "blank",
  },
  // ADD THIS NEW FIELD
  access: {
    type: String,
    enum: ["private", "public"],
    default: "private",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
designSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Design", designSchema);
