import { getConnection } from '../database/database.js';

export const getInfo = async (req, res) => {
  const { userId } = req.query; // Obtenemos el userId de la query

  if (!userId) {
    return res.status(400).json({ message: 'El ID de usuario es requerido' });
  }

  try {
    const connection = await getConnection();
    const [user] = await connection.query('SELECT * FROM usuario WHERE idU = ?', [userId]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Suponiendo que la respuesta será un objeto, puedes ajustar esto según tu estructura de datos
    res.status(200).json(user[0]); // Enviamos el primer (y único) resultado
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error);
    res.status(500).json({ message: 'Error al obtener la información del usuario' });
  }
};

//Error 500 es un error del servidor,
//error 404 es cuando algo no se ha encontrado
//error 401 no esta autenticado
//error 200 get valido
//error 201 create correcto
//403 ni autenticacion ni permisos parecido 401
