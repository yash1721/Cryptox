const express = require ('express')
const router = express.Router()
const verifytoken = require('../controllers/auth')
const portfolio = require('../models/portfolio')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const request = require('request');
const { spawn } = require('child_process');
router.get('/', verifytoken ,async(req,res) => {
    const userPortfolioCoins = await portfolio.findOne({id:new ObjectId(req.user.id)})
    const coinIdsArray = userPortfolioCoins.Watchlist.map((coin) => coin.coinId);
    const coinName = req.query.coinName
    const currentDate = new Date();
    const timestamp = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
    request('https://api.coingecko.com/api/v3/coins/' + coinName + '/market_chart?vs_currency=usd&days=4000', function (error, response, body) {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error fetching market data"
            });
        }

    const mChart = JSON.parse(body);
    const pythonProcess = spawn('python', ['classifier_model.py']);
        pythonProcess.stdin.write(JSON.stringify(mChart.prices) + '\n');
        pythonProcess.stdin.write(timestamp);
        pythonProcess.stdin.end();
        let pythonOutput = '';
        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            const errorMessage = data.toString('utf8');
            console.log(errorMessage)
        });

        pythonProcess.on('close', (code) => {
            // Do whatever you want to do with your python output
            const result = Number(pythonOutput.slice(1,-1));
            console.log(result);
            res.send("Hello world")
        });
})
    
})

module.exports = router