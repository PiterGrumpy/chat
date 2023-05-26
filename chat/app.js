import express from "express";
import mongoose from "mongoose";
import { routes } from "./routes/main.js";
import { engine } from "express-handlebars";
import { io } from "./io.js";

const PORT = 3000;
const app = express();

//Web Aplication Mongoose
app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});

//io
io.on("connection", (socket) => {
  
  // Obtener la lista de las salas existentes
  const rooms = io.sockets.adapter.rooms;
 
  var data = { msg: "Bienvenido al chat" };
  socket.emit("connected", data, (response) => {
    console.log(response); //"Recibido!" Respuesta enviada por el cliente
  });

  socket.on("joinRoom", (data) => {
    if (!socket.user) socket.user = data.nick;
    if (!socket.avatar) socket.avatar = data.avatar;
    if (!socket.sala) socket.sala = data.sala;
    socket.join(socket.sala);

  
   
    // Obtener los sockets en la sala
   const roomSockets = io.sockets.adapter.rooms.get(socket.sala);

   // Obtener los nombres de usuario de los sockets en la sala
   const usuariosSala = [];
   if (roomSockets) {
     for (const roomSocketId of roomSockets) {
       const roomSocket = io.sockets.sockets.get(roomSocketId);
       if (roomSocket.user) {
        let usuario = {
          name : roomSocket.user,
          avatar : roomSocket.avatar
        }
         usuariosSala.push(usuario);
       }
     }
   }

   socket.emit("addNewUserRoom", usuariosSala);
   socket.to(socket.sala).emit("addNewUserRoom", usuariosSala);


    // Si en la sala hay más de un usuario recuperamos los mensajes de la sala para mostrarlos
    if(rooms.get(socket.sala).size > 1){
      const url = `http://databaseAPI:3000/mensajes/sala/${socket.sala}`;
      fetch(url, {
        mode: "cors",
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        if(res.ok) {
          res.json().then(data => {
            console.log(data);
            data.forEach(msg => {
              socket.emit("toChat", msg);
            });
          });
        }else {
          res.json().then(error => {
            console.log(error);
          });
          console.error('Error al enviar mensaje');
        }
      });
    }

    console.log(`${data.nick} se ha unido a ${data.sala}`);
  });

  //Todos los clientes que estén escuchando el evento "toChat" recibiran el mensaje enviado por el cliente que lanzó el mensaje
  socket.on("toChat", (data) => {
    socket.to(socket.sala).emit("toChat", data);
    //Guardamos el mensaje en la base de datos
    fetch(`http://databaseAPI:3000/mensaje/store`, {
      mode: "cors",
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => {
      if(res.ok) {
        res.json().then(data => {
          console.log(data.message);
        });
      }else {
        res.json().then(error => {
          console.log(error.message);
        });
        console.error('Error al enviar mensaje');
      }
    });

    //Si gpt es true, enviamos el mensaje a la IA
    if(data.gpt){
      console.log("Mensaje", data.text);
      fetch(`http://gptAPI:5000/gpt`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ msg: data.text }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      }).then((data) => {
        //console.log("DATA: ", data.data, " FIN DATA");
        socket.emit("toChatFromGPT", data.data);
      }).catch((err) => {
        console.log(err);
      });
    }

  });

  socket.on("disconnect", function () {
    console.log(`Usuario desconectado`);
    // Si la sala está vacía borramos los mensajes de esa sala
    
     // Obtener los sockets en la sala
      const roomSockets = io.sockets.adapter.rooms.get(socket.sala);

      // Obtener los nombres de usuario de los sockets en la sala para actualizar la lista de usuarios en sala
      const usuariosSala = [];
      if (roomSockets) {
        for (const roomSocketId of roomSockets) {
          const roomSocket = io.sockets.sockets.get(roomSocketId);
          if (roomSocket.user) {
            let usuario = {
              name : roomSocket.user,
              avatar : roomSocket.avatar
            }
            usuariosSala.push(usuario);
          }
        }
      }

      socket.emit("addNewUserRoom", usuariosSala);
      socket.to(socket.sala).emit("addNewUserRoom", usuariosSala);

    // Si la sala se queda sin usuarios, vaciamos la conversación
    if(typeof rooms.get(socket.sala) === 'undefined'){
      const url = `http://databaseAPI:3000/sala/vaciar/${socket.sala}`;
      fetch(url, {
        mode: "cors",
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        if(res.ok) {
          res.json().then(data => {
            console.log(data);
          });
        }else {
          res.json().then(error => {
            console.log(error);
          });
          console.error('Error al enviar mensaje');
        }
      });
    }
  });
});

//Mongoose
mongoose.connect(
  `mongodb://root:pass12345@mongodb:27017/tutorial?authSource=admin`,
  { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true },
  (err, res) => {
    if (err) console.log(`ERROR: connecting to Database.  ${err}`);
    else console.log(`Database Online`);
  }
);

// Import routes of our app
//app.engine('handlebars', engine());
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Define routes using URL path
app.use("/", routes);
