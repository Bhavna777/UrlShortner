const app = require('./app')
const connectDatabase = require('./config/database')



process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`)
    console.log('Server shutting down due to uncaught exception')
    process.exit(1)
})

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/config.env" });
}

connectDatabase();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)
    server.close(() => {
        process.exit(1)
    })
})