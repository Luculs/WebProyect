import bcrypt from 'bcrypt';
import { getConnection } from '../database/database.js';
// Controlador de inicio de sesión
export const loginUser = async (req, res) => {
  try {
    const { idU, contraseña } = req.body;

    const connection = await getConnection();

    // Busca al usuario por email
    const [user] = await connection.query('SELECT * FROM usuario WHERE idU = ?', [idU]);

    // Esto funciona para las contrasenas directamente sin hash

    // if (user.length === 0 || user[0].contraseña !== contraseña) {
    //   return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    // }
    // if (user.length === 0) {
    //   return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    // }

    // Compara la contraseña ingresada con el hash almacenado
    const isPasswordValid = await bcrypt.compare(contraseña, user[0].contraseña);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Id o contraseña incorrectos' });
    }

    // Si es correcto, puedes devolver una respuesta de éxito
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: { idU: user[0].idU, nombre: user[0].nombre, email: user[0].email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
