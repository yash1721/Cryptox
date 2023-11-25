const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const verifytoken = require('../controllers/auth');
const Portfolio = require('../models/portfolio');
const transactions = require('../models/transactions');

router.get('/', verifytoken, async (req, res) => {
    res.render('sell_asset.ejs');
});

router.post('/', verifytoken, async (req, res) => {
    const data = req.body;
    const id = data.id.toLowerCase();
    const amount = Number(data.amount);

    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);

        if (!response.data[id]) {
            return res.status(402).json({
                success: false,
                message: 'Please Enter the Name of correct Crypto !!!',
            });
        }

        const price = Number(response.data[id].usd);
        const userData = await Portfolio.findOne({ id: new ObjectId(req.user.id) });
        const matchingCardholding = userData.coinholdings.find(card => card.coinID === id && card.amount >= amount);
        const userbalance = userData.Balance;
        
        if (matchingCardholding)
        {
            matchingCardholding.amount -= amount;
            const transactionData = new transactions({
                id: new ObjectId(req.user.id),
                type: 'Sell',
                Timestamp: Date.now(),
                coinId: id,
                status: true,
                Amount: price * amount,
            });
            
            await transactionData.save();
            userData.Balance = userbalance + (price * amount);
            await userData.save();
            return res.status(200).json({
                success: true,
                message: 'Transaction successfully completed',
            });
        }
        else 
        {
            const transactionData = new transactions({
                id: new ObjectId(req.user.id),
                type: 'Sell',
                Timestamp: Date.now(),
                coinId: id,
                status: false,
                Amount: price * amount,
            });
    
            await transactionData.save();
            
            await userData.save();
            return res.status(403).json({
                success: false,
                message: `This much amount of ${id} is not present `,
            });
        }
        

        


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
});

module.exports = router;
