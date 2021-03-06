const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

require('dotenv').config()

const app = express()

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('<h1>Home page</h1>')
})

app.use('/api', require('./routes/api/blog'))

//Error 404 middleware
app.use((req, res) => res.status(404).send('<h1>404 Not Found</h1>'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
