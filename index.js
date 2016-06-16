require('dotenv').config({silent: true})

const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()

app.engine('hbs', exphbs())
app.set('view engine', 'hbs')

app.get('/', (req, res) => res.render('vote', {
  key: process.env.p_key,
  cluster: process.env.p_cluster,
  options: [
    {id: 1, name: 'Foo'},
    {id: 2, name: 'Bar'},
    {id: 3, name: 'Baz'}
  ]
}))

app.listen(process.env.PORT || 3000)

const uuid = require('node-uuid')
const Pusher = require('pusher')
const pusher = new Pusher({
  appId: process.env.p_app_id,
  key: process.env.p_key,
  secret: process.env.p_secret,
  cluster: process.env.p_cluster,
  encrypted: true
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/pusher/auth', function(req, res) {
  const socketId = req.body.socket_id
  const channel = req.body.channel_name

  const data = {
    user_id: uuid.v4(),
    user_info: {}
  }

  const auth = pusher.authenticate(socketId, channel, data)

  res.send(auth)
})
