const express = require("express");

const app = express();
const port = 3000;

const { accountID, authToken, serviceID } = require("./config");

const twilioClient = require("twilio")(accountID, authToken);
const client = require("twilio")(accountID, authToken);
app.get("/emailotp", (req, res) => {
  twilioClient.verify
    .services(serviceID) //Put the Verification service SID here
    .verifications.create({ to: req.query.email, channel: "email" })
    .then((verification) => {
      res.status(200).send({
        message: "Verification is sent!!",
        email: req.query.email,
        verification,
      });
    });
});

app.get("/verifyemail", (req, res) => {
  twilioClient.verify
    .services(serviceID) //Put the Verification service SID here
    .verificationChecks.create({ to: req.query.email, code: req.query.code })
    .then((verification_check) => {
      res.status(200).send({
        message: "Verification Result!!",
        email: req.query.email,
        verification_check,
      });
    });
});



app.get('/', (req, res)=>{
  res.status(200).send({
      message: "You are on Homepage",
      info: {
          login: "Send verification code through /login . It contains two params i.e. phonenumber and channel(sms/call)",
          verify: "Verify the recieved code through /verify . It contains two params i.e. phonenumber and code"
      }
  })
});

// Login Endpoint
app.get('/login', (req,res) => {
   if (req.query.phonenumber) {
      client
      .verify
      .services(serviceID)
      .verifications
      .create({
          to: `+${req.query.phonenumber}`,
          channel: req.query.channel==='call' ? 'call' : 'sms' 
      })
      .then(data => {
          res.status(200).send({
              message: "Verification is sent!!",
              phonenumber: req.query.phonenumber,
              data
          })
      }) 
   } else {
      res.status(400).send({
          message: "Wrong phone number :(",
          phonenumber: req.query.phonenumber,
          data
      })
   }
})

// Verify Endpoint
app.get('/verify', (req, res) => {
  if (req.query.phonenumber && (req.query.code).length === 6) {
      client
          .verify
          .services(serviceID)
          .verificationChecks
          .create({
              to: `+${req.query.phonenumber}`,
              code: req.query.code
          })
          .then(data => {
              if (data.status === "approved") {
                  res.status(200).send({
                      message: "User is Verified!!",
                      data
                  })
              }
              else{
                  res.status(400).send({
                      message: "Wrong phone number or code :(",
                      phonenumber: req.query.phonenumber,
                      data
                  })
              }
          })
  } else {
      res.status(400).send({
          message: "Wrong phone number or code :(",
          phonenumber: req.query.phonenumber,
          data
      })
  }
});
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
