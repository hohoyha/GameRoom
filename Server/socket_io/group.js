
var usermgr = new UserManager();

var count = 0;

module.exports = function(socket, io){
    // Join(Create), leave
    
    return {
        join: function(name) {
            count++;
            
            socket.join(name, () => {
                let rooms = Object.keys(socket.rooms);
                console.log(rooms);

                var test = io.rooms[socket.id];
            });

           
            var count = io;
            console.log("Join:" + name + ":" + count);
            socket.room = name;
            socket.name = 'Guest' + count;

            var nick =  usermgr.requestName();
            var user = new User(nick);
            usermgr.add(user);
        },

        leave: function() {

            var count = io.rooms.length;
            console.log("Leave:" + count );
           
            // socket.leave(socket.room);
        },

        joined : function(name){
            //io.in(name).emit('joinedUser', {message:'test'});
            socket.broadcast.to(socket.room).emit('joinedUser', {message:'joinedUser test'});
        },

        left : function(){
            //io.in(name).emit('joinedUser', {message:'test'});
            socket.broadcast.to(socket.room).emit('joinedUser', {message:'joinedUser test'});
        },

        chat: function(data){
            data.message = socket.name + ':' +  data.message;
            io.in(socket.room).emit('chat', data );    
        },

        send: function(){
            io.in(socket.room).emit('hello', {hi:'world'});
        },

        boardcast: function(){
            // socket.boardcast.to('hoho').emit('hello2', {hi:'world'});
        },

        roomList : function(){
                // console.log('ROOM LIST', io.adapter.rooms);
                // console.log('ROOM', io.adapter.rooms.count);
                var roomList = [];

                Object.keys(io.adapter.rooms).forEach((roomid) => {
                    // console.log('current room id : ' + roomid);
                
                    var outRoom = io.adapter.rooms[roomid];

                    var foundDefault = false;
                    var index = 0;

                    Object.keys(outRoom.sockets).forEach((key) => {
                         console.log('#' + index + ' : ' + key + ', ' + outRoom.sockets[key]);

                         if(roomid == key) {
                             foundDefault = true;
                            //  console.log('this is default room');
                         }

                         index++;
                    });

                    if(!foundDefault){
                        roomList.push(roomid);
                    }
            });

            console.dir(roomList);

            return roomList;
        }

    }
};

function UserManager() 
{
    this.list = [];
    this.count = 0;
    this.add = function(user) {
        this.list.push(user);
       console.log(this.list.length);
       this.count++;

    };
    this.remove = function(user){
        this.list.splice(this.list.indexOf(user), 1);
    }

    this.requestName = function(){
        return 'Guest' + this.count;
    }
}

function User(name){
    this.name = name;
}