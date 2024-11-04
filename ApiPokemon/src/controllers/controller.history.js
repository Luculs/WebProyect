import { getConnection } from '../database/database.js';

export const getHistory = async (req, res) => {
  const { usuario_id } = req.query;

  if (!usuario_id) {
    return res.status(400).json({ message: 'El ID de usuario es requerido' });
  }

  try {
    const connection = await getConnection();

    // Obtener el historial de ingresos
    const [historialIngresos] = await connection.query(
      'SELECT SUM(monto) AS total FROM transaccion WHERE usuario_id = ? AND tipo = "deposit"',
      [usuario_id]
    );

    // Obtener el historial de retiros
    const [historialWithdrow] = await connection.query(
      'SELECT SUM(monto) AS total FROM transaccion WHERE usuario_id = ? AND tipo = "withdraw"', // Corrige el typo en "withdraw"
      [usuario_id]
    );

    // Obtener el historial de transferencias
    const [historialTransfer] = await connection.query(
      'SELECT SUM(monto) AS total FROM transaccion WHERE usuario_id = ? AND tipo = "transfer"',
      [usuario_id]
    );

    // Sumar egresos (retiros + transferencias)
    const totalEgresos = (historialWithdrow[0].total || 0) + (historialTransfer[0].total || 0);

    // Obtener las deudas
    const [deudas] = await connection.query(
      'SELECT SUM(monto) AS total FROM prestamo WHERE usuario_id = ? AND estado = "aceptado"',
      [usuario_id]
    );

    // Respuesta consolidada
    const reportData = {
      deudas: deudas[0].total || 0,
      histIngresos: historialIngresos[0].total || 0,
      histEgresos: totalEgresos, // Usa la suma calculada aquí
    };

    reportData.deudas = parseFloat(reportData.deudas) || 0;
    reportData.histIngresos = parseFloat(reportData.histIngresos) || 0;
    reportData.histEgresos = parseFloat(reportData.histEgresos) || 0;
    res.status(200).json(reportData);
  } catch (error) {
    console.error('Error al obtener el reporte:', error);
    res.status(500).json({ message: 'Error al obtener el reporte' });
  }
};
