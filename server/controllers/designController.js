const Design = require("../models/Design");
const User = require("../models/User");

// Get all designs (keep as is)
const getDesigns = async (req, res) => {
  try {
    const designs = await Design.find();
    res.json({ success: true, designs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching designs",
      error: error.message,
    });
  }
};

// Get designs by userId - FIXED
const getDesignsByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found.",
      });
    }

    const designs = await Design.find({ userId: userId }).sort({
      createdAt: -1,
    });

    console.log(`Found ${designs.length} designs for user ${userId}`);

    res.status(200).json({
      success: true,
      designs: designs,
    });
  } catch (error) {
    console.error("Error fetching designs by user ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Could not fetch designs.",
    });
  }
};

// Get single design by ID - FIXED
const getDesignById = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("Fetching design:", {
      designId: req.params.id,
      userId: String(userId),
    });

    const design = await Design.findOne({
      _id: req.params.id,
      userId: userId,
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found or you don't have permission",
      });
    }

    console.log("Design found and returned");

    res.json({
      success: true,
      design,
    });
  } catch (error) {
    console.error("Error in getDesignById:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching design",
      error: error.message,
    });
  }
};

// Create design - FIXED
const createDesign = async (req, res) => {
  try {
    const { fromTemplate, content, title, jsonData, thumbnailUrl } = req.body;
    const userId = req.user._id;

    let newDesign;

    if (fromTemplate && content) {
      newDesign = new Design({
        userId: userId,
        title: title || "Untitled Design",
        jsonData: content,
        thumbnailUrl: thumbnailUrl || "",
        source: "template",
        access: "private",
        createdAt: new Date(),
      });
    } else {
      if (!title || !jsonData) {
        return res.status(400).json({
          success: false,
          message: "Title and design data are required",
        });
      }

      newDesign = new Design({
        userId: userId,
        title: title.trim(),
        jsonData,
        thumbnailUrl: thumbnailUrl || "",
        source: "blank",
        access: "private",
        createdAt: new Date(),
      });
    }

    const savedDesign = await newDesign.save();

    return res.status(201).json({
      success: true,
      message: "Design created successfully",
      design: savedDesign,
    });
  } catch (error) {
    console.error("Error creating design:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating design",
      error: error.message,
    });
  }
};

// Update design - FIXED
const updateDesign = async (req, res) => {
  try {
    const { title, jsonData, thumbnailUrl } = req.body;
    const designId = req.params.id;
    const userId = req.user._id;

    const design = await Design.findOne({
      _id: designId,
      userId: userId,
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

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

// Delete design - FIXED
const deleteDesign = async (req, res) => {
  try {
    const designId = req.params.id;
    const userId = req.user._id;

    const design = await Design.findOneAndDelete({
      _id: designId,
      userId: userId,
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

// Duplicate design - FIXED
const duplicateDesign = async (req, res) => {
  try {
    const userId = req.user._id;

    const originalDesign = await Design.findOne({
      _id: req.params.id,
      userId: userId,
    });

    if (!originalDesign) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    const duplicatedDesign = new Design({
      userId: userId,
      title: `${originalDesign.title} - Copy`,
      jsonData: originalDesign.jsonData,
      thumbnailUrl: originalDesign.thumbnailUrl,
      access: "private",
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

// Update design access - FIXED
const updateDesignAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { access } = req.body;
    const userId = req.user._id;

    if (!["private", "public"].includes(access)) {
      return res.status(400).json({
        success: false,
        message: "Invalid access value. Must be 'private' or 'public'",
      });
    }

    const design = await Design.findOne({
      _id: id,
      userId: userId,
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found or you don't have permission",
      });
    }

    design.access = access;
    await design.save();

    res.json({
      success: true,
      message: `Design is now ${access}`,
      design,
    });
  } catch (error) {
    console.error("Error updating access:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get public design (keep as is)
const getPublicDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    if (design.access !== "public") {
      return res.status(403).json({
        success: false,
        message: "This design is private",
      });
    }

    res.json({
      success: true,
      design: {
        _id: design._id,
        title: design.title,
        jsonData: design.jsonData,
        thumbnailUrl: design.thumbnailUrl,
        width: design.width,
        height: design.height,
        backgroundColor: design.backgroundColor,
        createdAt: design.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching design",
      error: error.message,
    });
  }
};

// Export design (keep as is)
const exportDesign = async (req, res) => {
  try {
    const userId = req.user._id;

    const design = await Design.findOne({
      _id: req.params.id,
      userId: userId,
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

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
  getPublicDesign,
  updateDesignAccess,
  createDesign,
  updateDesign,
  deleteDesign,
  duplicateDesign,
  exportDesign,
  getDesignsByUserId,
};
