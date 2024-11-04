import bcrypt from 'bcrypt';
import { getConnection } from '../database/database.js'; // Importa tu función de conexión a la base de datos

// Controlador de registro
export const registerUser = async (req, res) => {
  try {
    const { idU, nombre, email, contraseña, tipo, saldo } = req.body;

    // Verifica que todos los campos están presentes
    if (!idU || !nombre || !email || !contraseña || !tipo || saldo === undefined) {
      return res.status(400).json({ message: 'Por favor, proporciona todos los datos requeridos' });
    }

    const connection = await getConnection();

    // Verifica si el idU ya está registrado
    const [existingUser] = await connection.query('SELECT * FROM usuario WHERE idU = ?', [idU]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El ID ya está registrado' });
    }

    // Genera el hash de la contraseña
    const saltRounds = 10; // Nivel de complejidad del hash
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    // Guarda el nuevo usuario en la base de datos
    const query = 'INSERT INTO usuario (idU, nombre, email, contraseña, tipo, saldo) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await connection.query(query, [idU, nombre, email, hashedPassword, tipo, saldo]);

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
