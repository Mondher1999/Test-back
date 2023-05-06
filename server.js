import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import userRouter from './routes/user.route.js';
import stationRouter from './routes/station.route.js';
import transportRouter from './routes/transport.route.js';
import reclamationRoute from './routes/reclamation.route.js';
import multer from 'multer';
import sharp from 'sharp';
import __dirname from 'path';
import path from 'path';

const app = express();
const port = process.env.port || 9090;
const databaseName ='transportyniAndroid';

mongoose.set('debug', true);

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://Transportyni:BJq7tCqx96X2Rz4D@transportyni.kltf2wv.mongodb.net/TransportyniAndroid?retryWrites=true&w=majority')
  .then(() => {
    console.log(`Connected to MongoDB Atlas successfully!`);
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB Atlas: ${error}`);
  });


app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({encoded : true}));

app.use('/',userRouter);
app.use('/station',stationRouter);
app.use('/transport',transportRouter);
app.use('/reclamation',reclamationRoute);
  
app.use('/image', express.static('/public/images'));

const storage = multer.diskStorage({
  destination: (req,file, cb) => {
    cb( null , './public/images')
  },
  filename:  (req, file ,cb) => {
        
        cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
})

const upload = multer({storage: storage})
//upload image
app.post("/image", upload.single('upload'), (req,res) => {
    res.send("Image uploaded")
})

app.listen(port, () => {
  console.log(`Server running at http://hostname:${port}/`);
});