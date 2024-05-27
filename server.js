import express from 'express';
import conectarDB from './config/DB.js';
import cors from 'cors';
import VeterinarioRoutes from './routes/VeterinarioRoutes.js';
import pacienteRoutes from './routes/PacienteRoutes.js';

const app = express();
app.use(express.json())
conectarDB()

const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin,callback){

        if(dominiosPermitidos.indexOf(origin) !== -1){
            //el origen del request esta permitido
            callback(null,true)
        }else{
            callback(new Error('No permitido por cors'))
        }
    }
}    
 
app.use(cors(corsOptions))

app.use('/api/veterinarios',VeterinarioRoutes);
app.use('/api/pacientes',pacienteRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`servidor funcionando en el puerto ${PORT}`)
});