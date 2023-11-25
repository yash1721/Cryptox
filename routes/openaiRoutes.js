const express = require('express');
const { generateImage } = require('../controllers/openaicontroller');
const router = express.Router();
router.get('/', async(req,res)=>{
    res.render('nftgenerator.ejs');
})
router.post('/generateimage', generateImage);

module.exports = router;
