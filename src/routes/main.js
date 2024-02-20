const express = require('express');
const router = express.Router()
const {insertarponis, obtenerPonis, buscarPoni, obtenerDatosPoni, eliminarPoni, actualizarPoni} = require('./conexionbd')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const comprobarToken = async (cookie) => {
    const token = cookie
    if (token){
        const token_decode = jwt.verify(token, process.env.SECRETO)
        console.log(token_decode)
        return true
    }else {
        return false
    }
}

router.get('/', async(req, res) => {
    console.log("entra aquí")
    const token = await comprobarToken(req.cookies.id)
    if (token){
        console.log(token)
        res.redirect('home')
    }else{
        res.render('index')
    }
})
router.get('/home', async(req, res) => {
    const token = await comprobarToken(req.cookies.id)
    if (token){
        const ponis = await obtenerPonis()
        res.render('home', {ponis: ponis})
    }else{
        res.redirect('/')
    }
})

router.get('/registro', async(req, res) => {
    const token = await comprobarToken(req.cookies.id)
    if (token){
        res.redirect('home')
    }else{
        res.render('registro')
    }
})

router.get('/login', async(req, res) => {
    const token = await comprobarToken(req.cookies.id)
    if (token){
        res.redirect('home')
    }else{
        res.render('login')
    }
})

router.post('/init', async(req, res) => {
    const datos = require('../../data/datos.json')
    for (poni of datos){
        await insertarponis(poni)
    }
    res.send('Done!')
})

router.post('/saber', async (req, res) => {
    const {id_poni} = req.body
    console.log(id_poni)
    const datos_poni = await obtenerDatosPoni(id_poni)
    if (datos_poni){
        res.render('poni', {ponis: datos_poni})
    }else {
        res.render('poni', {ponis: false})
    }
})
router.post('/filtrarPoni', async (req, res) => {
    console.log("entra aquí")
    const {poni} = req.body
    const buscar = await buscarPoni(poni)
    if (buscar){
        res.render('home',{ponis: buscar})
    }else{
        res.render('home', {ponis: false})
    }
})

router.post('/borrar', async (req, res) => {
    const {eliminar_poni} = req.body 
    const eliminar = await eliminarPoni(eliminar_poni)
    if (eliminar){
        res.redirect('home')
    }else {
        res.send("No pudo eliminarse.")
    }
})

router.post('/editar', async (req, res) => {
    const {editar_poni} = req.body
    const obtener_datos = await obtenerDatosPoni(editar_poni)
    res.render('editar', {ponis: obtener_datos})
})

router.post('/agregarPoni', async (req, res) => {
    const {nombre, descripcion, tipo, color, corte_mane, afiliacion, imagen, residencia, mejor_amigo, personalidad, habilidad} = req.body
    const insertar = await insertarponi({
        nombre: nombre,
        descripcion: descripcion,
        tipo: tipo,
        color: color,
        corte_mane: corte_mane,
        afiliacion: afiliacion,
        imagen: imagen,
        residencia: residencia,
        mejor_amigo: mejor_amigo,
        personalidad: personalidad,
        habilidad: habilidad
    });
    if (insertar){
        res.redirect('home')
    }else {
        console.log("No se pudo agregar")
        res.send("No pudo agregarse el pony.")
    }
})

router.get('/agregar', async(req, res) => {
    const token = await comprobarToken(req.cookies.id)
    if (token){
        res.render('agregar')
    }else{
        res.redirect('/')
    }

})

router.post('/logout', async(req, res) => {
    res.clearCookie('id')
    res.redirect('/')
})

router.post('/actualizar', async (req, res) => {
    const {id_poni, nombre, descripcion, tipo, color, corte_mane, afiliacion, imagen, residencia, mejor_amigo, personalidad, habilidad} = req.body
    const actualizar = await actualizarPoni({
        id: id_poni,
        nombre: nombre,
        descripcion: descripcion,
        tipo: tipo,
        color: color,
        corte_mane: corte_mane,
        afiliacion: afiliacion,
        imagen: imagen,
        residencia: residencia,
        mejor_amigo: mejor_amigo,
        personalidad: personalidad,
        habilidad: habilidad
    });
    if (actualizar){
        res.redirect('home')
    }else {
        console.log("No se pudo actualizar")
        res.send("No pudo actualizarse el pony.")
    }
})

module.exports = router