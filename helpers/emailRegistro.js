import nodemailer from 'nodemailer';

const emailRegistro = async (datos)=>{

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
        subject: 'Comprueba tu cuenta en APV',
        text : 'Comprueba tu cuenta en APV',
        html: `<p>Hola ${nombre}, Comprueba tu cuenta en APV.</p>
            <p>Tu cuenta en APV a sido creada,solo debes de confirmarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>
            
            <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>`
      })

      console.log("mensaje enviado: %s",info.messageId)

}

export default emailRegistro;