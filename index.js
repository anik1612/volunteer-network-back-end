const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Welcome from volunteer network server!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})