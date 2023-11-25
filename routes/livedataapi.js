const express = require('express');
const axios = require('axios');
const app = express();
const router=express.Router();
router.get('/',async (req,res)=>{
    const url = req.query.url;
    res.setHeader('Cache-Control', 'no-store');
    const response = await axios.get(url);
    res.json(response.data);
})
module.exports=router;