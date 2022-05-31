import express from 'express'
import bodyParser from "body-parser"

const app = express()

app.use(bodyParser.json())

app.get("/hello", (req, res) => res.send("Hello!"))
app.post("/hello", (req, res) => res.send(`Hello ${req.body.name}!`))

const port = 8000
app.listen(port, () => {console.log(`Listening on port ${port}`)})
