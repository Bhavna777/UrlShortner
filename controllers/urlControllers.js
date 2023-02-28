const URL = require('../models/url');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const shortid = require('shortid')


// Generate URL -> /api/v1/url - POST

exports.generateShortUrl = catchAsyncErrors(async (req, res, next) => {
    const { url } = req.body;

    if (!url) {
        return next(new ErrorHandler('Please enter URL', 404))
    }

    const shortId = shortid();
    const shortUrl = await URL.create({
        shortId: shortId,
        redirectUrl: url,
        visitHistory: []
    })

    return res.json({
        id: shortId
    })
})


// Get Analtics -> /api/v1/analytics/:shortId - GET 

exports.getAnalytics = catchAsyncErrors(async (req, res, next) => {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
})