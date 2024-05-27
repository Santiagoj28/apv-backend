import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarID.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


const registrar = async(req , res)=>{
    const {nombre,email} = req.body

   //revisar si hay usuarios duplicados
   const existeUsuario = await Veterinario.findOne({email})

   if(existeUsuario){
    const error = new Error('usuario ya registrado')
    return res.status(400).json({msg: error.message});
   }
   try {
    //guardar un nuevo veterinario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    //enviar el email
    emailRegistro({
        email,
        nombre,
        token : veterinarioGuardado.token
    })

    res.json({msg: 'Creada correctamente,Verifica tu email para confirmar tu cuenta...'})
   } catch (error) {
    console.log(error)
   }

   
}

const confirmar = async (req , res) =>{
   
    const {token} = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token})
    if(!usuarioConfirmar){
        const error = new Error('token no valido')
        return res.status(404).json({msg: error.message}); 
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save()
        res.json({msg:'usuario confirmado correctamente...'});

    } catch (error) {
        console.log(error)
    }
    
}

const autenticar =async (req,res)=>{
    const { email,password }= req.body;
    //1-comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});
    if(!usuario){
        const error = new Error('Usuario no existe')
        return res.status(403).json({msg: error.message}); 
    }

    //2-cuenta confirmada
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(400).json({msg:error.message})
    }
    
    //3-password correcto
    if(await usuario.comprobarPassword(password)){ 
        
        //4-autenticar a el usuario
        res.json({
            _id : usuario._id,
            nombre : usuario.nombre,
            email : usuario.email,
            token : generarJWT(usuario.id)
         })
    }else{
        console.log('password incorrecto')
        const error = new Error('Password Incorrecto');
        return res.status(400).json({msg:error.message})
    }
    
    
}
const actualizarPassword = async (req,res)=>{
    //leer los datos
    const {id}  =req.veterinario;
    const {pwd_actual,pwd_nuevo}=req.body;
    //comprobar que el usuario existe
    const veterinario = await Veterinario.findById(id);  
    if(!veterinario){
        const error = new Error('Usuario no existe')
        return res.status(403).json({msg: error.message}); 
    }
    
    //comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
       
        veterinario.password =pwd_nuevo;
        await veterinario.save();
        res.json({msg:'password  almacenado correctamente'}) 
        
        
    }else{
        const error = new Error('El Password es incorrecto')
        return res.status(403).json({msg: error.message});
    }
    //almacenar el nuevo password
}

const olvidePassword = async(req,res)=>{
    const {email}=req.body;
    const existeVeterinario = await Veterinario.findOne({email});

    if(!existeVeterinario){
        const error = new Error('Usuario no Existe');
        return res.status(400).json({msg: error.message})
    }

    try {
        existeVeterinario.token = generarID();
        await existeVeterinario.save();
        //enviar el email
        emailOlvidePassword({
        email,
        nombre : existeVeterinario.nombre,
        token : existeVeterinario.token
        })
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
}
const comprobarToken = async(req,res)=>{
    const {token} = req.params;

    const usuarioToken = await Veterinario.findOne({token})

    if(usuarioToken){
        res.json({msg: 'Token valido y usuario existe'})
        
    }else{
        const error = new Error('Token no Valido');
        return res.status(400).json({msg : error.message});
    }

}
const nuevoPassword = async(req,res)=>{
    const {token} = req.params;
    const {password}= req.body;
    
    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('Hubo un error');
       return res.status(404).json({msg : error.message});
    }
    try {
        veterinario.token = null; 
        veterinario.password = password;
        await veterinario.save();
        
        res.json({msg: 'Password Actualizado Correctamente'})
    } catch (error) {
        console.log(error);
    }

}
const perfil = (req , res)=>{
    const {veterinario}=req
    res.json(veterinario)
}
const actualizarPerfil = async(req , res)=>{
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.msg})
    }

    const {email}= req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail){
            const error = new Error("Ese email ya esta en uso");
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.web = req.body.web ;
        veterinario.telefono = req.body.telefono ;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
}
export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    actualizarPerfil,
    nuevoPassword,
    actualizarPassword
}