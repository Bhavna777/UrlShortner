const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    shortId : {
        type : String,
        require : true,
        unique : true,
    },
    redirectUrl : {
        type : String,
        require : true
    },
    visitHistory : [{
        timestamp : {
            type : Number
        }
    }],
})


module.exports = mongoose.model("url", urlSchema);