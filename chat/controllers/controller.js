const getUsers = async (req, res, next) => {
  try{
    console.log(req.sala);
    let usuarios = [];
    const url = `http://databaseAPI:3000/mensajes/sala/${req.sala}`;
    fetch(url, {
      mode: "cors",
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((res) => {
      if(res.ok) {
        res.json().then(data => {
          
          data.forEach(msg => {
            
            let usuario = msg.user;
            let avatar = msg.avatar;
            
            const current = {
              [usuario]: avatar
            };
            
            usuarios.push(current);
          });
        });
      }else {
        res.json().then(error => {
          console.log(error);
        });
        console.error('Error al conectarse a la base de datos');
      }
    }).then(() => {
      req.result = usuarios;
      next();
    }).catch(error => {
      console.error(`Error: ${error}`);
      next(error);
    })
  } catch (error){
    console.error(`Error: ${error}`);
    next(error);
  }

};

export { getUsers }