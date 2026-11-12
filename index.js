import express from "express"
import cors from "cors"
import mysql2 from "mysql2"
import "dotenv/config"

const app = express()

app.use(express.json())
app.use(cors())

const sql = mysql2.createPool({
    host: process.env.HOST_BANCO,
    user: process.env.USUARIO_BANCO,
    password: process.env.SENHA_BANCO,
    database: process.env.NOME_BANCO
})

app.get("/", (request, response) => {
    const comandoSelect = "SELECT * FROM musicas_pedro_gaspar21timc"

    sql.query(comandoSelect, (error, data) => {
        if (error) {
            console.log(error)
            return response.status(500).json(error)
        }

        response.json(data)
    })
})

app.put("/:id", (request, response) => {
    const id = request.params.id
    const { titulo, artista, genero, ano, duracao } = request.body

    const comandoUpdate = `
        UPDATE musicas_pedro_gaspar21timc
        SET titulo = ?, artista = ?, genero = ?, ano = ?, duracao = ?
        WHERE id = ?
    `

    sql.query(comandoUpdate, [titulo, artista, genero, ano, duracao, id], (error, data) => {
        if (error) {
            console.log(error)
            return response.status(500).json(error)
        }

        response.json({ mensagem: "Música atualizada com sucesso!" })
    })
})

app.post("/cadastrar", (request, response) => {
    const { titulo, artista, genero, ano, duracao } = request.body

    const comandoInsert = `
        INSERT INTO musicas_pedro_gaspar21timc
        (titulo, artista, genero, ano, duracao)
        VALUES (?, ?, ?, ?, ?)
    `

    sql.query(comandoInsert, [titulo, artista, genero, ano, duracao], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json(error)
        }

        response.status(201).json({ mensagem: "Música cadastrada com sucesso!" })
    })
})

app.delete("/apagar/:id", (request, response) => {
    const { id } = request.params

    const comandoDelete = "DELETE FROM musicas_pedro_gaspar21timc WHERE id = ?"

    sql.query(comandoDelete, [id], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json(error)
        }

        response.json({ mensagem: "Música apagada com sucesso!" })
    })
})

app.listen(3001, () => {
    console.log("Servidor online")
})

export default app