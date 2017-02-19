var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var fs=require('fs');

var log=console.log;
console.log=t=>{
	log(t);
	fs.appendFile("./log.txt",t+'\n',(err)=>{
		if(err)return;
	}); 
};
app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/index.html');
});
app.listen(80,()=>console.log('server listen on *80'));

io.on('connection',(socket)=>{
  socket.on('userjoined',msg=>{
    msg=JSON.parse(msg);
    console.log(msg.nick+' joined');
    io.emit('userjoined',JSON.stringify({
        nick: msg.nick
    }));
  });
  socket.on('userleaved',msg=>{
    msg=JSON.parse(msg);
    console.log(msg.nick+' leaved');
    io.emit('userleaved',JSON.stringify({
        nick: msg.nick
    }));
    socket.disconnect();
  });
  socket.on('chat',msg=>{
    msg=JSON.parse(msg);
    console.log(msg.msg+' '+socket.request.connection.remoteAddress+' '+msg.nick);
    io.emit('chat',JSON.stringify({
        msg: msg.msg,
        nick: msg.nick
    }));
  });
});

http.listen(8080,()=>{
  console.log('socket server listen on *8080');
});