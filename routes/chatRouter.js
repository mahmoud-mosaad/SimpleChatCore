
const router = require("express").Router();
const chatController = require("../controllers/chatController");
// const Authenticated = require("../middleware/Authenticated");

router.post("/file/upload", chatController.fileUpload);


module.exports = router;
