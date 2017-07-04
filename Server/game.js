

var userlist = [];
function findUser(id){

    var eachValue = null;

    for(var i = 0; i < userlist.length; i++){
        if(userlist[i].id === id){
            eachValue = userlist[i];
            break;
        }
    }

    // userlist.forEach(function(user){
    //     if(user.id === id ) {
    //         eachValue = user;
    //         break;
    //     }
    // });

    return eachValue;
}

var namelist = ['hoho', 'kong', 'bong'];
function User(nick, age, id){ 
    this.name = nick;
    this.age = age;
    this.id = id;
    // this.name : 'hoho',
    // setName: function(nick){
    //     this.name = nick;   
    // }
};

var roomlist = [];
function roomName(name, id){
    this.name = name;
    this.id = id;
}


module.exports = function(httpServer){
    var io = require('socket.io').listen(httpServer);
   
    io.sockets.on('connection',function(socket){
        var temp = new User(namelist[0], 10, socket.id); 
        namelist.shift();

        socket.emit('toclient',{msg: temp.name + ': Welcome !' + socket.id});
        userlist.push(temp);


        socket.on('disconnect', function() {
             var find = findUser(socket.id);
            if(find != null) {
                namelist.push(find.name);
                console.log( find.name + ': user logout');
            } 
        });

        socket.on('fromclient',function(data){
            var find = findUser(socket.id);
            data.msg = find.name + ': ' + data.msg;
            
            socket.broadcast.emit('toclient', data); // 자신을 제외하고 다른 클라이언트에게 보냄
            socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
            console.log('Message from client :' + data.msg);
        });

        socket.on('createRoom', function(data){
            var find = findUser(socket.id);
            socket.join()
        });
    });
}

