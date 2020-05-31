const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

mongoose.connect("mongodb://localhost:27017/ticDB", {useNewUrlParser: true, useUnifiedTopology: true});


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
var nameSchema = new mongoose.Schema(
    {
    myFullName: String,
    Mobile: Number,
   myTestimony:  String
   });
   var testimony = mongoose.model("testimony", nameSchema);

   app.post("/testimony", (req, res) => {
    var myData = new testimony(req.body);
   myData.save()
       .then(item => {
    res.send("You have succefully shared your testimony with TIC ...please wait for approval");
    })
    .catch(err => {
    res.status(400).send("unable to share to TIC");
    });
    console.log(myData);
   });



var nameSchema = new mongoose.Schema(
    {
    firstName: String,
    middleName: String,
    lastName: String,
    whatsappNo: String,
    email: String,
    gender: String,
    address: String,
    city: String,
    state: String

   });
   var ticMember = mongoose.model("ticMember", nameSchema);

app.post("/register", (req, res) => {
    var myData = new ticMember(req.body);
   myData.save()
       .then(item => {
    res.send("Congratulations! you have successfully Joined The Intercessors! we will get back to you ");
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
    console.log(myData);
   });

app.listen(process.env.PORT || 3000, function(){
    console.log("running on port 3000")
})