import Report from "../models/report.model.js";

// Test endpoint to verify DB connection
const testCreateReport = async (req, res) => {
  try {
    const testReport = new Report({
      userId: req.user._id, // authMiddleware se
      location: {
        type: "Point",
        coordinates: [72.5714, 23.0225], // Example coordinates (Ahmedabad)
        address: "Test Location, Ahmedabad"
      },
      damageType: "deforestation",
      description: "Test report to verify database connection",
      severity: "medium",
      images: ["test-image-url.jpg"]
    });

    await testReport.save();
    res.status(201).json({
      message: "Test report created successfully",
      report: testReport
    });
  } catch (error) {
    console.error("Test report creation error:", error);
    res.status(500).json({
      message: "Error creating test report",
      error: error.message
    });
  }
};

// Create new report
const createReport = async (req, res) => {
  try {
    const { location, damageType, description, severity, images } = req.body;

    if (!location || !location.coordinates || !location.address || !damageType || !description || !severity || !images) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const newReport = new Report({
      userId: req.user._id,
      location,
      damageType,
      description,
      severity,
      images,
    });

    await newReport.save();

    res.status(201).json({
      message: "Report created successfully",
      report: newReport,
    });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Error creating report" });
  }
};

// Get all reports (with filters & pagination)
const getReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      damageType,
      severity,
      verificationStatus,
      sort = "-createdAt",
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (damageType) query.damageType = damageType;
    if (severity) query.severity = severity;
    if (verificationStatus) query.verificationStatus = verificationStatus;

    const reports = await Report.find(query)
      .populate("userId", "fullname email")
      .populate("verifiedBy", "fullname email")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    res.status(200).json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
};

// Get nearby reports
const getNearbyReports = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: "Please provide longitude and latitude" });
    }

    const reports = await Report.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(maxDistance),
        },
      },
    }).populate("userId", "fullname email");

    res.status(200).json(reports);
  } catch (error) {
    console.error("Get nearby reports error:", error);
    res.status(500).json({ message: "Error fetching nearby reports" });
  }
};

// Get report by ID
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("userId", "fullname email")
      .populate("verifiedBy", "fullname email")
      .populate("comments.user", "fullname email");

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(200).json(report);
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({ message: "Error fetching report" });
  }
};

// Update report status (Admin only)
const updateReportStatus = async (req, res) => {
  try {
    const { status, actionTaken } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = status;
    if (actionTaken) report.actionTaken = actionTaken;

    await report.save();

    res.status(200).json({ message: "Report status updated successfully", report });
  } catch (error) {
    console.error("Update report status error:", error);
    res.status(500).json({ message: "Error updating report status" });
  }
};

// Verify report (Admin only)
const verifyReport = async (req, res) => {
  try {
    const { verificationStatus } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.verificationStatus = verificationStatus;
    report.verifiedBy = req.user._id;
    report.verificationDate = new Date();

    await report.save();

    res.status(200).json({ message: "Report verified successfully", report });
  } catch (error) {
    console.error("Verify report error:", error);
    res.status(500).json({ message: "Error verifying report" });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.comments.push({ user: req.user._id, text });
    await report.save();

    const populatedReport = await Report.findById(report._id).populate("comments.user", "fullname email");

    res.status(200).json({ message: "Comment added successfully", comments: populatedReport.comments });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
};

// Toggle upvote
const toggleUpvote = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const upvoteIndex = report.upvotes.indexOf(req.user._id);
    if (upvoteIndex === -1) {
      report.upvotes.push(req.user._id);
    } else {
      report.upvotes.splice(upvoteIndex, 1);
    }

    await report.save();

    res.status(200).json({ message: "Upvote toggled successfully", upvotes: report.upvotes });
  } catch (error) {
    console.error("Toggle upvote error:", error);
    res.status(500).json({ message: "Error toggling upvote" });
  }
};

const reportController = {
  testCreateReport,
  createReport,
  getReports,
  getNearbyReports,
  getReportById,
  updateReportStatus,
  verifyReport,
  addComment,
  toggleUpvote,
};

export default reportController;
