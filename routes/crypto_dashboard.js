const express = require('express')
const router = express.Router()
var request = require('request')
const verifytoken = require('../controllers/auth')
let mData = ""
let coinName = "bitcoin"
let mChart = ""
async function resData(coinName){
    var marketData = await new Promise((resolve,reject)=>{
        request('https://api.coingecko.com/api/v3/coins/' + coinName, function (error, response, body) {
            // console.log(body);
            mData = JSON.parse(body)
            resolve(mData)
        });
    })

    if(marketData){
    var marketChart = await new Promise((resolve,reject)=>{
        request('https://api.coingecko.com/api/v3/coins/' + coinName + '/market_chart?vs_currency=usd&days=30', function (error, response, body) {
            mChart = JSON.parse(body)
            //console.log(mChart)
        resolve(mData)
        });
    })
}
}
router.get('/', verifytoken ,async (req, res) => {
    await resData(coinName)
    res.render('livedata.ejs', { mData, mChart, coinName })
})

router.post('/', verifytoken ,async (req, res) => {
    coinName = req.body.selectCoin;
    await resData(coinName)
    res.render('livedata.ejs', { mData, mChart, coinName })
})
module.exports = router