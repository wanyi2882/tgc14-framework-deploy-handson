const express = require('express');
const router = express.Router();

const cloudinary = require('cloudinary');
// configure cloudinary
cloudinary.config({
    'api_key': process.env.CLOUDINARY_API_KEY,
    'api_secret': process.env.CLOUDINARY_SECRET
})

router.get('/sign', async (req, res)=>{
    const paramsToSign = JSON.parse(req.query.params_to_sign);
    const apiSecret = process.env.CLOUDINARY_SECRET;
    const signature = cloudinary.utils.sign_request(paramsToSign, apiSecret);
    res.send(signature);
})

module.exports = router;