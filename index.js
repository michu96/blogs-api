const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send('<h1>Home page</h1>')
})

//Error 404 middleware
app.use((req, res) => res.status(404).send('<h1>404 Not Found</h1>'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
