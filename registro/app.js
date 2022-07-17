require('dotenv').config()
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const {subirArchivo} = require('./helpers/uploadFiles');
const db = require('./helpers/db');
const User = require('./models/User');

const app = express();

const conectarDB = async()=>{
    try {
        require('./models/User');
        await db.sync();
        console.log('Base de datos creada');
    } catch (error) {
        console.log(error);
    }
}

//Middlewares
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Carga de archivos
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//Handlebars
app.set('view engine', 'ejs');

conectarDB();

//Routes
app.get('/', (req,res)=>{
    res.render('home');
});

app.post('/', async(req,res)=>{
    

    try{
        const {name} = req.body;
        const image = await subirArchivo(req.files);
        await User.create({
            name,
            image
        });
    }catch(error){
        console.log(error);
    }

    res.json({
        msg: 'Usuario guardado correctamente'
    });

})


app.listen(3000, ()=>{
    console.log('Server on port 3000');
});

