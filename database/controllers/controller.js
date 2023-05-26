import { Mensaje } from '../models/mensaje.js';
import mongoose from 'mongoose';

async function collectionExist(nombre_coleccion) {
  const colecciones = await mongoose.connection.db.collections();
  return colecciones.some((coleccion) => {
    return coleccion.collectionName === nombre_coleccion;
  });
}

async function guardarMensajeBBDD(nombre_coleccion, msg) {
  try {
    const result = await mongoose.connection.db.collection(nombre_coleccion).insertOne(msg);
  } catch (error) {
    console.error(error);
  }
}
const mensajeController = {
  store : async (req, res) => {
    try {
      const current_date = new Date();
      const msg = new Mensaje({
        sala : req.body.sala,
        user : req.body.user,
        avatar: req.body.avatar,
        text : req.body.text,
        type : req.body.type,
        timestamp : current_date
      });
      const nombre_coleccion = msg.sala.replace(/\s+/g, '').toLowerCase();
      const existe_coleccion = await collectionExist(nombre_coleccion);
      // Si no existe, crear la colección
      if (!existe_coleccion) {
        await mongoose.connection.db.createCollection(nombre_coleccion);
      }

      // Guardar el mensaje en la colección correspondiente
      const msgSaved = await msg.save();
      guardarMensajeBBDD(nombre_coleccion, msgSaved);
  
      res.status(200).json({ message: "Mensaje guardado correctamente." });
    } catch (error) {
      console.error(`Error: ${error}`);
      res.status(500).json({ message: "Hubo un error al guardar el mensaje.", error: error.message });
    }
  },
  
  getUserMessages : async (req, res) => {
    try{
      const mensajes = await Mensaje.find({'user' : req.params.user});
      res.json(mensajes);
    } catch (error) {
      console.error(`Error no se ha podido obtener el mensaje: ${error}`);
    }
  },
  
  getUserMessagesInRoom : async (req, res, next) => {
    try{
      const mensajes = await Mensaje.find({
        sala: req.params.sala,
        user: req.params.user
      }).sort({ timestamp: 1 }).exec();
      
      res.json(mensajes);
    } catch (error) {
      console.error(`Error no se ha podido obtener el mensaje: ${error}`);
    }
  },
  
  getCollection : async (req, res) => {
    try {
      const sala = req.params.sala;
      const nombre_coleccion = sala.replace(/\s+/g, '').toLowerCase();
  
      // Leer todos los mensajes de la colección correspondiente, ordenados por timestamp
      const mensajes = await mongoose.connection.db
        .collection(nombre_coleccion)
        .find({})
        .sort({ timestamp: 1 })
        .toArray();
  
      res.json(mensajes);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  },

  dropCollection : async (req, res) => {
    try {
      const sala = req.params.sala;
      const nombre_coleccion = sala.replace(/\s+/g, '').toLowerCase();
      const existe_coleccion = await collectionExist(nombre_coleccion);
      // Si la colección existe la eliminamod
      if(existe_coleccion){
        await mongoose.connection.db.collection(nombre_coleccion).drop();
      }
      res.status(200).json({ message: "Colección eliminada con éxito" });
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  },

  clearDataBase : async (req, res) => {
    try {
      await Mensaje.deleteMany({});
      const mensajes = await Mensaje.find({}).exec();
      console.log("Mensajes: ", mensajes);
      console.log("Se ha vaciado la base de datos con éxito");
      res.redirect('/');
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }
};


export default mensajeController;