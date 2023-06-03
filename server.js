require("dotenv").config()
const express = require("express")
const cors = require("cors")
const client = require("@mailchimp/mailchimp_marketing")

const app = express()

// middlewares 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})


// routes 
app.get("/", async (req, res) => {
  return res.status(200).json({text: "Hello"})
})

app.get("/subscribe", async (req, res) => {
  return res.status(200).json({text: "Subscribe route"})
})

app.post("/subscribe", async (req, res) => {
  const email = req.body.email

  client.setConfig({
    apiKey: process.env.MAIL_CHIMP_API,
    server: process.env.MAIL_CHIMP_SERVER,
  });

  try {
    const response = await client.lists.addListMember("53c03339cd", {
      email_address: email,
      status: "subscribed",
    });
    return res.status(201).json({response: response, status: response.status})

  } catch(err) {

    console.log(err)
    return res.status(400).json({error: err, message: err.response.text })
  }
})


app.listen(process.env.PORT || 4001 , () => {
  console.log("Server listening on port ", process.env.PORT || 4001)
})

module.exports = app