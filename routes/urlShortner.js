const express = require('express')
const router = express.Router()

const {
    generateShortUrl, getAnalytics
} = require('../controllers/urlControllers')


const { isAuthenticatedUser} = require('../middlewares/auth')


// User Route 
router.route('/url').post(isAuthenticatedUser, generateShortUrl)
router.route('/analytics/:shortId').get(getAnalytics);



module.exports = router