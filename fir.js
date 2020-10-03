
var express=require('express')
const app=express();
//body parser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var MongClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

const dbName='hospitalManagement';
//connecting to servire file and config file
let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');

let db1
MongClient.connect(url, { useUnifiedTopology: true },function(err, client) {
  if (err) throw err;
  db1=client.db(dbName);
  console.log(`Database created! :${url}`);
  
  
});
app.use(express.json());

//Read the hospitaldetails
app.get('/hospitalDetails',middleware.checkToken,(req,res)=>{
    db1.collection('hospitalDetails').find().toArray().then(resu=>res.json(resu));
    
    

});
//read the ventilatordetails
app.get('/ventilatorDetails',middleware.checkToken,(req,res)=>{
  db1.collection('ventilatorDetails').find().toArray().then(resu=>res.json(resu));
  
  

});

//serach ventilators by hospital name
app.get('/ventilatorsByHname',middleware.checkToken,(req,res)=>{
  var hname=req.query.hname;
  var quer={"name":{$regex:hname,$options:'i'}};
  db1.collection('ventilatorDetails').find(quer).toArray().then(resu=>res.json(resu));

});


//search ventilators by status
app.use(express.json());
app.post('/ventilatorsByStatus',middleware.checkToken,(req,res)=>{
  var status=req.body.status;
  var quer={"status":status};
  db1.collection('ventilatorDetails').find(quer).toArray().then(resu=>res.json(resu));
  
  

});
//search hospital by name
app.get('/hospitals/:name',middleware.checkToken,(req,res)=>{
  
  var name=req.params.name;
  var quer={"name":{$regex:name,$options:'i'}};//not case sensitive 
  db1.collection('hospitalDetails').find(quer).toArray().then(resu=>res.json(resu));

});


//add ventilator 
app.post('/ventilatoradd',middleware.checkToken,(req,res) => {

  var ob = { "hId": req.body.hId, "ventilatorId": req.body.ventilatorId, "name": req.body.name, "status": req.body.status };
  db1.collection('ventilatorDetails').insertOne(ob, function (err, result) {
    
    res.json("1 inserted");

  });
});


//delete ventilator by id
app.delete('/ventilators/:ventilatorId',middleware.checkToken,(req,res) => {
  
  
    var myquery={"ventilatorId":req.params.ventilatorId};
    db1.collection("ventilatorDetails").deleteOne(myquery, function(err, result) {
      if (err) throw err;
      res.json("1 doc deleted");
      
    });
});

//update ventilator details
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
  var vid={ventilatorId:req.body.ventilatorId};
  var val={$set:{status:req.body.status}};
  db1.collection("ventilatorDetails").updateOne(vid,val, function(err, result) {
    if (err) throw err;
    res.json("1 doc updated");
    
  });
})

app.listen(7800);