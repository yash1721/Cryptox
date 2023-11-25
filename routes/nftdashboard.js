const express = require('express')
const router = express.Router()
const verifytoken = require('../controllers/auth')
const user = require ('../models/user')
const portfolio = require('../models/portfolio')
const auction = require('../models/auction')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
router.get('/', verifytoken , async(req,res) => {
    const currentTimestamp = new Date().getTime()
    const futureEvents = await auction.find({startTime:{$gte:currentTimestamp}})
    const getUserInfo = async (userId,eventId) => {
        const userinfo = await user.findById(userId); 
        return {
          userName: userinfo.name,
          userImage: userinfo.Image,
          id:userId.toString(),
          eventId: eventId,
        };
      };
    const eventsWithUserInfo = [];
    for (const event of futureEvents) {
        const userInfo = await getUserInfo(new ObjectId(event.id),event._id.toString());
        eventsWithUserInfo.push(userInfo);
      }
    const PortfolioData = await portfolio.findOne({id:new ObjectId(req.user.id)})
    const UserData = await user.findOne({_id:new ObjectId(req.user.id)})
    res.render('nftdashboard.ejs',{data:UserData,Balance:PortfolioData.Balance,events:futureEvents,usereventdata:eventsWithUserInfo })
})
router.post('/', verifytoken , async(req,res) => {
    const id = req.body.id ;
    const auctionData = await auction.findOne({_id:new ObjectId(id)})
    return res.status(200).json({success:true,data:auctionData})
})
module.exports=router;