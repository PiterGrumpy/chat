import express from 'express';
import { getUsers } from '../controllers/controller.js';

var routes = express.Router();

// Index 
routes.get("/", function (req, res) {
  res.render('login');
});
routes.get("/chat", async (req, res, next) => {
  res.render('index', req.result);
});

routes.post("/chat", async (req, res, next) => {
  const nickName = req.body.user;
  const sala = req.body.sala;
  const avatar = req.body.avatar;
  const user = {'nick': nickName, 'sala' : sala, 'avatar' : avatar};
  res.render("index", {user});
});
export { routes }