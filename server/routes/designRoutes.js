const express = require("express");
const router = express.Router();
const {
  getDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
  duplicateDesign,
  exportDesign,
} = require("../controllers/designController");

// Middleware to authenticate user (you need to create this)
const { protect } = require("../middleware/authMiddleware");

// Apply authentication middleware to all routes
router.use(protect);

// GET /api/designs - Get all user designs
router.get("/", getDesigns);

// GET /api/designs/:id - Get specific design
router.get("/:id", getDesignById);

// POST /api/designs - Create new design
router.post("/", createDesign);

// PUT /api/designs/:id - Update existing design
router.put("/:id", updateDesign);

// DELETE /api/designs/:id - Delete design
router.delete("/:id", deleteDesign);

// POST /api/designs/:id/duplicate - Duplicate existing design
router.post("/:id/duplicate", duplicateDesign);

// GET /api/designs/:id/export - Export design
router.get("/:id/export", exportDesign);

module.exports = router;
