// routes/villaRoutes.js
const express = require("express");
const villaController = require("../controllers/villaController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

module.exports = (uploadVillaImages) => {
  const router = express.Router();

  router.post(
    "/",
    authenticateToken,
    authorizeRoles("owner"),
    uploadVillaImages.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "additionalImages", maxCount: 10 },
    ]),
    villaController.createVilla
  );

  // Rute untuk memperbarui villa (Hanya Owner yang memiliki villa tersebut)
  router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("owner"),
    uploadVillaImages.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "additionalImages", maxCount: 10 },
    ]),
    villaController.updateVilla
  );

  router.get("/", authenticateToken, villaController.getAllVillas);

  router.get("/:id", authenticateToken, villaController.getVillaById);

  router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("owner", "admin"),
    villaController.deleteVilla
  );

  router.put(
    "/:id/status",
    authenticateToken,
    authorizeRoles("admin"),
    villaController.updateVillaStatus
  );

  return router;
};
