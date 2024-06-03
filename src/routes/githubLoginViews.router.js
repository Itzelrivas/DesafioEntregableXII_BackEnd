import { Router } from "express";

const router = Router();

//Ruta para login con GitHub
router.get('/login', (request, response) => {
    response.render('githubLogin', {
        style: "viewsSessions.css"
    })
})

export default router;