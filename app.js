const express = require("express");
//const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing"); 
 
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
 
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
 
client.setConfig({
  apiKey: "0ef19c39a14accc36c3a90498410d7d6-us9",
  server: "us9",
});
 
app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }
 
  const run = async () => {
    try {
      const response = await client.lists.addListMember("f74f4c1c54", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log("====== ERROR ======");
      console.log(JSON.parse(err.response.error.text).detail);
    }
  };
 
  run();
});
 
app.post("/failure", function(req, res) {
  res.redirect("/");
});
 
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});