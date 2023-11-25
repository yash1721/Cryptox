const express = require('express');
const router = express.Router();
const axios = require('axios');
const Portfolio = require('../models/portfolio');
const verifytoken = require('../controllers/auth')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const transactions = require('../models/transactions')
router.get('/', verifytoken, async (req, res) => {
  res.render('buy_assets.ejs');
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
        message: 'Please Enter the Name of correct Crypto !!!'
      })
    }
    const price = Number(response.data[id].usd);
    const userData = await Portfolio.findOne({ id: new ObjectId(req.user.id) });
    const userbalance = userData.Balance;
    if (userbalance >= price * amount) {
      const transactionData = new transactions({
        id: new ObjectId(req.user.id),
        type: 'Buy',
        Timestamp: Date.now(),
        coinId: id,
        status: true,
        Amount: price * amount,
      })
      await transactionData.save();
      userData.Balance = userbalance - (price * amount);
      const idExists = userData.coinholdings.find(item => item.coinID === id);
      const newpriceholdings = {
        coinId:id,
        amount:amount,
        buyprice:price,
      }
      if (idExists)
      {
        idExists.amount += amount ;
      }
      else
      {
        const newCoin = {
          coinID: id,
          amount: amount, 
      };
      userData.coinholdings.push(newCoin);
      
      }
      userData.priceholdings.push(newpriceholdings)
      await userData.save();
      return res.status(200).json({
        success: true,
        message: "Transaction successfully completed",
      })
    }
    else {
      const transactionData = new transactions({
        id: new ObjectId(req.user.id),
        type: 'Buy',
        Timestamp: Date.now(),
        coinId: id,
        status: false,
        Amount: price * amount,
      })
      await transactionData.save();
      return res.status(402).json({
        success: false,
        message: "In sufficient Balance in your Wallet"
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(
      {
        success: false,
        message: "An error occured "
      }
    );
  }
});

module.exports = router;
