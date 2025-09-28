const Design = require("../models/Design");
const User = require("../models/User");

// Get all designs for authenticated user
const getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("title thumbnailUrl createdAt");

    res.json({
      success: true,
      designs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching designs",
      error: error.message,
    });
  }
};

// Get single design by ID
const getDesignById = async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    res.json({
      success: true,
      design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching design",
      error: error.message,
    });
  }
};

// Create new design
const createDesign = async (req, res) => {
  try {
    const { title, jsonData, thumbnailUrl } = req.body;

    if (!title || !jsonData) {
      return res.status(400).json({
        success: false,
        message: "Title and design data are required",
      });
    }

    const newDesign = new Design({
      userId: req.user._id,
      title: title.trim(),
      jsonData,
      thumbnailUrl: thumbnailUrl || "",
      createdAt: new Date(),
    });

    const savedDesign = await newDesign.save();

    res.status(201).json({
      success: true,
      message: "Design created successfully",
      design: savedDesign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating design",
      error: error.message,
    });
  }
};

// Update existing design
const updateDesign = async (req, res) => {
  try {
    const { title, jsonData, thumbnailUrl } = req.body;
    const designId = req.params.id;

    const design = await Design.findOne({
      _id: designId,
      userId: req.user._id,
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    // Update fields if provided
    if (title) design.title = title.trim();
    if (jsonData) design.jsonData = jsonData;
    if (thumbnailUrl) design.thumbnailUrl = thumbnailUrl;

    const updatedDesign = await design.save();

    res.json({
      success: true,
      message: "Design updated successfully",
      design: updatedDesign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating design",
      error: error.message,
    });
  }
};

// Delete design
const deleteDesign = async (req, res) => {
  try {
    const designId = req.params.id;

    const design = await Design.findOneAndDelete({
      _id: designId,
      userId: req.user._id,
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    res.json({
      success: true,
      message: "Design deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting design",
      error: error.message,
    });
  }
};

// Duplicate design
const duplicateDesign = async (req, res) => {
  try {
    const originalDesign = await Design.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!originalDesign) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    const duplicatedDesign = new Design({
      userId: req.user._id,
      title: `${originalDesign.title} - Copy`,
      jsonData: originalDesign.jsonData,
      thumbnailUrl: originalDesign.thumbnailUrl,
      createdAt: new Date(),
    });

    const savedDesign = await duplicatedDesign.save();

    res.status(201).json({
      success: true,
      message: "Design duplicated successfully",
      design: savedDesign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error duplicating design",
      error: error.message,
    });
  }
};

// Export design as image (placeholder for canvas export logic)
const exportDesign = async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    // In a real implementation, you would:
    // 1. Use the jsonData to recreate the canvas
    // 2. Export it as PNG/PDF
    // 3. Return the download URL or file

    res.json({
      success: true,
      message: "Export feature will be implemented on frontend",
      jsonData: design.jsonData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error exporting design",
      error: error.message,
    });
  }
};

module.exports = {
  getDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
  duplicateDesign,
  exportDesign,
};
