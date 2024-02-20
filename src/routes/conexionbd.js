const mysql = require('mysql2/promise');
require('dotenv').config()
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
    database: process.env.DATABASE, 
    host: process.env.HOST,
    password: process.env.PASSWORD,
    user: process.env.USER,
    multipleStatements: true
})

const insertarponis = async (poni) => {
    await pool.execute("INSERT INTO ponys (nombre, tipo, habilidad, color, personalidad, afiliacion, mejor_amigo, residencia, corte_mane, imagen, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [poni.nombre, poni.tipo, poni.color, poni.habilidad, poni.personalidad, poni.afiliacion, poni.mejor_amigo, poni.residencia, poni.corte_mane, poni.imagen, poni.descripcion])
}

const insertarUsuario = async (usuario) => {
    try {
        const [obtener_datos] = await pool.query("SELECT id, email, password from usuarios where email = ?", [usuario.email])
        if (obtener_datos && obtener_datos.length >0){
            return false
        }else{
            await pool.execute('INSERT INTO usuarios (nombre, username, password, email) VALUES (?, ?, ?, ?)', [usuario.nombre, usuario.username, usuario.password, usuario.email])
            console.log("Insertado el usuario")
        }
    } catch (err){
        console.error("Error durante la inserción del usuario en la bbdd", err)
    }
}

const comprobarUsuario = async (usuario) => {
    const [obtener_datos] = await pool.query("SELECT id, email, password from usuarios where email = ?", [usuario.email])
    if (obtener_datos && obtener_datos.length > 0) {
        const verificar = await bcrypt.compare(usuario.password, obtener_datos[0].password)
        if (verificar){
            return obtener_datos
        }else{
            return false
        }
    }else{
        return false
    }
}

const obtenerPonis = async () => {
    const [ponis] = await pool.query("SELECT * from ponys")
    return ponis
}

const buscarPoni = async (poni) => {
    const [ponis] = await pool.query("SELECT * from ponys where nombre LIKE ? OR tipo LIKE ? OR afiliacion LIKE ?", [`%${poni}%`,`%${poni}%`,`%${poni}%`])
    if (ponis && ponis.length > 0){
        return ponis
    }else{
        return false
    }
}

const obtenerDatosPoni = async (id_poni) => {
    const [poni] = await pool.query("SELECT * from ponys where id = ?", [id_poni])
    return poni
}

const eliminarPoni = async (id) => {
    try {
        await pool.execute("DELETE FROM ponys WHERE id = ?", [id])
        return true
    } catch (err){
        console.error(err)
        return false
    }
}

const actualizarPoni = async (poni) => {
    try {
        await pool.execute("UPDATE ponys SET nombre = ?, descripcion = ?, tipo = ?, color = ?, corte_mane = ?, afiliacion = ?, imagen = ?, personalidad = ?, habilidad = ?, residencia = ?, mejor_amigo = ? WHERE id = ?", [poni.nombre, poni.descripcion, poni.tipo, poni.color, poni.corte_mane, poni.afiliacion, poni.imagen, poni.personalidad, poni.habilidad, poni.residencia, poni.mejor_amigo, poni.id]);
        return true
    }   catch (err){
        console.error(err)
        return false
    }
}

module.exports = {
    insertarponis,
    insertarUsuario,
    comprobarUsuario, 
    obtenerPonis,
    buscarPoni,
    obtenerDatosPoni,
    eliminarPoni,
    actualizarPoni
}