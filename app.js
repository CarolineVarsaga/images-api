var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer'); 

let storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, "public/upload"); 
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage }); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get("/image", (req, res) => {
    let upForm = `
    <form action="/savefile" method="post" enctype="multipart/form-data">
        <input type="file" name="image">
        <button type="submit">Skicka</button> 
    </form>
    `
    res.send(upForm)
})

app.post("/savefile", upload.single("image"), (req, res) => {
    console.log(req.file);
    res.send(`<img src="/upload/${req.file.filename}">`)
})

module.exports = app;
