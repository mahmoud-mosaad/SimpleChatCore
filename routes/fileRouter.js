
const Busboy = require('busboy')
const multer = require('multer')
const path = require('path')

const router = require("express").Router();
const fileController = require("../controllers/fileController");
// const Authenticated = require("../middleware/Authenticated");

const UPLOADS_PATH = process.env.CHAT_FILES_UPLOAD_PATH || '../SimpleChat/public/chat'
const MAX_FILES_UPLOADED = 33

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, UPLOADS_PATH)
    },

    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })

router.post("/upload", upload.array('file_upload', MAX_FILES_UPLOADED), fileController.fileUpload);

module.exports = router;
