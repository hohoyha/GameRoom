
var group = require('./socket_io/group');


function userInfo(rname, nick) {
    this.room = rname;
    this.nick = nick;
}

module.exports = function(io){
    // var io = require('socket.io').listen(httpServer);

    var nio = io.of('/game');

     var numUsers = 0;
     

     var userlist = [];
     var count = 0;

    nio.on('connection', function(socket){
         var addedUser = false;

          socket.emit('news', {hello: 'world'});
         
         var netFun = group(socket, nio);
        
          netFun.join("hoho");
          netFun.send();
          netFun.boardcast();
          count++;
          var userinfo = new userInfo("hoho", "guest" + count);
          userlist.push(userinfo);

          socket.info = userinfo;
          
        //   socket.broadcast.to('hoho').emit('hello2', {});

        //   io.sockets.in('hoho').emit('hello', {hi:'world'});
            // group(socket).leave();

          socket.on('new message', function (data) {
            // we tell the client to execute 'new message'

            socket.emit('new message', {
                username: data.username,
                message: data.message
            });
            // socket.broadcast.emit('new message', {
            // username: socket.username,
            // message: data
            // });
        });

         socket.on('add user', function(username){
             if(addedUser) return;

             socket.username = username;
             ++numUsers;
             addedUser = true;

             socket.emit('login', {
                numUsers: numUsers 
             });

            

             socket.broadcast.emit('user joined', {
                 username: socket.username,
                 numUsers: numUsers
             });

            //  socket.emit('hello', {});
         });

           socket.on('disconnect', function () {
                netFun.leave(socket.info.room);
                
                if (addedUser) {
                --numUsers;

                // echo globally that this client has left
                socket.broadcast.emit('user left', {
                    username: socket.username,
                    numUsers: numUsers
                });
                }
            });
    });
}