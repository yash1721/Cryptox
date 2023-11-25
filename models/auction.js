const mongoose = require('mongoose')
const auctionSchema = mongoose.Schema
    ({
        id:
        {
            type: String,
            require: true,
        },
        Name:{
            type:String
        },
        Image:{
            type:String,
        },
        duration:
        {
            type: Number,
            require: true
        },
        startTime :
        {
            type : Number ,
            require : true 
        } ,
        startBid :
        {
            type:Number
        },
        winner_info:
        {
            type: {
                id:
                {
                    type: String,
                },
                amount:
                {
                    type: String,
                },
            }
        },
        bids :[{
            type:{
                id :{
                    type:String,
                },
                amount : 
                {
                    type:String
                }
            }
        }]
    })
module.exports = mongoose.model('auction', auctionSchema);