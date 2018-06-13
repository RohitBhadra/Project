const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connect to mongo
mongo.connect('mongodb://127.0.0.1', function(err, db){
    if(err){ throw err; }
    console.log('MongoDB Connected!!');
    const db1 = db.db('mongochat')
    // console.log(db1)

// connect to socket io
client.on('connection', function(socket){
    let chat = db1.collection('chats');
    // console.log('chat', chat.dbName)

    // create function to send status
    sendStatus = function(s){
        socket.emit('status', s);
    }

    // get chat from mongo collection
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
        if(err){ throw err; }

        // emit messages
        socket.emit('output', res);
    });

    //Handle Input Events
    socket.on('input', function(data){
        let name = data.name;
        let message = data.message;

        if(name == '' || message == ''){
            sendStatus('please enter');
        } else{
            chat.insert({name: name, message: message}, function(){
                client.emit('output', [data]);
                sendStatus({
                    message: 'Message Sent',
                    clear: true
                });
            });
        }
    }); 
    //clear
    socket.on('clear', function(data){
        chat.remove({}, function(){
            socket.emit('cleared');
        });
    });
});

});