import { getConnection } from '../database/database.js'; // Importa la conexión a la base de datos

// Controlador para solicitar un préstamo
export const requestLoan = async (req, res) => {
  const { usuario_id, monto, plazo } = req.body; // Extrae los datos del cuerpo de la solicitud
  console.log(usuario_id, monto, plazo);
  // Validar que todos los datos requeridos están presentes
  if (!usuario_id || !monto || !plazo) {
    return res.status(400).json({ message: 'Faltan datos requeridos: usuario_id, monto y plazo son necesarios.' });
  }

  try {
    const connection = await getConnection();

    // Insertar nuevo préstamo en la base de datos
    await connection.query('INSERT INTO prestamo (usuario_id, monto, plazo, estado) VALUES (?, ?, ?, ?)', [
      usuario_id,
      monto,
      plazo,
      'aceptado', // El estado siempre será "aceptado"
    ]);
    await connection.query('UPDATE usuario SET saldo = saldo + ? WHERE idU = ?', [monto, usuario_id]);
    res.status(201).json({ message: 'Préstamo creado con éxito' }); // Respuesta exitosa
  } catch (error) {
    console.error('Error al crear el préstamo:', error);
    res.status(500).json({ message: 'Error al crear el préstamo' }); // Respuesta de error
  }
};

// Controlador para obtener los préstamos de un usuario específico
export const getLoansByUser = async (req, res) => {
  const { usuario_id } = req.params; // Obtener el ID de usuario de los parámetros

  if (!usuario_id) {
    return res.status(400).json({ message: 'Falta el ID de usuario' });
  }

  try {
    const connection = await getConnection();
    const [loans] = await connection.query('SELECT * FROM prestamo WHERE usuario_id = ?', [usuario_id]);

    if (loans.length === 0) {
      return res.status(404).json({ message: 'No se encontraron préstamos para este usuario' });
    }

    res.status(200).json(loans); // Devuelve todos los préstamos encontrados para el usuario
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    res.status(500).json({ message: 'Error al obtener los préstamos' }); // Respuesta de error
  }
};
