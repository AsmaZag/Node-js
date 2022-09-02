const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
var sha1 = require('sha1');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
const { json } = require('body-parser');
var cors = require('cors')

app.use(cors())
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  port:3306,
  password: "aseds",
  database: "nodejs",
});

/*router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

router.use('/utilisateurs/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});
*/
app.use(session({secret: 'qwerty', saveUninitialized: true, resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const middleware= (req,res,next)=>{
  try{
    var token=req.headers.authorization.split('=')[1];
    if(login_checker(token) == true){
      next();
    }
    else {
      res.sendStatus(404);
    }; 
    }  
    catch(error){
      console.log(error)
    } 
};
  
router.use('/utilisateurs',middleware);
router.use('/utilisateurs/:id',middleware);

function login_checker(token){
  try {
		payload = jwt.verify(token, 'secret')
  
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			return false
		}
		return false
	}
  return true
};

router.get('/utilisateurs',(req,res) =>{
    sql='SELECT * FROM utilisateurs;'
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send(JSON.stringify(result));
        });
});

router.post('/login',(req,res) =>{
  
  var email=req.body.email;
  var password=sha1(req.body.password);
  
    sql="SELECT * FROM nodejs.utilisateurs WHERE email='"+email+"'AND password='"+password+"'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if(result.length >0){
          var token=jwt.sign({result},"secret");
          var id=result[0].id;
          var name=result[0].name;
          res.json({token , id, name}); 
        }   
        else{
          res.sendStatus(404);
      }
    });
});

router.post('/chat/:id1/:id2',(req,res) =>{
  
  var id2=req.params.id2;
  var id1=req.params.id1;
 
  sql="SELECT * FROM nodejs.chat WHERE (user1,user2)=('"+id1+"','"+id2+"') OR (user2,user1)=('"+id1+"','"+id2+"') ";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if(result.length >0){
          res.send(JSON.stringify(result[0].chatId));
        }   
        else{
          sql= "INSERT INTO chat(user1,user2) VALUES('"+id1+"','"+id2+"')";
          con.query(sql, function (err) {
          if (err) throw err;
            
          });
          
          sql= "SELECT LAST_INSERT_ID();";
          con.query(sql, function (err, result) {
          if (err) throw err;
          res.send(JSON.stringify(result[0].LAST_INSERT_ID()));
          });
      }
    });
});

router.post('/sendMessage/:chatId/:sender',(req, res) => {
  var message=req.body.message;
  var sender=req.params.sender;
  var chat_id=req.params.chatId;

  sql="SELECT * FROM chat WHERE chatId='"+chat_id+"';";
  con.query(sql, function (err, result) {
    if (err) throw err;
    if(result.length>0 && (result[0].user1==sender || result[0].user2==sender)){
      sql="INSERT INTO messages(chat_id,sender,message) VALUES(\'"+chat_id+"\','"+sender+"',\'"+message+"\'); ";
      con.query(sql, function (err, result) {
      if (err) throw err;
      res.send(message);
  });
    }
    else {
      res.status(404).json({message:'Chat or sender doesn\'t exist.'});
    }
  });

});

router.get('/listMessages/:chatId',(req,res)=>{
  var chat_id=req.params.chatId;
  sql="SELECT message FROM messages WHERE chat_id='"+chat_id+"';";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
})

router.get('/utilisateurs/:id',(req,res) =>{
  
  var id=req.params.id;
  
  con.connect(function(err) {
      if (err) throw err;
      sql='SELECT * FROM nodejs.utilisateurs WHERE id='+id+';'
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      });
    });
});

router.put('/utilisateurs/:id',(req,res) =>{ 
  var id=req.params.id;
  var email=req.body.email;
  var name=req.body.name;
  var role=req.body.role;
  var password=sha1(req.body.password);
  
      sql="UPDATE utilisateurs SET email='"+email+"', name='"+name+"', role='"+role+"', password='"+password+"'WHERE id='"+id+"'";
      //res.send(sql);
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      });
});

router.delete('/utilisateurs/:id',(req,res) =>{         
  var id=req.params.id;
 
      sql="DELETE FROM utilisateurs WHERE id='"+id+"'";
      //res.send(sql);
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      });
});
 

router.post('/utilisateurs',(req, res) =>{
  
    var email = req.body.email;
	  var password = sha1(req.body.password);          
    var name = req.body.name;
    var role = req.body.role;
     
    sql= "INSERT INTO utilisateurs(email,name,password,role) VALUES(\'"+email+"\','"+name+"',\'"+password+"\','"+role+"\');";
    //res.send(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.status(201).json({message:'INSERTED'});
    });
 });    

app.use('/', router);

app.listen(process.env.port || 3000);
console.log('Web Server is listening at port '+ (process.env.port || 3000));


