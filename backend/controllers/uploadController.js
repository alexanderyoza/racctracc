
const jwt = require('jsonwebtoken');
const Upload = require('../models/uploadModel');
const User = require('../models/userModel');
require("dotenv").config();
const express = require("express");
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
const fs = require("fs");

// @desc    Create new post 
// @route   POST api/uploads/createUpload
const createUpload = async (req, res) => {
    const { userId, imagepath, caption, location } = req.body;

    try {

        const upload = await Upload.create({
            userId: userId,
            imagepath: imagepath,
            caption: caption,
            location: location,
        });
        return res.status(201).json({ upload });
    } catch (err) {
        return res.status(400).json({
            message: 'Error creating upload',
            error: err
        });
    }
}

// @desc    Get posts for logged in user (for web app)
// @route   GET api/uploads/getUploads
const getUploads = async (req, res) => {
    try {

        let uploads = await Upload.find({ userId: req.user._id })
            .sort({ created_at: -1 }); // Sort in descending order of 'created_at' field
        //.limit(req.limit); // Limit the results to 'limit' number of documents
        
        const uploadsData = uploads.map((upload) => 
            ({
                _id: upload.id,
                userId: upload.userId,
                imagepath: upload.imagepath,
                caption: upload.caption,
                location: upload.location,
            })
        );

        return res.status(200).json(uploadsData);

    } catch (err) {
        return res.status(404).json({
            message: 'Error fetching uploads',
            error: err
        });
    }
}

// @desc    Get feed posts for logged in user (for web app)
// @route   GET api/uploads/getFeed
const getFeed = async (req, res) => {

    try {

        let uploads = await Upload.find({})
            .skip((req.page - 1) * req.limit)
            .limit(req.limit) // Limit the results to 'limit' number of documents
            .sort({ createdAt: -1 }); // Sort in ascending order of 'created_at'
        
        
        const uploadsData = uploads.map((upload) =>
            ({
                _id: upload.id,
                userId: upload.userId,
                imagepath: upload.imagepath,
                caption: upload.caption,
                location: upload.location,
            })
        );
        console.log(uploadsData);
        return res.status(200).json(uploadsData);
        
    } catch (err) {
        return res.status(404).json({
            message: 'Error fetching feed',
            error: err
        });
    }
}

const getCount = async (req, res) => {
    try {
        const count = await Upload.countDocuments();
        
        return res.status(200).json({count : count});
        
    } catch (err) {
        return res.status(404).json({
            message: 'Error fetching feed',
            error: err
        });
    }
}

const getImage = async (req, res) => {
    

    try {

        let s3 = new S3Client({
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });

        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: req.headers.imagepath,
          });
        
          const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 3600, // URL expiration time in seconds (e.g., 1 hour)
          });
        



        res.status(200).send(signedUrl);


        
    } catch (err) {
        console.log( err);
        return res.status(404).json({
            message: 'Error fetching feed',
            error: err
        });
    }
}


// @desc    Delete upload
// @route   DELETE api/uploads/deleteUpload
const deleteUpload = async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.id);

        if (!upload) {
            return res.status(400).json({
                message: 'Upload not found',
            });
        }
        if (upload.user.toString() !== req.user._id) {
            return res.status(401).json({
                message: 'User not authorized',
            });
        }

        await upload.remove();
        return res.status(200).json({ id: req.params.id });
    } catch (err) {
        return res.status(400).json({
            message: 'Error deleting upload',
            error: err
        });
    }
}


module.exports = {
    createUpload,
    getUploads,
    getFeed,
    getImage,
    getCount,
    deleteUpload
}