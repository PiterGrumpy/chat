
//Cuando todos los elementos de nuestra web se hayan cargado:
document.addEventListener("DOMContentLoaded", function (event) {
    const socket = io("http://localhost:2000");
    socket.emit('joinRoom', current_user);
    
    // La sala recibe un nuevo usuario
  socket.on('addNewUserRoom', (usuariosSala) => {
    clearPeopleList();
    usuariosSala.forEach((usuario) => {
      addNewUser(usuario)
    });
  })
    //Acciones que se realizan cuando se detecta el evento "connected" lanzado por el servidor
     socket.on("connected", (data,callback) => {
      console.log(data.msg);  //data enviada por el servidor al recibir la conexión
      callback("Recibido!");  //El servidor recibirá "Recibido!"
      
      socket.on("toChat", (data) => {
        crearMensajeDeOtro(data);
      });
    });
    // Cuando un usuario se desconecta
    socket.on('disconnect', function () {
      // Emitir evento para abandonar la sala
      socket.leave(sala);
    });
    // Se recibe una respuesta desde GPT
    socket.on('toChatFromGPT', (data) => {
      crearMensajeGPT(data);
    })



document.getElementById("msg").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      enviarMensaje();
    }
});
//Accion a realizar cuando se da al boton de enviar
document.getElementById("send").addEventListener("click", (e) => {
    enviarMensaje();
});

function enviarMensaje(){
    //Obtenemos todos los elementos del formulario para trabajar con ellos
    var msgInput = document.getElementById("msg");
    var msg = msgInput.value;
    const gpt_check = document.getElementById("gpt-check");  
   
    //Mostramos el mensaje en la ventana para el usuario que lo envia
   crearMensaje(msg);
   msgInput.value = "";

    // Definimos el mensaje que vamos a enviar
    var toSend = { user: current_user.nick, text: msg, avatar: current_user.avatar, sala: current_user.sala, type: 'humano', gpt: gpt_check.checked };
  
    //Enviamos el mensaje al servidor 
    socket.emit("toChat", toSend);
}

function crearMensajeGPT(msg){
  // Definimos el mensaje que vamos a enviar
  var toSend = { user: "ChatGPT", text: msg, avatar: "avatarIA", sala: current_user.sala, type: 'IA', gpt: false };
  crearMensajeDeOtro(msg, true);
  //Enviamos el mensaje al servidor 
  socket.emit("toChat", toSend);
}

function crearMensaje(msg){
    // Obtener el elemento padre donde se agregarán los elementos li
    const chat = document.getElementById("chatBox");
    const chatList = chat.querySelector("ul");

    // Crear un nuevo elemento li
    const newListItem = document.createElement("li");
    newListItem.classList.add("clearfix");

    // Crear el contenido del elemento li
    const messageData = document.createElement("div");
    messageData.classList.add("message-data", "text-right");
    const messageDataTime = document.createElement("span");
    messageDataTime.classList.add("message-data-time");
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    messageDataTime.textContent = time;
    const avatar = document.createElement("img");
    avatar.setAttribute("src", "https://bootdey.com/img/Content/avatar/"+ current_user.avatar +".png");
    avatar.setAttribute("alt", "avatar");
    messageData.appendChild(messageDataTime);
    messageData.appendChild(avatar);

    const messageContent = document.createElement("div");
    messageContent.classList.add("message", "other-message", "float-right");
    messageContent.textContent = msg;

    newListItem.appendChild(messageData);
    newListItem.appendChild(messageContent);

    // Agregar el elemento li al elemento padre
    chatList.appendChild(newListItem);
    chat.scrollTop = chat.scrollHeight;
}

function addNewUser(user) {
  // Obtener el elemento ul de la lista de personas
   const peopleList = document.querySelector("#plist ul");

   // Crear un nuevo elemento li para el usuario
   const li = document.createElement("li");
   li.classList.add("clearfix");
 
   // Crear el elemento de imagen
   const img = document.createElement("img");
   img.src = "https://bootdey.com/img/Content/avatar/" + user.avatar + ".png";
   img.alt = "avatar";
 
   // Crear el elemento div para la información del usuario
   const aboutDiv = document.createElement("div");
   aboutDiv.classList.add("about");
 
   // Crear el elemento div para el nombre del usuario
   const nameDiv = document.createElement("div");
   nameDiv.classList.add("name");
   nameDiv.textContent = user.name;
 
 
   // Añadir los elementos al li
   aboutDiv.appendChild(nameDiv);
   li.appendChild(img);
   li.appendChild(aboutDiv);
 
   // Añadir el li a la lista de personas
   peopleList.appendChild(li);
}

function clearPeopleList() {
  const peopleList = document.querySelector("#plist ul");
  peopleList.innerHTML = ""; // Eliminar todos los elementos secundarios
}

function crearMensajeDeOtro(data, gpt = false){
  
  // Obtener el elemento padre donde se agregarán los elementos li
  const chat = document.getElementById("chatBox");
  const chatList = chat.querySelector("ul");

  // Crear un nuevo elemento li
  const newListItem = document.createElement("li");
  newListItem.classList.add("clearfix");

  // Crear el contenido del elemento li
  const messageData = document.createElement("div");
  messageData.classList.add("message-data");
  const messageDataTime = document.createElement("span");
  messageDataTime.classList.add("message-data-time");
  const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  messageDataTime.textContent = time;
  const avatar = document.createElement("img"); 
  if(gpt || data.type === 'IA'){
    avatar.setAttribute("src", "/images/ia-logo-on.png");
  }else {
    avatar.setAttribute("src", "https://bootdey.com/img/Content/avatar/" + data.avatar + ".png");
  }
  avatar.setAttribute("alt", "avatar");
  messageData.appendChild(messageDataTime);
  messageData.appendChild(avatar);

  const messageContent = document.createElement("div");
  messageContent.classList.add("message", "my-message");
  if(gpt){
    messageContent.textContent = data;
  }else {
    messageContent.textContent = data.text;
  }
  

  newListItem.appendChild(messageData);
  newListItem.appendChild(messageContent);

  // Agregar el elemento li al elemento padre
  chatList.appendChild(newListItem);
  chat.scrollTop = chat.scrollHeight;
}

});

