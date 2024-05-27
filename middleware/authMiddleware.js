import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth =async (req,res,next)=>{
    
let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        //validar y revisar que el token sea valido
        try {
            //separar el beader del token y traernos el token
            token = req.headers.authorization.split(' ')[1];
            
            //verificar el token valido
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            req.veterinario = await Veterinario.findById(decoded.id).select(
                "-password -token -confirmado"
            )
            
            return next();

        } catch (error) {
            const e = new Error('Token no valido')
            return res.status(403).json({msg: e.message})
        }
    }
    
    if(!token){
        const error = new Error('Token no valido o no existe')
       return res.status(403).json({msg: error.message})
    }

    next();
}
export default checkAuth;