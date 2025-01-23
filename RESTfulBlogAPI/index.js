const express = require('express')
const mysql = require('mysql');
const {DATE} = require("mysql/lib/protocol/constants/types");
const app = express()
const port = process.env.PORT || 3000

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'strongpass',
    database: 'blog-api'
})

connection.connect()

app.use(express.json())

app.route('/posts')
    .post((req, res, next)=>{
        const { title, content, category, tags } = req.body

        if ((title === undefined) ||
            (content === undefined) ||
            (category === undefined) ||
            (tags === undefined)
        ) res.send('Please add title, content, category and tags').status(400)
        else{
            let curDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

            let sql = "INSERT INTO `blog-api`.posts (title, content, category, tags, createdAt, updatedAt) VALUES " +
                `('${title}','${content}','${category}','${JSON.stringify(tags)}','${curDate}','${curDate}')`

            if (connection.query(sql)) res.send('Successfully created post').status(200)
            else res.send('Bad sql request').status(400)
        }
    })
    .get((req, res, next)=>{
        let query = req.query;
        if (query.term === undefined) {
            let sql = "SELECT * FROM `blog-api`.posts"

            connection.query(sql, (err, result) => {
                if (err) res.send('Error getting posts').status(400)
                else res.send(result).status(200)
            })
        }
        else{
            let term = query.term
            let sql = "SELECT * FROM `blog-api`.posts WHERE title LIKE " + "'%" + term + "%'" +
                " OR content LIKE " + "'%" + term + "%'" +
                " OR category LIKE " + "'%" + term + "%'"

            connection.query(sql, (err, result) => {
                if (err) res.send('Error getting posts').status(400)
                else res.send(result).status(200)
            })
        }
    })

app.route('/posts/:id')
    .get((req, res, next)=>{
        let id = req.params.id
        let sql = "SELECT * FROM `blog-api`.posts WHERE id = " + id

        connection.query(sql, (err, result) => {
            if (err) res.send('Error getting posts').status(400);
            else res.send(result[0]).status(200)
        })
    })
    .put((req, res, next)=>{
        let id = req.params.id
        const { title, content, category, tags } = req.body
        if ((title === undefined) ||
            (content === undefined) ||
            (category === undefined) ||
            (tags === undefined)
        ) res.send('Please add title, content, category and tags').status(400)
        else{
            let curDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let sql = "UPDATE `blog-api`.posts set title = ?, content = ?, category = ?, tags = ?, updatedAt = ? WHERE id = ?"

            connection.query(sql, [title, content, category, JSON.stringify(tags), curDate, id], (err, result) => {
                if (err) res.send('Error getting posts').status(400)
                else res.send('Successfully updated post').status(200)
            })
        }
    })
    .delete((req, res, next)=>{
        let id = req.params.id
        let sql = "DELETE FROM `blog-api`.posts WHERE id = " + id

        connection.query(sql, (err, result) => {
            if (err) res.send('Error deleting post').status(400);
            else res.send('Successfully deleted post').status(200)
        })
    })

app.route('/posts?:prms')
    .get((req, res, next)=>{
        let prms = req.params.prms
        console.log(prms)
})

app.listen(3000)