require('dotenv').config();
const express=require('express');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');

const ejs=require('ejs');
const encrypt=require('mongoose-encryption');

const app=express();
console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
    extended:true
}));
mongoose.connect("mongodb://localhost:27017/userDb",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ["password"] });

const user=new mongoose.model("user",userSchema);

app.get("/",function (req,res) {
    res.render('home');
})
app.get("/login",function (req,res) {
    res.render('login');
})
app.get("/register",function (req,res) {
    res.render('register');
});
app.post("/login",function (req,res) {
    const username=req.body.username;
    const password=req.body.password;
    user.findOne({email:username},function (err,foundUser) {
        if(err){
            console.log('error');
        }
        else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }
                else{
                    res.send("<h1>oops! wrong password</h1>")
                }
            }
        }
    })
})
app.post("/register",function (req,res) {
    const newUser=new user({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function (err) {
       if(err){
        console.log(err);
       }
        else{
            res.render("secrets");
        }
    });

})

 





app.listen(3000,function () {
    console.log('server has started at port 3000');
})

