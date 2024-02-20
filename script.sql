CREATE DATABASE my_little_pony;

use my_little_pony;

CREATE TABLE usuarios(
    id INT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE ponys (
    id INT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    habilidad VARCHAR(100) NOT NULL,
    color VARCHAR(100) NOT NULL,
    personalidad VARCHAR(100) NOT NULL,
    afiliacion VARCHAR(100) NOT NULL,
    mejor_amigo VARCHAR(100) NOT NULL,
    residencia VARCHAR(100) NOT NULL,
    corte_mane VARCHAR(100) NOT NULL,
    imagen VARCHAR(250) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL
);
