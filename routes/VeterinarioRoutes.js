import express from 'express';
import { perfil, registrar,confirmar,autenticar,comprobarToken,nuevoPassword, olvidePassword,actualizarPerfil,actualizarPassword } from '../Controllers/VeterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',registrar)
router.get('/confirmar/:token',confirmar)
router.post('/login',autenticar)
router.post('/olvide-password',olvidePassword)
router.route('/restablecer-password/:token').get(comprobarToken).post(nuevoPassword)
 

//custom middleware para proteger paginas
router.get('/perfil',checkAuth,perfil)
router.put('/perfil/:id',checkAuth,actualizarPerfil)
router.put('/actualizar-password',checkAuth,actualizarPassword)


export default router;