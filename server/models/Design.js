const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    jsonData: {
      type: Object,
      required: true,
      // This will store the complete fabric.js canvas state
    },
    thumbnailUrl: {
      type: String,
      default: "",
      // URL to preview image stored in Cloudinary/AWS S3
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Index for faster queries
designSchema.index({ userId: 1, createdAt: -1 });

// Update the updatedAt field before saving
designSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for getting design age
designSchema.virtual("age").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Method to get design summary (without heavy jsonData)
designSchema.methods.getSummary = function () {
  return {
    _id: this._id,
    title: this.title,
    thumbnailUrl: this.thumbnailUrl,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Static method to find user designs
designSchema.statics.findUserDesigns = function (userId) {
  return this.find({ userId })
    .select("title thumbnailUrl createdAt updatedAt")
    .sort({ createdAt: -1 });
};

const Design = mongoose.model("Design", designSchema);

module.exports = Design;
