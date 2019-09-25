const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username : String,
    password : String,
    email : String
});

userSchema.methods.encriptar = async (password) => {
    const salt = await bcrypt.genSalt(10); //aplicamos 10 veces el hash para cifrar
    return bcrypt.hash(password, salt);
}

userSchema.methods.comparar = function(password) { //no uso funciones flechas porque necesito usar el this para acceder a la contrasenia de userSchema
    return bcrypt.compare(password, this.password); //devuelve un true or false
}

module.exports = model('User', userSchema) //asi se guarda en la base de datos, como user, usando lo que hay en userchema y con el modelue.export 
                                                                            //para usar en otro lugares