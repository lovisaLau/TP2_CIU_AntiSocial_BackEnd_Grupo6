const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const validarId = require("../middlewares/validarId");
const validarSchema = require("../middlewares/validarSchema");
const { createTagSchema } = require("../schemas/tagSchema");

router.get("/", tagController.getTags);
router.get("/:id", validarId, tagController.getTagById);
router.post("/", validarSchema(createTagSchema), tagController.createTag);
router.put("/:id", validarId, validarSchema(createTagSchema), tagController.updateTag);
router.delete("/:id", validarId, tagController.deleteTag);

module.exports = router;