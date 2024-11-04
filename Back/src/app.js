import cors from 'cors';
import express from 'express';
import router from './routes/routes.usuario.js';

//creo instancia de express
const app = express();

//Defino puerto
app.set('port', 3001);

//Config de cors
app.use(
  cors({
    origin: 'http://localhost:3000', // Permite el acceso solo desde este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  })
);
// Middleware para procesar JSON
app.use(express.json()); // Esto es importante si esperas recibir JSON en las solicitudes
//importa router
app.use(router);

export default app;
