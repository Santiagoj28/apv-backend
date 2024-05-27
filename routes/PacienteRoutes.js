import express from 'express';
import { agregarPaciente,obtenerPacientes,obtenerPaciente, actualizarPaciente, deletePaciente } from '../Controllers/PacienteController.js';
import checkAuth from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/')
    .post(checkAuth ,agregarPaciente)
    .get(checkAuth,obtenerPacientes);

router.route('/:id')
    .get(checkAuth,obtenerPaciente)
    .put(checkAuth,actualizarPaciente)
    .delete(checkAuth,deletePaciente)
   

export default router
