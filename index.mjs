import express from 'express'

const PORT = 3000;
const app = express();

app.use(express.static("./public"))
app.listen(PORT, () => console.log(`Server start: http://localhost:${PORT}/`));

app.get("/api/register", (req, res) =>{
    res.send("bonjour")
})