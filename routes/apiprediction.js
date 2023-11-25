const express = require('express');
const router = express.Router();
const axios = require('axios');
const { spawn } = require('child_process');
const request = require('request');
const timestamp = '2023-10-24 14:30:00';

router.post('/', async (req, res) => {
    const coinName = req.body.coinName
    const timeStamp = req.body.timeStamp
    request('https://api.coingecko.com/api/v3/coins/' + coinName + '/market_chart?vs_currency=usd&days=4000', function (error, response, body) {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error fetching market data"
            });
        }

        const mChart = JSON.parse(body);

        const pythonProcess = spawn('python', ['predict_model.py']);
        pythonProcess.stdin.write(JSON.stringify(mChart.prices) + '\n');
        pythonProcess.stdin.write(timeStamp);
        pythonProcess.stdin.end();
        let pythonOutput = '';
        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            const errorMessage = data.toString('utf8');
            return res.status(500).json({
                success: false,
                message: "Please Enter The name of correct CryptoCurrency"
            });
        });

        pythonProcess.on('close', (code) => {
            // Do whatever you want to do with your python output
            return res.status(200).json({success:true,message:pythonOutput})
        });
    });
    
});

module.exports = router;
