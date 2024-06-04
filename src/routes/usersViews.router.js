import { Router } from "express";
import { changeRolController, getCartUserController, getInfoUser, loginUserController, logout, registerUserController } from "../controllers/users.Controller.js";

const router = Router();

//Ruta users/registerRef/:email para ver el cart referenciado al usuario (verificamos que la population funcione) ✅
router.get("/registerRef/:email", getCartUserController)

//Ruta users/register que muestra el forms para registrar nuevos usuarios (GET) ✅
router.get("/register", registerUserController);

//Ruta users/register para mostrar el forms de loguear usuarios (GET)
router.get("/login", loginUserController);

//ruta que nos muestra la información del usuario logueado 
router.get("/current", getInfoUser);

//Ruta para destruir la sesión 
router.get("/logout", logout)

//Cambiar el role
router.get("/premium/:_id", changeRolController)

export default router;