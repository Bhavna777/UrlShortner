const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const URL = require('./models/url');

const errorMiddleware = require('./middlewares/errors')
const cookieParser = require('cookie-parser')

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

const auth = require('./routes/auth')
const urlShortner = require('./routes/urlShortner')


app.use('/api/v1', auth)
app.use('/api/v1', urlShortner)


app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectUrl);
});



app.use(errorMiddleware)

module.exports = app