const express = require('express')
const router = express.Router();
const auction = require('../models/auction')
const userData = require('../models/user');
const verifytoken = require('../controllers/auth')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
router.get('/', verifytoken, async (req, res) => {
    const auctionId = decodeURIComponent(req.query.id)
    const roomId = auctionId;
    const io = req.app.io;
    io.on('connection', (socket) => {
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            socket.currentRoom = roomId;
        });
        socket.on('chatMessage', (message) => {
            console.log(message)           
            socket.broadcast.to(socket.currentRoom).emit('chatMessage', { text: message, isOwner: false });
        });
        socket.on('disconnect', () => {
            socket.leave(roomId);
        });
    })
    const auctionData = await auction.findOne({ _id: new ObjectId(auctionId) })
    const Image = await userData.findOne({_id: new ObjectId(req.user.id)})
    res.render('auction.ejs', { data: auctionData , Image:Image.Image});
})
module.exports = router;