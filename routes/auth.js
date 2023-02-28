const express = require('express')
const router = express.Router()

const {
    registerUser,
    loginUser,
    logout,
    getUserProfile,
    allUsers,
    deleteUser
} = require('../controllers/authControllers')


const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')


// User Route 
router.route('/signup').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(isAuthenticatedUser, getUserProfile)
router.route('/logout').get(logout)

// Admin Route 
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers)
router.route('/admin/user/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

module.exports = router