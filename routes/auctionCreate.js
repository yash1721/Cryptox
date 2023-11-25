const express = require('express')
const router = express.Router()
const multer=require('multer')
const mongodb=require('mongodb')
const fs=require('fs')
const path=require('path')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const auction = require('../models/auction');
const verifytoken = require('../controllers/auth');
router.get('/', verifytoken ,async (req, res) => {
    res.render('auctionCreate.ejs')
})
router.post('/', [upload.single('image'),verifytoken], async (req, res) => {
    const targetTimeString = req.body.startingtime
    const targetDate = new Date(req.body.startingdate);
    const [hours, minutes, seconds] = targetTimeString.split(":").map(Number);
    targetDate.setHours(hours, minutes, seconds);
    const timestamp = targetDate.getTime();
    const NftAuction = new auction({
        id : req.user.id ,
        Name : req.body.name,
        Image:req.file.buffer.toString('base64'),
        duration:req.body.duration,
        startTime :timestamp,
        startBid:Number(req.body.startingbid),
    })
    try {
         await NftAuction.save() ;
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: "Error in Creating Auction Please Try again later" })
    }
    return res.status(200).json({ success: true, message: "Successfully Created Auction" })

})
module.exports = router;