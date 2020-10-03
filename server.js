const express=require('express');
const bodyParser=require('body-parser');
let jwt=require('jsonwebtoken');
let config=require('./config');
let middleware=require('./middleware');
let app=require('./fir.js');
 
class HandlerGenerator {
    login (req, res) {
      let username = req.body.username;
      let password = req.body.password;
      // For the given username fetch user from DB
      let mockedUsername = 'lalitha';
      let mockedPassword = 'priya@';
  
      if (username && password) {
        if (username === mockedUsername && password === mockedPassword) {
          let token = jwt.sign({username: username},
            config.secret,
            { expiresIn: '28h' // expires in 28 hours
            }
          );
          // return the JWT token for the future API calls
          res.json({
            success: true,
            message: 'Authentication successful!',
            token: token
          });
        } else {
          res.json({
            success: false,
            message: 'Incorrect username or password'
          });
        }
      } else {
        res.json({
          success: false,
          message: 'Authentication failed! Please check the request'
        });
      }
    }
testFunction (req, res) {
    res.json({
      success: true,
      message: 'Testing succesful'
    });
  }
}







//starting point of the server
function main(){
    let app=express();//Export app for othe routes to use
    let handlers=new HandlerGenerator();//object of class
    const port =100;
    app.use(bodyParser.urlencoded({
        extended:true
    }));
    app.use(bodyParser.json());
    //routes and handlers
    app.post('/login',handlers.login);
    app.get('/',middleware.checkToken,handlers.testFunction);
    app.listen(port,()=>console.log(`Server is listening on port :${port}`))
}
main();
