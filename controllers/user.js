import express from "express";
import user from '../modals/user.js'
import bcrypt from 'bcrypt';
import sendConfirmationEmail from "../middlewares/nodemailer.js";
import jwt from 'jsonwebtoken';



 

 //activation code
 const listofnumber = "0123456789";
 var  activationCode ="";
 for(let i = 0; i<5 ; i++){
   activationCode+= listofnumber[Math.floor(Math.random()*listofnumber.length)];
 }



  //register
export async function register ( req,res){
    const { fullName, email, password,mobile,Adresse,role} = req.body;


    if (!(email && password && fullName && mobile && Adresse)) {
      res.status(400).send("All input is required");
    }


    const oldUser = await user.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }


      const hashedPassword = await bcrypt.hash(req.body.password, 10)

     const listofnumber = "0123456789";
     var  activationCode ="";
     for(let i = 0; i<5 ; i++){
       activationCode+= listofnumber[Math.floor(Math.random()*listofnumber.length)];
     }
      user.create(
       
        {
            fullName:req.body.fullName,
            email: req.body.email,
            Adresse: req.body.Adresse,
            mobile: req.body.mobile,
            password: hashedPassword,
            activationCode:activationCode,

            
            
        }
    ).then(newUser => {

        res.status(200).json({
          message:" User Added Successfully!",newUser});
          sendConfirmationEmail(newUser.email, newUser.activationCode);
       
    }).catch(err => {
        res.status(500).json({error: err});
    });

}


// LogIn
export async function logIn(req,res){
  try {

    const { email, password } = req.body;

   const User= await user.findOne({email : req.body.email });

      if(!User){
        return res.status(404).send("Invalid Email!")
      }
    const validPass = await bcrypt.compare(req.body.password, User.password)
    if (!validPass) return res.status(400).send("Invalid Password") ;

    if (User.verified == false){

      sendConfirmationEmail(req.body.email, User.activationCode);
       res.status(201).send({message: "Please Verify Your Email!", });

    } 
    if (User.role == "Admin"){
       res.status(203).send();
    }
      res.status(200).send(User);      
  
   
  } catch (err) {
    console.log(err);
  }
  

}

//verify user
export   function verifyUser(req, res, next)  {
  user.findOne({
    activationCode: req.body.activationCode,
  })
    .then((User) => {
      if (!User) {
        return res.status(404).send({ message: "User Not found." });
      }
      User.verified = true;
      User.save((err) => {
        if (err) {
         return res.status(500).send({ message: err });      
        }
      });
      res.status(200).send({ User });    })
    .catch((e) => console.log("error", e));
}


//  reset Password email
export async function resetPass(req,res){
 var User = await user.findOne({
      email:req.body.email});
  
      if(!User){
       
        return res.status(404).send({ message: "User Not Found" });
      }else if (User){

  const listofnumber = "0123456789";
  var  activationCode ="";
 for(let i = 0; i<5 ; i++){
   activationCode+= listofnumber[Math.floor(Math.random()*listofnumber.length)];
 }
        var  newCode= activationCode
        User.activationCode=newCode;
        User.save();
        sendConfirmationEmail (req.body.email,newCode);
        return res.status(200).send({ message: "Reset Password Email was sent" });
  
      }else {
        return res.status(500).send({ message: "err" });

      }
    
  
}

// Update User Password
export async function UpdatePass(req,res){
      
  let hashedPass = await bcrypt.hash(req.body.password, 10)
  user.findOneAndUpdate(req.params.email,{"password": hashedPass}) .then((err,result) => {
    if (!err) {
    return res.status(200).send("Password Updated");
    
    }
  else{
   console.error(err);
  }
   
  })
}

  
  
  export async function UpdateProfile(req, res) {
  const id = req.params.id;
  const update = {};
  
  if (req.body.fullName) {
    update.fullName = req.body.fullName;
  }
  if (req.body.email) {
    update.email = req.body.email;
  }
  if (req.body.Adresse) {
    update.Adresse = req.body.Adresse;
  }
  if (req.body.mobile) {
    update.mobile = req.body.mobile;
  }
 

  try {
    const updatedUser = await user.findByIdAndUpdate(id, update, { new: true });
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}
   

  

  // user activation status
  export   function IsActivated(req, res, next)  {
   var User = user.findOne({
      email: req.body.email,})
      
        if (!User) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        let r = res.send(User.verified)
  
        if(r == true){
            res.status(200).send({ message: true });
  
        }
        else{
            res.status(403).send({ message: false });
        }
  
        next();
      }
  
      export async function getOnce(req,res){

        await user
        .findById(req.params.id)
        .then(docs =>{
            res.status(200).json(docs);
        })
        .catch(err=>{
            res.status(500).json({error:err});
        });
    }
    
    export async function patchOnce(req,res){
    
        await user
        .findByIdAndUpdate(req.params.id, req.body)
        .then(docs=>{
         res.status(200).json(docs);
        })
        .catch(err=>{
         res.status(500).json({error:err});
        });
    
    }

 // Create a new Reclamation
 export async function createUser(req, res) {
  try {
    const User = new user(req.body);
    await User.save();
    res.status(201).send(User);
  } catch (err) {
    res.status(400).send(err);
  }
}
    
    export async function deleteOnce(req,res){
        await user
        .findByIdAndRemove(req.params.id)
        .then(docs=>{
         res.status(200).json(docs);
        })
        .catch(err=>{
         res.status(500).json({error:err});
        });
    }


export async function getAllUsers(req, res) {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}






