import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarID from "../helpers/generarID.js";

const VeterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        require : true,
        trim : true
    },
    password: {
        type: String,
        require : true,
        trim : true
    },
    email: {
        type : String,
        require : true,
        unique : true,
        trim : true,
    },
    telefono : {
        type : String,
        default :null,
        trim : true,
    },
    web : {
        type : String,
        default :null,
        trim : true,
    },
    token : {
        type : String,
        default : generarID()
    },
    confirmado : {
        type : Boolean,
        default :null,
    }
});
VeterinarioSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
});

VeterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario,this.password)
}
const Veterinario = mongoose.model('Veterinario',VeterinarioSchema);

export default Veterinario