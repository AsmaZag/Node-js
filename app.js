const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
var sha1 = require('sha1');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
const { json } = require('body-parser');

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
    var token=req.headers.authorization.split(' ')[1];
    
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
  
  con.connect(function(err) {
    if (err) throw err;
    sql="SELECT * FROM nodejs.utilisateurs WHERE email='"+email+"'AND password='"+password+"'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if(result.length >0){
          var token=jwt.sign({result},"secret");
          res.json({token}); 
        }   
        else{res.json({message:'Invalide email or password'})}
    });
      
  });
});




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
  var password=sha1(req.body.password);
  
  con.connect(function(err) {
      if (err) throw err;
      sql="UPDATE utilisateurs SET email='"+email+"', name='"+name+"', password='"+password+"'WHERE id='"+id+"'";
      //res.send(sql);
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      });
      
    });
  
  
});


router.delete('/utilisateurs/:id',(req,res) =>{         
  var id=req.params.id;
  con.connect(function(err) {
      if (err) throw err;
      sql="DELETE FROM utilisateurs WHERE id='"+id+"'";
      //res.send(sql);
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result));
        
      });
      
    });
  
  
});
 

router.post('/utilisateurs',(req, res) =>{
  
    var email = req.body.email;
	  var password = sha1(req.body.password);          
    var name = req.body.name;
     
    con.connect(function(err) {
      if (err) throw err;
    sql= "INSERT INTO utilisateurs(email,name,password) VALUES(\'"+email+"\','"+name+"',\'"+password+"\');";
    //res.send(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.status(201).json({message:'INSERTED'});
    });
    
  });
 });    
 


app.use('/', router);

app.listen(process.env.port || 3000);
console.log('Web Server is listening at port '+ (process.env.port || 3000));




