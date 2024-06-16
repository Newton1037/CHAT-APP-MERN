const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const { accessChats, fetchChats, createGroupChat, renameGroup, removeFromGroup, addInGroup } = require("../controllers/chatControllers")

const router = express.Router()

router.route("/").post(protect , accessChats)
router.route("/").get(protect , fetchChats)
router.route("/group").post(protect , createGroupChat)
router.route("/grouprename").put(protect , renameGroup)
router.route("/groupremove").put(protect , removeFromGroup)
router.route("/groupadd").put(protect , addInGroup)

module.exports = router