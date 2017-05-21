const express = require('express')
const cors    = require('cors')
const axios   = require('axios');
const geoIP   = require('geoip-lite')
const app     = express()

app.use(cors())
app.set('port', (process.env.PORT || 8081))
app.enable('trust proxy')

app.get('/', (req, res) => {
  return res.send('Hello')
})

app.get('/search', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(req.ip);
  var location = geoIP.lookup(ip)
  console.log(location);
  // let { filter, query } = req.query
  let filter = req.query.filter || ''
  let query = req.query.query || ''
  let url = `https://api.yelp.com/v3/businesses/search`
  let headers = {
    Authorization: process.env.YELP_AUTH
  }
  let params = {
    location: 48103,
    term: query,
    categories: filter
  }

  axios.get(url, {params: params, headers: headers})
    .then((data) => {
      var businesses = data.data.businesses
      return res.send(businesses)
    })
    .catch((err) => res.send(new Error(err)))
})

app.listen(app.get('port'), function () {
  console.log('CORS-enabled web server listening on port 8081')
})
