import { getConnection } from '../database/database.js'; // Cambia la ruta si es necesario

export const postTransaction = async (req, res) => {
  try {
    const { usuario_id, cuenta, tipo, monto } = req.body;
    console.log(usuario_id, cuenta, tipo, monto);

    const connection = await getConnection();

    // Realizar operación según el tipo de transacción
    switch (tipo) {
      case 'deposit':
        await connection.query('UPDATE usuario SET saldo = saldo + ? WHERE idU = ?', [monto, usuario_id]);
        // Insertar registro de transacción
        await connection.query('INSERT INTO transaccion (usuario_id, cuenta, tipo, monto) VALUES (?, ?, ?, ?)', [
          usuario_id,
          null, // No hay receptor para depósitos
          tipo,
          monto,
        ]);
        break;

      case 'withdraw':
        console.log('entramos');
        // Verifica que el saldo sea suficiente para el retiro
        const [result] = await connection.query('SELECT saldo FROM usuario WHERE idU = ?', [usuario_id]);
        if (result[0].saldo < monto) {
          return res.status(400).json({ message: 'Insufficient balance' });
        }
        await connection.query('UPDATE usuario SET saldo = saldo - ? WHERE idU = ?', [monto, usuario_id]);
        await connection.query('INSERT INTO transaccion (usuario_id, cuenta, tipo, monto) VALUES (?, ?, ?, ?)', [
          usuario_id,
          null, // No hay receptor para retiros
          tipo,
          monto,
        ]);
        break;

      case 'transfer':
        console.log('estamos o no');
        // Verifica que el usuario tenga saldo suficiente para transferir
        const [userSaldo] = await connection.query('SELECT saldo FROM usuario WHERE idU = ?', [usuario_id]);
        if (userSaldo[0].saldo < monto) {
          return res.status(400).json({ message: 'Saldo insuficiente para la transferencia' });
        }

        // Realiza la transferencia: resta a usuario_id, suma a receptor_id

        await connection.query('UPDATE usuario SET saldo = saldo - ? WHERE idU = ?', [monto, usuario_id]);

        const [receptorExistente] = await connection.query('SELECT saldo FROM usuario WHERE idU = ?', [cuenta]);
        if (receptorExistente.length > 0) {
          await connection.query('UPDATE usuario SET saldo = saldo + ? WHERE idU = ?', [monto, cuenta]);
        }
        break;

      default:
        return res.status(400).json({ message: 'Tipo de transacción no válido' });
    }
    // Inserta el registro de la transacción en la tabla `transaccion`
    await connection.query('INSERT INTO transaccion (usuario_id, cuenta, tipo, monto) VALUES (?, ?, ?, ?)', [
      usuario_id,
      cuenta || null,
      tipo,
      monto,
    ]);

    res.status(200).json({ message: 'Transacción realizada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al realizar la transacción', error: error.message });
  }
};

// Controlador para obtener el historial de transacciones
export const getTransaction = async (req, res) => {
  const { usuario_id } = req.query;

  // Validación para asegurarse de que se proporciona un ID de usuario
  if (!usuario_id) {
    return res.status(400).json({ message: 'El ID de usuario es requerido' });
  }

  try {
    const connection = await getConnection();

    // Consulta para obtener todas las transacciones del usuario
    const [transactions] = await connection.query(
      `SELECT monto, tipo, fecha
       FROM transaccion
       WHERE usuario_id = ?
       ORDER BY fecha DESC`,
      [usuario_id]
    );

    // Devuelve el historial de transacciones en la respuesta
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error al obtener el historial de transacciones:', error);
    res.status(500).json({ message: 'Error al obtener el historial de transacciones' });
  }
};
