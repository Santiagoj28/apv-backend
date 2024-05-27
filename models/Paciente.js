import mongoose from "mongoose";

const PacientesSchema = mongoose.Schema({
    nombre :{
        type : String,
        require:true,
        trim: true
    },
    propietario:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
       
    },
    fecha:{
        type:Date,
        require:true,
        
      
    },
    sintomas:{
        type:String,
        require:true,
        trim:true
    },
    veterinario:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario'
    },
    createAt:{
        type:Date,
        default:Date.now()

    },
    updateAt:{
        type:Date,
        default:Date.now()
    }
},{
    timesstamps:true,
})

const Paciente = mongoose.model('Paciente',PacientesSchema);

export default Paciente;