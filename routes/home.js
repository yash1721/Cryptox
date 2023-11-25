const express = require('express')
const router = express.Router()
const axios = require('axios')
const UserPortfolio = require('../models/portfolio')
const verifytoken = require('../controllers/auth')
const mongoose = require('mongoose')
const objectId = mongoose.Types.ObjectId;
router.get('/', async (req, res) => {
    const {imageset} = require('./image.js')
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en')
        const responseData = response.data;
        const requiredCoins = ['bitcoin', 'ethereum', 'tether', 'solana', 'cardano', 'ripple', 'avalanche-2', 'binancecoin']
        const filteredData = responseData.filter(responseData => requiredCoins.includes(responseData.id)).map(responseData => ({
            name: responseData.id,
            last_price: responseData.current_price,
            increase_percent: responseData.price_change_percentage_24h,
            market_capital: responseData.market_cap
        }))
        res.render('home.ejs', { CoinData: filteredData, user: req.cookies.jwt });

    } catch (error) {
        console.log(`error occured ${error}`)
        res.status(400).json({
            success: false,
            message: "error occured in fetchong data"
        })
    }

})
router.put('/', verifytoken, async (req, res) => {
    const id = req.user.id;
    const coinName = req.body.name;
    
    try {
        const result = await UserPortfolio.findOne(
            { id: new objectId(id) }
        );
        const coinNames = {
            coinId:coinName
        }
        const coinExists = result.Watchlist.some(item => item.coinId === coinName);
        if (!coinExists)
        {
            result.Watchlist.push(coinNames);
            await result.save();
        }
    } catch (error) {
        console.error('Error updating user watchlist:', error);
    }
})
module.exports = router