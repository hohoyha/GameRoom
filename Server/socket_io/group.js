
var usermgr = new UserManager();

module.exports = function(socket, io){
    // Join(Create), leave
    
    return {
        join: function(name) {
            console.log("Join:" + name);
            socket.join(name);

            var nick =  usermgr.requestName();
            var user = new User(nick);
            usermgr.add(user);
        },

        leave: function(name) {
            console.log("Leave:");5
            socket.leave(name);
        },
        send: function(){
            io.sockets.in('hoho').emit('hello', {hi:'world'});
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