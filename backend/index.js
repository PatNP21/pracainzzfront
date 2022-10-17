const express = require('express')
const cors = require('cors')
const pg = require('pg')
const http = require('http')
const {PrismaClient} = require('@prisma/client')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const JWT = require('jsonwebtoken')
const crypto = require('crypto')
const {Stripe} = require('stripe')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000/chat',
        methods: ["GET", "POST"]
    }
})

/*
, {
    cors: {
        origin: 'http://localhost:3000/chat',
        methods: ["GET", "POST"]
    }
}
*/
const prisma = new PrismaClient()

const pg_client = new pg.Client("postgres://walotggl:SyCefhYZhqir55psmEC2bz3Zr-90b5YC@tyke.db.elephantsql.com/walotggl")

pg_client.connect((err) => {
    if (err) {
        console.log(err)
    }
})

//console.log(io)
io.on('connection', (socket) => {
    socket.on('new-chat', (user) => {
        console.log(`New active user: ${user}`)
        socket.emit('is-active', 'yes')
    })
    //console.log(`user connected: ${socket.id}`)

    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data)
    })

    
})
io.on('connect_error', (err) => {
    console.log(err.message)
})

const transportMail = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD 
    }
})

const stripe = new Stripe(process.env.SECRET_PAYMENT_KEY)

stripe.customers.create({
    email: 'p.najda@hotmail.com'
}).then(item => console.log(item.email))
.catch(err => console.log(err))

app.get('/', (req, res) => {
    pg_client.query('SELECT * FROM users').then((data) => {
        res.json(data)
    })
})

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
  });

app.get('/getUser/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT * FROM users WHERE id = $1', [id]).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json(err)
    })
})


