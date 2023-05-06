


    // Verify token


 function VerifyToken(req,res,next){
  // GEt auth header value
  const bearerHeader = req.headers['authorization'];

  // Check if bearer undefined

  if(typeof bearerHeader !== 'undefined'){

    //split at space
    const bearer = bearerHeader.split(' ');

    // get Token from array

    const bearerToken = bearer[1];

    //Set the token

    req.token = bearerToken;

    // next Middleware

    next();

  }else{
    // Forbidden
    res.sendStatus(403);

  }


 }
 export default VerifyToken;