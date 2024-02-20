const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs')
const {insertarUsuario, comprobarUsuario} = require('./conexionbd')
const jwt = require('jsonwebtoken')

router.post('/registrarse', async(req, res) => {
    try {
        const { nombre, username, password, email } = req.body
        const nombre_user = nombre.trim()
        const username_user = username.trim()
        const password_user = password.trim()
        const email_user = email.trim()
        const password_hash = await bcrypt.hash(password_user, 10);
        const resultado = await insertarUsuario({nombre: nombre_user, username: username_user, password: password_hash, email: email_user})
        if (resultado != false){
            res.redirect('/login')
        }else{
            res.status(401).send("El usuario ya está registrado")
        }

    }catch (err) {
        console.error(err, "Error durante la inserción")
    }
});

router.post('/loguearse', async(req, res) => {
    try {
        const {email, password} = req.body
        const comprobar = await comprobarUsuario({email: email, password: password})
        if (comprobar != false){
            console.log(comprobar)
            const token = jwt.sign({id_token: comprobar[0].id}, process.env.SECRETO)
            res.cookie('id', token, {httpOnly: true})
            res.redirect('/home')
        }else{
            res.status(401).send("Credenciales incorrectas")
        }
    } catch(error){
        console.error("Error al loguearte", error)
    }
})

module.exports = router