import express from 'express'
import pkg from 'pg';
import Jwt  from 'jsonwebtoken';
const { Pool } = pkg;

const PORT = 3000;
const app = express();
app.use(express.json())
app.use(express.static("./public"))
app.listen(PORT, () => console.log(`Server start: http://localhost:${PORT}/`));

const pool = new Pool({
    host: '127.0.0.1',
    user: 'lokkeroom_admin',
    database: 'lokkeroom',
    password: 'becode',
    port: 5432,
});

await pool.connect();


let registerQuery = `INSERT INTO users (email, nickname, password) VALUES ($1, $2, $3);`

app.post("/api/register", async (req, res) =>{
    try{
        await pool.query(registerQuery, [req.body.email, req.body.nickname, req.body.password])
        res.send("nice");
    } catch(err){
        console.log(err);
        res.send("pas nice");
    }
})

let loginQuery = `SELECT password FROM users WHERE email = $1;`
app.post("/api/login", async (req, res) =>{
    try{
        const q = await pool.query(loginQuery, [req.body.email])
        if(q.rowCount && req.body.password === q.rows[0].password)
            res.send("you are logged in !");
        else
            throw(err)
    } catch(err){
        console.log("snif")
        res.send(err);
    }
})


app.get("/api/lobby/:lobbyid", async (req, res) =>{})


app.get("/api/lobby/:lobbyid/:msgid", (req, res) =>{})
app.post("/api/lobby/:lobbyid", (req, res) =>{})
app.get("/api/users", (req, res) =>{})
app.get("/api/users/:userid", (req, res) =>{})
app.post("/api/lobby/:lobbyid/add-user", (req, res) =>{})
app.post("/api/lobby/:lobbyid/remove-user", (req, res) =>{})
app.patch("/api/messages/:id", (req, res) =>{})
app.delete("/api/messages/:id", (req, res) =>{})