const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require('@aws-sdk/client-s3');
require("dotenv").config();


let s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});



// controllers
const { createUpload, getUploads, getFeed, getCount, getImage, deleteUpload } = require('../controllers/uploadController');

// middleware
const { authenticateToken } = require('../middleware/userAuth');


const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { ContentType: 'image/jpeg' });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname); // Set unique key names for the uploaded files
    }
  })
});


// routes
router.post('/createUpload', upload.single('image'), createUpload);
router.get('/getUploads', authenticateToken, getUploads);
router.get('/getFeed', getFeed);
router.get('/getCount', getCount);
router.get('/getImage', getImage);
router.delete('/deleteUpload', deleteUpload);


module.exports = router;