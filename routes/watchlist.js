const express = require ('express')
const router = express.Router()
const verifytoken = require ('../controllers/auth')
const Portfolio = require('../models/portfolio')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const axios = require('axios')
async function fetchDataForCoin(coinName) {
    const apiUrl = `http://localhost:3000/api/buysell/?coinName=${coinName}`; 
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
      console.error(`Error fetching data for ${coinName}:`, error);
      return null;
    }
  }
  async function fetchAllDataForCoins(coinNamesArray) {
    const coinDataPromises = coinNamesArray.map(coinName => fetchDataForCoin(coinName));
    const coinDataResults = await Promise.all(coinDataPromises);
    return coinDataResults
  }
router.get('/', verifytoken , async(req,res) => {
    const UserPortfolio = await Portfolio.findOne({id:new ObjectId(req.user.id)});
    const coinNamesArray = UserPortfolio.Watchlist.map(item => item.coinId);
    // const predict = await fetchAllDataForCoins(coinNamesArray)
    // console.log(predict)
    // console.log(coinNamesArray)
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en')
        const responseData = response.data;
        const requiredCoins = coinNamesArray ;
        const filteredData = responseData.filter(responseData => requiredCoins.includes(responseData.id)).map(responseData => ({
            name: responseData.id,
            last_price: responseData.current_price,
            increase_percent: responseData.price_change_percentage_24h,
            market_capital: responseData.market_cap
        }))
        res.render('watchlist.ejs', { CoinData: filteredData });

    } catch (error) {
        console.log(`error occured ${error}`)
        res.status(400).json({
            success: false,
            message: "error occured in fetchong data"
        })
    }
    
})
router.post('/', verifytoken , async(req,res) => {
     const UserPortfolio = await Portfolio.findOne({id:new ObjectId(req.user.id)});
     const id = req.body.coinName
     const indexToRemove = UserPortfolio.Watchlist.findIndex(item => item.coinId === id);
     UserPortfolio.Watchlist.splice(indexToRemove, 1);
     try{
        await UserPortfolio.save();
        return res.status(200).json({
            success:true,
            message:"successfully removed"
        })
     }
     catch(err)
     {
        console.log(err);
     }
    

})
module.exports=router;