app.post('/registerClient', async (req, res) => {
    const {id, firstName, lastName, email, dateOfBirth, joining_date, username, password} = req.body
    await pg_client.query('INSERT INTO users (firstName, lastName, email, dateOfBirth, joining_date, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [firstName, lastName, email, new Date(dateOfBirth.toString()), new Date().toLocaleDateString('en-CA'), username, password]).then(data => {
        console.log(data)
        res.status(201).json(data)
        const token =  JWT.sign({id: id, username}, 'elelelele')
        const linkCipher = crypto.randomBytes(20)
        transportMail.sendMail({
            from: `Portal <${process.env.MAIL}>`,
            to: email,
            subject: 'Activate your account',
            html: `
                Welcome! Link to activate your account: <a>http://localhost:3000/login/${linkCipher}</a>
            `
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/login', async (req, res) => {
    const {user, password} = req.body
    await pg_client.query('SELECT * FROM users WHERE email = $1 and password = $2', [req.body.user, req.body.password])
    .then((data) => {
        console.log(user, password)
        console.log(data.rows)
        const token = JWT.sign({id: data.rows.id, user: req.body.user}, 'elelelele')
        res.status(200).json({
            user: data.rows,
            token: token
        })
    }).catch(err => {
        //console.log(user, password)
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/logout', async (req, res) => {

})

app.post('/getEmail', async (req, res) => {
    await pg_client.query('SELECT * FROM users WHERE email = $1', [req.body.email])
    .then((data) => {
        res.status(200).json(data)
        const recoverMailCipher = crypto.randomBytes(20)
        transportMail.sendMail({
            from: `Portal <${process.env.MAIL}>`,
            to: req.body.email,
            subject: 'Recover your password',
            html: `
                Welcome! Link to activate your account: <a>http://localhost:3000/newPassword/${data.rows[0].id}/${recoverMailCipher}</a>
            `
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.put('/changePassword/:id', async (req, res) => {
    const id = req.params.id
    const {password} = req.body
    await pg_client.query('UPDATE users SET password = $1 WHERE id = $2', [password, id])
    .then((data) => {
        console.log(`id: ${id}`)
        console.log(data)
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.delete('/deleteUser', async (req, res) => {
    const id = req.params.id
    await pg_client.query('DELETE FROM users WHERE id = $1', [id])
    .then((data) => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.put('/changeData', async (req, res) => {

})


//POSTS and COMMENTS

app.post('/writePost', async (req, res) => {
    const {content, authorId, multimedia} = req.body
    await pg_client.query('INSERT INTO posts (content, authorID, creating_date, multimedia) VALUES ($1, $2, $3, $4)', [content, authorId, new Date().toLocaleDateString('en-CA'), multimedia])
    .then(data => {
        console.log(data)
        res.status(201).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getAuthor/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT firstname, lastname FROM users WHERE id= $1', [id])
    .then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.put('/editPost', async (req, res) => {
    //await pg_client.query('UPDATE posts SET content = $1 WHERE ')
})

app.post('/deletePost/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('DELETE FROM posts WHERE post_id = $1', [id])
    .then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getAllPosts', async (req, res) => {
    await pg_client.query('SELECT * FROM posts')
    .then(data => {
        //console.log(data)
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getUsersPosts/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT * FROM posts WHERE authorid = $1', [id])
    .then(data => {
        console.log(data)
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/addLike', async (req, res) => {

})

app.post('/addComment', async (req, res) => {
    const {post, author, content} = req.body
    await pg_client.query('INSERT INTO comments (content, author, creating_date, post) VALUES ($1, $2, $3, $4)', [content, author, new Date().toLocaleDateString('en-CA'), post]).then((data) => {
        console.log(data)
        res.status(201).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.put('/editComment', async (req, res) => {
    //
})

app.delete('/deleteComment', async (req, res) => {
    //
})

app.get('/getComments', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT * FROM comments')
    .then(data => {
        console.log(data)
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getComments/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT * FROM comments WHERE post = $1', [id])
    .then(data => {
        console.log(data)
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

//CONTACTS
app.post('/sendRequest', async (req, res) => {
    await pg_client.query('INSERT INTO relations_requests (begun, sender, receiver) VALUES ($1, $2, $3)', [new Date().toLocaleDateString('en-CA'), req.body.sender, req.body.receiver])
    .then(data => {
        res.status(201).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getRequests/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT * FROM relations_requests where receiver = $1', [id])
    .then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/undoRequest', async (req, res) => {
    const {sender, receiver} = req.body
    await pg_client.query('DELETE FROM relations_requests WHERE sender = $1 AND receiver = $2', [sender, receiver])
    .then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/addFriend', async (req, res) => {
    const {first_partner, second_partner} = req.body
    await pg_client.query('INSERT INTO relationships(begun, first_partner, second_partner) VALUES ($1, $2, $3)', [new Date().toLocaleDateString('en-CA'), first_partner, second_partner])
    .then(data => {
        console.log(data)
        res.status(201).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getFriends/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT * FROM relationships WHERE first_partner = $1 OR second_partner = $1', [id])
    .then(data => {
        console.log(data)
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/deleteFriend/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('DELETE FROM relationships WHERE first_partner = $1 and second_partner = $2 OR first_partner = $2 and second_partner = $1', [loggedUser, id])
    .then(data => {
        console.log(data)
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/blockUser/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('INSERT INTO relations_blocked (blocker, blocked) VALUES ($1, $2)', [blocker, id])
    .then(data => {
        res.status(201).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/unblockUser/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('DELETE FROM relations_blocked WHERE blocker = $1 AND blocked = $2)', [blocker, id])
    .then(data => {
        res.status(201).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

//NOTIFICATIONS
app.get('/getNotifications', async (req, res) => {
    
})

//PAYMENTS
app.post('/createPaymentSession', async (req, res) => {
    const {element, quantity, totalPrice} = req.body
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    element: element,
                    quantity: quantity,
                    totalPrice: totalPrice
                }
            ],
            success_url: 'http://localhost:3000/dashboard',
            cancel_url: 'http://localhost:3000/payment'
        })
        res.status(200).json({message:'success'})
    } catch(err) {
        console.log(err)
        res.status(500).json({message:"OOPS"})
    }
})

server.listen(2023, () => {
    console.log('App backend works!')
})