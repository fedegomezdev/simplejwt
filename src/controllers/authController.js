const {Router} = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const verifyToken = require('./verifyToken');

router.post('/signup', async (req, res, next) => {
    const {username, email, password} = req.body;
    const user = new User({ //seria una instancia del modelo User
        username: username,
        password: password,
        email: email
    })
    user.password = await user.encriptar(user.password); //vuelve a escribir lo q hay en user.password pero enncriptado usando lo del modelo User
    console.log(user);
    await user.save(); //el objeto user ahora se guarda en mongoDB
    
    //asi se registra o crea un jwt, se le pasa un payload, q seria el id del usuario, un secret y opcion mas configuracion 
   const token = jwt.sign({id : user._id}, config.secret , {
        expiresIn : 60 * 60 * 24 //para que exprire en un dia, 
    })

    res.json({auth:true, token: token });
})



router.get('/profile', verifyToken, async (req, res, next) => { //antes que llegue a la funcion que pase por veryfytoken

    const user = await User.findById(req.usuarioId, {password:0}) //la contrasenia no quiero q la pase
    if(!user){
        res.status(404).send('no user found')
    }

    res.json({message:'correctooo', user})
})

router.get('/dashboard', verifyToken, (req, res) =>{
    res.json('dashboard')
})


router.post('/login', async (req, res, next) => {
    const {email, password} = req.body;
    console.log(email, password); 

    const user = await User.findOne({email:email});
    if(!user){
        return res.status(404).send('usuario no existe');
    }

   //validamos la pwd con el metodo que creamos en el UserSchema     
   const validPw = await user.comparar(password);
   if (!validPw){
       return res.status(401).json({auth:false, token: null});
   }

   //si todo es correcto, generamos un token
   const token = jwt.sign({id: user._id} , config.secret , {
       expiresIn: 60 * 60 * 24 
   })
    res.json({auth: true, token : token });
})





module.exports = router;