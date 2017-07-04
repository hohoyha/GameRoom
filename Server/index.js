var express = require('express');
// var server = require('http').createServer(express);
var http = require('http');
var path = require('path');
var sprintf = require("sprintf-js").sprintf

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var httpServer = http.createServer(app).listen(3000, function(req,res){
  console.log('Socket IO server has been started');
});

app.get('/test', function(req, res){
   res.render('test');
});

app.post('/test', function(req, res){
   res.render('test');
})

app.get('/chat', function(req, res){
    res.render('chat');
});

// var io = require('./game')(httpServer);

// var value = sprintf("%s /n", 'hohoya');

// console.log(value);

var io = require('./chat')(httpServer);

//Handling 404
app.use(function(req,res){
    res.send(404,"I cannot find the page");
} );



// Handling 500
app.use(function(error, req, res, next) {
     res.status(500).render('500');
       next();
});


// app.get('/', function(req, res){
//     res.render('index');
// });

// app.get('/chat', function(req, res){
//     res.render('chat');
// });


// // Handle 404
// app.use(function(req, res) {
//     res.send('404: Page not Found', 404);
// });

// // Handle 500
// app.use(function(error, req, res, next) {
//     res.send('500: Internal Server Error', 500);
// });
  

// var io = require('socket.io')(server);
// io.on('connection', function(client){
//     client.on('event', function(data){

//     });

//     client.on('disconnect', function() {

//     });

//     client.emit('toclient',{msg:'Welcome !'});
// });

// app.listen(3000, function(){
//     console.log("Express server Started on Port 3000");
// });

//server.listen(3000);

