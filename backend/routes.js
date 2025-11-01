import { Router } from "express";
import UserController from "./controllers/UserController.js";
import SessionController from "./controllers/SessionController.js";

import auth from "./middlewares/auth.js";
import { isAdmin } from "./middlewares/admin.js";

import ClientController from "./controllers/ClientController.js";
import ActionController from "./controllers/ActionController.js"
import AdminController from "./controllers/AdminController.js";

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

routes.get('/clients/:grupo', ClientController.indexGrupo)
routes.put('/groupStatus/:grupo', ClientController.statusGrupo)
routes.put('/proxIntG/:grupo', ClientController.proxIntG)

routes.post('/action', ActionController.store)
routes.post('/action/:grupo', ActionController.storeG)
routes.get('/action/:grupo', ActionController.indexGrupo)
routes.get('/client/:id/actions', ActionController.index)

routes.use(importClientsRoutes)
routes.delete('/client/remove', ClientController.delete)

routes.put('/client/:clientId', ClientController.update)


routes.get('/grupo/:grupo/actions', ActionController.indexGrupo)
routes.get('/action/user', ActionController.show)

// ADMIN

routes.get('/admin/users', isAdmin, UserController.show )
routes.post('/admin/user/:user_id', isAdmin, AdminController.showActions)
routes.post('/admin/user/:user_id/actionNull', isAdmin, AdminController.nullActions)
routes.get('/admin/user/:user_id/clients', isAdmin, AdminController.showClients)
routes.put('/admin/clients/:clientId', isAdmin, AdminController.userUpdate)
routes.put('/admin/groups/:grupoCodigo', isAdmin, AdminController.groupUpdate)



export default routes;