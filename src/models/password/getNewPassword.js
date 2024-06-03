import { userModel } from "../users/user.model.js"
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import config from '../../config/config.js'
import jwt from 'jsonwebtoken';

//Configuración de transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.email,
        pass: config.appEmailPass
    }
})

//Verificamos que los datos que estoy pasando a Nodemailer estan ok
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})

const secret = config.secret

//Mandamos el correo
export const sendEmailPassword = async (email) => {
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error('No account with that email address exists.');
        }

        // Generar el token JWT con una expiración de 1 hora
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });

        //Configuración del correo electrónico
        const mailOptions = {
            from: "Recuperación de contraseña - Desafio Entregable 12 " + config.email,
            to: email,
            subject: 'Actualizamos de contraseña',
            text: `Estás recibiendo este mensaje porque tú (u otra persona) has solicitado el restablecimiento de la contraseña para tu cuenta.\n\n` +
                  `Por favor, haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso dentro de una hora de haberlo recibido:\n\n` +
                  `http://localhost:${config.port}/reset-password/${token}\n\n` +
                  `Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.\n`
        };
    
        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente a ' + email);
    } catch (error) {
        console.error("Error al enviar el correo electrónico: " + error);
    }
};


//Actualizamos la contraseña
export const updatePassword = async (user_id, newPassword) => {
    try {
        console.log('Updating password for user with ID:', user_id);
        console.log('New password:', newPassword);

        // Recuperar el usuario por su ID
        const user = await userModel.findById(user_id);

        if (!user) {
            throw new Error('User not found');
        }
        
        // Hashear la nueva contraseña
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        // Actualizar la contraseña en la base de datos
        user.password = hashedPassword;
        await user.save();

        console.log('Password updated successfully for user:', user.email);
        return user;
    } catch (error) {
        console.error('Error updating password:', error);
        return error;
    }
}

export const comparePassword = async (newPassword, user_id) => {
    try {
         // Comparar la nueva contraseña con la contraseña actual
         const user = await userModel.findById(user_id);
         const isSamePassword = await bcrypt.compare(newPassword, user.password);
         return isSamePassword
    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}