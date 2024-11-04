import mysql from 'mysql2/promise'
import config from '../config.js'

const connection = mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password:config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
})

const getConnection =() =>{
    return connection;
}

export {getConnection};

// const pokemones = [
//     {
//         id: 1,
//         name: "Bulbasaur",
//         type: ["Planta", "Veneno"],
//         level: 5111
//     },
//     {
//         id: 4,
//         name: "Charmander",
//         type: ["Fuego"],
//         level: 5555
//     },
//     {
//         id: 7,
//         name: "Squirtle",
//         type: ["Agua"],
//         level: 5333
//     },
//     {
//         id: 25,
//         name: "Pikachu",
//         type: ["Eléctrico"],
//         level: 54444
//     }
// ]

// export default pokemones