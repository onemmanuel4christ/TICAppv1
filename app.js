const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
let msgs = [];
let foundMessages = [];
let foundMembers = [];


const app = express()
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.get('/', function (req, res) {
      res.render('index', {
        msgs: msgs        
    });
});

// DB COnnection
mongoose.connect("mongodb://localhost:27017/intercessorsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// testimony schem
const testimonySchema = new mongoose.Schema({
    myName: String,
    myTitle: String,
    myTestimony: String
});

const Testimony = mongoose.model("Testimony", testimonySchema);

//////////////////////////////target for all/////////////////////////////////////////
app.route("/testimony")
.get(function(req, res){
    Testimony.find(function(err, foundMessages){
        if(!err){
             msgs = foundMessages;
             res.redirect("/")
        }else{
            res.send(err);
        }
              
    });
})

.post(function(req, res){
    const newTestimony = new Testimony({
        myName: req.body.Name,
        myTitle: req.body.Title,
        myTestimony: req.body.Testimony
    });
    newTestimony.save(function(err){
        if (!err) {
            res.send("successfully saved");
        }else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Testimony.deleteMany({}, function(err){
        if(!err) {
            res.send("Successfully Deleted all");
        }else{
            res.send(err);
        }
    });
});

//////////////////////////////specifi item/////////////////////////////////////////

app.route("/testimony/:Title")

.get(function (req, res){
    
Testimony.findOne({title: req.params.Title}, function(err, foundTestimony){
if (foundTestimony){
    res.send(foundTestimony); 
} else {
    res.send("No item ");
}
})

});

// members schema
const memberSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    whatsappNo: String,
    email: String,
    gender: String,
    address: String,
    dateOfBirth: Date,
    city: String,
    state: String

});
const Member = mongoose.model("Member", memberSchema);



app.post("/register", (req, res) => {
    const myMember = new Member(req.body);
    myMember.save()
        .then(item => {
            res.send("Congratulations! you have successfully Joined The Intercessors! we will get back to you ");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
    res.redirect("/")

});

// to get all members

app.get("/members", function(req, res){
    Member.find(function(err, foundMembers){
        if(!err){
             res.send(foundMembers);
        }else{
            res.send(err);
        }
              
    });
}) ;



app.get('/admin', function (req, res) {
    res.render('admin')
});




app.get('/login', function (req, res) {
    res.render('login')
});




app.listen(process.env.PORT || 3000, function () {
    console.log("running on port 3000")
})