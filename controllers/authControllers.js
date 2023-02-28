const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')


// register user ---> /api/v1/signup - POST

exports.registerUser = catchAsyncErrors( async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password
    })

    sendToken(user, 200, res)
})


// login user ---> /api/v1/login - POST

exports.loginUser = catchAsyncErrors( async(req, res, next ) => {
    const { email, password } = req.body;

    if(!email || !password ){
        return next(new ErrorHandler('Please enter email & password', 404))
    }

    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return next(new ErrorHandler('Invalid Email or Password', 404))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalide Email or Passoword', 404))
    }

    sendToken(user, 200, res)
})




// Get Current User Profile :--> /api/v1/me - GET

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    // console.log(req.user)
    const user = await User.findById(req.user.id)

    if(!user){
        return next(new ErrorHandler('Invalide UserId', 404))
    }

    res.status(200).json({
        success : true,
        user
    })
})



// Get all users ---> /api/v1/admin/users - GET

exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})


// Delete user profile by admin ---> /api/v1/admin/user/:id - DELETE

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true
    })
})




// Logout ---> /api/v1/logout - GET

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged Out Successfully'
    })
})