import express from 'express'
import pkg from 'pg';
import generateAccessToken from './generate_tokenSecret.mjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()


let tokenSecretInEnv = process.env.TOKENSECRET;
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


function authenticateToken(req, res, next)
{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKENSECRET, (err, user) => {
        // console.log(err);
        if (err) 
            return res.sendStatus(403)

        req.user = user
        next();
    })
}


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

let loginQuery = `SELECT password,id FROM users WHERE email = $1;`
// let nameQuery = `SELECT id FROM users WHERE email = $1`
app.post("/api/login",async (req, res) =>{
    try{
        const login = await pool.query(loginQuery, [req.body.email])
        // const getName = await pool.query(nameQuery, [req.body.email])
        if(login.rowCount && req.body.password === login.rows[0].password)
            res.send(generateAccessToken(login.rows[0].id));
        else
            res.send("erreur")
    } catch(err){
        console.log("snif")
        res.send(err);
    }
})

let GetLobbyMsgs = `SELECT text from messages WHERE lobby_id=$1`
app.get("/api/lobby/:lobbyid", authenticateToken, async (req, res) =>{
    const machin = (await pool.query(`select id from lobby where admin_id=$1`, [req.user.userid])).rowCount 
                && await pool.query(GetLobbyMsgs, [req.params.lobbyid]);
        console.log("salut")
    try{
        if(!machin)
            res.sendStatus(404)
        res.send(machin.rows);
    } catch(err){
        console.log("BIG ERROR OMG")
        res.send(err)
    }
})

let GetMsg = `select text from messages WHERE lobby_id= $1 AND id= $2`
app.get("/api/lobby/:lobbyid/:msgid", async (req, res) =>{
    const requete = await pool.query(GetMsg, [req.params.lobbyid, req.params.msgid])
    try{
        res.send(requete.rows)
    } catch(err){
        console.log("errrrreur")
        res.send(err);
    }
})

let postMsg = `INSERT INTO messages(text, author_id, lobby_id, created) VALUES($1, $2, $3, CURRENT_TIMESTAMP)`
app.post("/api/lobby/:lobbyid", async (req, res) =>{
    const parameters = [req.body.message, req.body.author, req.params.lobbyid]
    console.log(parameters)
    try{
        let request = await pool.query(postMsg, parameters)
        if (request)
            res.send("message has been posted" );
    }catch(err)
    {
        console.log("erreur")
        res.send(err)
    }
})

// let getUsers = `SELECT nickname from users`
// app.get("/api/users", async (req, res) =>{
//     if(await )
// })

app.get("/api/users/:userid", (req, res) =>{})
app.post("/api/lobby/:lobbyid/add-user", (req, res) =>{})
app.post("/api/lobby/:lobbyid/remove-user", (req, res) =>{})
app.patch("/api/messages/:id", (req, res) =>{})
app.delete("/api/messages/:id", (req, res) =>{})