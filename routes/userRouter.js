
const router = require("express").Router();
const userController = require("../controllers/userController");
// const Authenticated = require("../middleware/Authenticated");

router.get("/active", userController.activeUsers);


module.exports = router;
