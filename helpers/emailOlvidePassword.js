import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos)=>{

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
  
      const {email , nombre , token} = datos;
  
      //enviar email
      const info = await transport.sendMail({
        from : 'APV Administrador de Pacientes de Veterinarias',
        to: email,
        subject: 'Restablece tu password en tu cuenta APV',
        text : 'Restablece tu password en tu cuenta APV',
        html: `<p>Hola ${nombre}, Haz solicitado restablecer tu password.</p>
            <p>Sigue el siguiente enlace para generar un nuevo password:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a> </p>
            
            <p>Si tu no solicitaste esto puedes ignorar este mensaje</p>`
      })
  
      console.log("mensaje enviado: %s",info.messageId)
  
  }

  export default emailOlvidePassword;