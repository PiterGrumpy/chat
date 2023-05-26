//io.js
import { createServer } from "http";
import { Server } from "socket.io";

const socketPort =  2000;
const httpServer = createServer();

httpServer.listen(socketPort, (err, res) => {
  if (err) console.log(`ERROR: Connecting APP ${err}`);
  else console.log(`Server is running on port ${socketPort}`);
});


const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000", //Esta será la dirección de vuestra web
    },
  });
  
  export { io }