import express from 'express';
import mensajeController from '../controllers/controller.js';
var routes = express.Router();

routes.put('/mensaje/store', mensajeController.store);
routes.get('/mensajes/usuario/:user', mensajeController.getUserMessages);
routes.get('/mensajes/sala/:sala/usuario/:user', mensajeController.getUserMessagesInRoom);
routes.get('/mensajes/sala/:sala', mensajeController.getCollection);
routes.get('/sala/vaciar/:sala', mensajeController.dropCollection);
routes.get('/bbdd/vaciar', mensajeController.clearDataBase);

export { routes }