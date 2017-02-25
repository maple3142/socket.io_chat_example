var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var fs=require('fs');
var path=require('path');
var schedule=require('node-schedule');

var log=console.log;
console.log=t=>{
	log(t);
	fs.appendFile("./log.txt",t+'\n',err=>{}); 
};
var error=console.error;
console.error=t=>{
	error(t);
	fs.appendFile("./error.txt",t+'\n',err=>{}); 
};

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'));
});
app.get('/js/:js',(req,res)=>{
  var d=path.join(path.join(__dirname,'js'),req.params.js);
  fs.exists(d,exist=>{
    if(exist)res.sendFile(path.join(path.join(__dirname,'js'),req.params.js));
    else{
      res.status(404);
      res.send('<h1>File not found!</h1>');
    }
  });
});
app.all('*',(req,res)=>{
  res.redirect('http://maple3142.net/');
});
app.listen(80,()=>console.log('server listen on *80'));

io.on('connection',(socket)=>{
  socket.on('userjoined',msg=>{
    msg=JSON.parse(msg);
    console.log(msg.nick+' joined '+Date.now()+' '+socket.request.connection.remoteAddress);
    io.emit('userjoined',JSON.stringify({
        nick: msg.nick,
        h: new Date().getHours(),
        m: new Date().getMinutes()
    }));
  });
  socket.on('userleaved',msg=>{
    msg=JSON.parse(msg);
    console.log(msg.nick+' leaved '+Date.now()+' '+socket.request.connection.remoteAddress);
    io.emit('userleaved',JSON.stringify({
        nick: msg.nick,
        h: new Date().getHours(),
        m: new Date().getMinutes()
    }));
    socket.disconnect();
  });
  socket.on('chat',msg=>{
    msg=JSON.parse(msg);
    console.log(msg.msg+' '+socket.request.connection.remoteAddress+' '+msg.nick+' '+Date.now());
    io.emit('chat',JSON.stringify({
        msg: msg.msg,
        nick: msg.nick,
        h: new Date().getHours(),
        m: new Date().getMinutes()
    }));
  });
});
var rule=new schedule.RecurrenceRule();
rule.hour=0;
rule.minute=0;
rule.second=0;
schedule.scheduleJob(rule,()=>{
  var s=new Date().getMonth()+'/'+new Date().getDate();
  console.log(s);
  io.emit('daychange',JSON.stringify({
    s: s
  }));
});

http.listen(8080,()=>{
  console.log('socket server listen on *8080');
});

var rl=require('readline');
var l=rl.createInterface({
  input: process.stdin
});
l.on('line',c=>{
  try{
    log('---EVAL RESULT START---');
    log('INPUT: '+c)
    log(eval(c));
    log('---EVAL RESULT END-----');
  }catch(e){
    console.error('---EVAL EXCEPTION---');
    console.error(e);
  }
});