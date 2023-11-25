const express = require ('express')
const router = express.Router()
const cron = require('node-cron');
const { createAuctionRooms } = require('../server.js')
router.get('/', async(req,res) => {
    const auctionID = createAuctionRooms('NFT AUCTION' , Date.now() , 3600);
    console.log(auctionID);
    res.render('marketplace.ejs');

})

module.exports=router;