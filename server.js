const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static('public'));
app.use('/DOCUMENTS', express.static('DOCUMENTS'));

app.use(express.json());

// simple login
const USER = "admin";
const PASS = "1234";

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if(username === USER && password === PASS){
        res.json({success:true});
    }else{
        res.json({success:false});
    }
});

// upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'DOCUMENTS/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage});

app.post('/upload', upload.single('file'), (req, res)=>{
    res.json({success:true});
});

app.get('/files', (req,res)=>{
    fs.readdir('DOCUMENTS', (err, files)=>{
        res.json(files);
    });
});

app.listen(3000, ()=>{
    console.log('Server running http://localhost:3000');
});