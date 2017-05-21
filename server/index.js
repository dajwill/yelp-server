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
  var geoLocation = geoIP.lookup(ip)
  console.log(geoLocation);
  if (req.query.recommended) {
    var sortBy = 'rating'
  }
  let filter = req.query.filter || ''
  let query = req.query.query || ''
  let location = req.query.location || geoLocation.zip
  let url = `https://api.yelp.com/v3/businesses/search`
  let headers = {
    Authorization: process.env.YELP_AUTH
  }
  let params = {
    location: location,
    term: query,
    categories: filter,
    sort_by: sortBy
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
