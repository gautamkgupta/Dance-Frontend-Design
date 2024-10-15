const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyparser = require("body-parser");
const flash = require('connect-flash');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
const app = express();
const port = 8000;

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    con: String,
  });

const contact = mongoose.model('contact', contactSchema);

app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())

// express-messages middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory
 
app.get('/', (req, res)=>{
    res.status(200).render('home.pug');
})

app.get('/home', (req, res)=>{
    res.status(200).render('home.pug');
})

app.get('/contact', (req, res)=>{
    res.status(200).render('contact.pug', {message:req.flash("mess")});
})

app.post('/contact', (req, res)=>{
    const mydata = new contact(req.body)
    mydata.save().then(()=>{
        res.send("This Items will save to the Database")
        req.flash("mess", "This Items will save to the Database")
        console.log(req.flash("mess"))
    }).catch(()=>{
        res.send("This Items was not save to the Database")
    })
})

/*
data save for file.txt
app.post('/contact',(req, res) => {
    name = req.body.name
    email = req.body.email
    phone = req.body.phone
    address = req.body.address
    con = req.body.con

    let output = `the name of the client is ${name}, ${email} years old, ${phone}, residing at ${address}. More about him/her: ${con}`
    fs.writeFileSync('File.txt', output)
    const params = {'message': 'Your form has been submitted successfully'}
    res.status(200).render('contact.pug', params);

    output= req.body
    console.log(output)
    fs.writeFileSync('File.txt', output)
    const params = {'message': 'Your form has been submitted successfully'}
    res.status(200).render('contact.pug', params);
})*/

app.listen(port, ()=>{
    console.log(`Website is started successfully on port http://localhost:${port}`);
});
