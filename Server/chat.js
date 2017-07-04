module.exports = function(httpServer){
    var io = require('socket.io').listen(httpServer);

    var numUsers = 0;

    io.on('connection', function(socket){
         var addedUser = false;

          socket.on('new message', function (data) {
            // we tell the client to execute 'new message'
            socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
            });
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
         });

           socket.on('disconnect', function () {
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