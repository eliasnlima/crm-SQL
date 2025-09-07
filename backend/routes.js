import { Router } from "express";
import UserController from "./controllers/UserController.js";
import SessionController from "./controllers/SessionController.js";

import auth from "./middlewares/auth.js";
import ClientController from "./controllers/ClientController.js";
import ActionController from "./controllers/ActionController.js"

import importClientsRoutes from './routes/importClient.js'

const routes = new Router()

routes.post('/user', UserController.store )
routes.post('/login', SessionController.login)


routes.use(auth)

routes.post('/client', ClientController.store)
routes.get('/clients', ClientController.show)
routes.get('/client/:id', ClientController.index)
routes.put('/clientStatus/:id', ClientController.statusClient )
routes.put('/proxInt/:id', ClientController.proxInt)
routes.get('/client/:id/actions', ActionController.index)

routes.post('/action', ActionController.store)
routes.post('/action/:grupo', ActionController.storeG)
routes.get('/action/:grupo', ActionController.indexGrupo)

routes.get('/clients/:grupo', ClientController.indexGrupo)




routes.use(importClientsRoutes)
routes.delete('/client/remove', ClientController.delete)

routes.put('/client/:clientId', ClientController.update)



routes.put('/intGrupo/:grupo', ClientController.proxIntGrupo)


routes.put('/grupoStatus/:grupo', ClientController.statusGrupo)



routes.get('/grupo/:grupo/actions', ActionController.indexGrupo)
routes.get('/action/user', ActionController.show)

export default routes;