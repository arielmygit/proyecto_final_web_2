const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');


const app = express();
//configuracion para el uso de peticiones post
app.use(bodyParser.urlencoded({ extended: false }));

//plantillas que sean dinamicas
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public')); // importante para express para que pueda conectar con css

const db = mysql.createConnection({
    host: 'localhost', // server
    user: 'root',// usuario de la DB
    password: '',//pass de tu BD
    database: 'web_2',//nombre de la BD
    port: 3306//puerto

});


db.connect(err => {
    if (err) {
        console.log(`error al conectar a la BD `);
    } else {
        console.log('la base de datos funciona y esta conectada')
    }
});

//iniciamos el server
//const hostname = '0.0.0.0' 
const port = 3009
app.listen(port, () => { // colocar hostname en lugar de port
    console.log(`servidor en funcionamiento desde http:localhost:${port}`) // en lugar de http://localhost se coloca ${email ip hostname}
});

// index

app.get('/', (req, res) => {
    //consulta DB
    const query = 'SELECT * FROM usuario'; // user es el nombre de la tabla
    // trabajamos con la coneccion
    db.query(query, (err, results) => {
        if (err) {
            console.error(`error en DB Codigo: ${err}`);
            res.send('error en conexion a la Db de Error ')

        } else {
            console.log('Resultados de usuario:', results); // Para depurar los datos
            res.render('index', { usuarios: results });// users es el nombre de la tabla de donde va a tomar los datos de db


        }

    });

});

// agregar usuarios

app.post('/add', (req, res) => {
    const { nombre, paterno, materno, celular, email, no_de_cuenta, tipo_de_sangre } = req.body;
    const query = 'INSERT INTO usuario (nombre,paterno,materno,celular,email,no_de_cuenta,tipo_de_sangre) VALUE (?,?,?,?,?,?,?)'
    db.query(query, [nombre, paterno, materno, celular, email, no_de_cuenta, tipo_de_sangre], (err) => {

        if (err) {
            console.error("Error al agregar usuario");
            res.send("Error al agregar usuario")

        } else {

            res.redirect('/');

        }
    });

});

// Muestreo del elemento a editar

app.get('/edit/:ID', (req, res) => {
    const { ID } = req.params;
    const query = 'SELECT * FROM usuario WHERE ID= ?';
    db.query(query, [ID], (err, results) => {

        if (err || results.length === 0) {
            console.error("Error al obtener usuario:", err);
            res.send("Usuario no encontrado");

        } else {

            res.render('edit', { usuario: results[0] });

        }
    });

});
// Set de la edicion
app.post('/update/:ID', (req, res) => {
    const { ID } = req.params;
    const { Nombre, Paterno, Materno, Celular, Email, No_de_Cuenta, Tipo_de_sangre } = req.body;
    const query = 'UPDATE usuario SET Nombre = ?, Paterno = ?, Materno = ?, Celular = ?, Email = ?, No_de_Cuenta = ?, Tipo_de_sangre = ? WHERE ID = ?';
    db.query(query, [Nombre, Paterno, Materno, Celular, Email, No_de_Cuenta, Tipo_de_sangre, ID], (err) => {
        if (err) {
            console.error("Error al actualizar usuario:", err);
            res.send("Error al actualizar usuario");
        } else {
            res.redirect('/');
        }
    });
});

//eliminar usuario

app.get('/delete/:ID', (req, res) => {
    const { ID } = req.params;
    const query = 'DELETE FROM usuario WHERE ID = ?';
    db.query(query, [ID], (err) => {
        if (err) {
            console.error("Error al eliminar usuarios:", err);
            res.send("Error al eliminar usuario");


        } else {
            res.redirect('/');

        }
    });
});