const express = require('express');
const userRoutes = require('./userRoute')
const router = express.Router();



router.get('/health', (req,res)=> {
   res.json({success:true,message:'Server is running'})
})


router.use('/users',userRoutes);
module.exports = router;