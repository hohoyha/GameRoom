
var usermgr = new UserManager();

module.exports = function(socket, io){
    // Join(Create), leave
    
    return {
        join: function(name) {
            console.log("Join:" + name);
            socket.join(name);
            socket.room = name;

            var nick =  usermgr.requestName();
            var user = new User(nick);
            usermgr.add(user);
        },

        leave: function(name) {
            console.log("Leave:");
            socket.leave(socket.room);
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
            io.in(socket.room).emit('chat', data );    
        },

        send: function(){
            io.in(socket.room).emit('hello', {hi:'world'});
        },

        boardcast: function(){
            // socket.boardcast.to('hoho').emit('hello2', {hi:'world'});
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