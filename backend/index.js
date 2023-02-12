const express = require('express')
const cors = require('cors')
const pg = require('pg')
const bcrypt = require('bcryptjs')
const http = require('http')
const {PrismaClient} = require('@prisma/client')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const JWT = require('jsonwebtoken')
const stripe = require('stripe')('sk_test_51LnUboDIfBxVZtZzXpHT2Bqu24JfNb0t3lW3clIBSin5sIBN5gCGHqZNpE6PqnpyfC8GBE4rnhqsUiAcouktxv7j00wzxPpnQu')
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
    })
    //console.log(`user connected: ${socket.id}`)
    io.on('connection', (socket) => { 
        socket.on('send_message', (data) => {
            console.log(data)
            socket.broadcast.emit('receive_message', data)
        })
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
    const hashedPassword = bcrypt.hashSync(password, 10)
    await pg_client.query('INSERT INTO users (firstName, lastName, email, dateOfBirth, joining_date, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [firstName, lastName, email, new Date(dateOfBirth.toString()), new Date().toDateString('en-CA'), username, hashedPassword]).then(data => {
        console.log(data)
        res.status(201).json(data)
        
        const linkCipher = JWT.sign(email, 'secret')
        transportMail.sendMail({
            from: `Portal <${process.env.MAIL}>`,
            to: email,
            subject: 'Activate your account',
            html: `
                Welcome!<br/> Link to activate your account:<br/> <a href="http://localhost:3000/login/${linkCipher}">http://localhost:3000/login/${linkCipher}</a>
            `
        })
        stripe.customers.create({
            id: id,
            email: email
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/login', async (req, res) => {
    const {user, password} = req.body
    await pg_client.query('SELECT * FROM users WHERE email = $1', [user])
    .then((data) => {
        try {
            bcrypt.compareSync(String(password), data.rows[0].password)
            const token = JWT.sign({id: data.rows[0].id, user: req.body.user}, 'secret')
            res.status(200).json({
                user: data.rows,
                token: token
            })
        } catch(err) {
            res.status(500).json(err)
        }
        
    }).catch(err => {
        res.status(500).json(err)
    })
})

app.get('/getCookie', async (req, res) => {
    res.send(req.cookies)
})

app.get('/logout', async (req, res) => {
    const {token} = req.body

    res.cookie('logData', '', {maxAge: 1})
    
})

app.post('/getEmail', async (req, res) => {
    await pg_client.query('SELECT * FROM users WHERE email = $1', [req.body.email])
    .then((data) => {
        res.status(200).json(data)
        console.log(data.rows[0])
        const token = JWT.sign({email: data.rows[0].email}, 'secret')
        console.log(token)
        transportMail.sendMail({
            from: `Portal <${process.env.MAIL}>`,
            to: req.body.email,
            subject: 'Recover your password',
            html: `
                Welcome!<br/> Link to activate your account:<br/> <a href="http://localhost:3000/newPassword/${token}/${data.rows[0].id}">http://localhost:3000/newPassword/${token}/${data.rows[0].id}</a>
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
    const hashPass = bcrypt.hashSync(password, 10)
    await pg_client.query('UPDATE users SET password = $1 WHERE id = $2', [hashPass, id])
    .then((data) => {
        console.log(`id: ${id}`)
        console.log(data)
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.delete('/deleteUser/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('DELETE FROM users WHERE id = $1', [id])
    .then((data) => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

//POSTS and COMMENTS

app.post('/writePost', async (req, res) => {
    const {content, authorId} = req.body
    await pg_client.query('INSERT INTO posts (content, authorID, creating_date) VALUES ($1, $2, $3)', [content, authorId, new Date().toLocaleDateString('en-CA')])
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


app.post('/addComment', async (req, res) => {
    const {post, author, content} = req.body
    await pg_client.query('INSERT INTO comments (content, authorid, creating_date, post) VALUES ($1, $2, $3, $4)', [content, author, new Date().toLocaleDateString('en-CA'), post]).then((data) => {
        console.log(data)
        res.status(201).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getComments', async (req, res) => {
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

//PAYMENTS
app.post('/createPaymentSession', async (req, res) => {
    const {userid, email, quantity, totalPrice, cardNumber, cardExpDate, cardCVV} = req.body
    try {
        const cardCredentials = await stripe.tokens.create({
            card: {
                number: cardNumber,
                exp_month: cardExpDate.substring(0, cardExpDate.indexOf('/')),
                exp_year: cardExpDate.substring(cardExpDate.indexOf('/')+1, cardExpDate.length),
                cvc: cardCVV
            }
        })

        const card = await stripe.customers.createSource(String(userid), {
            source: cardCredentials.id
        })

        await stripe.charges.create({
            receipt_email: email,
            amount: Math.round(Number(totalPrice)*100),
            currency: 'usd',
            card: card.id,
            customer: String(userid)
        }).then(data => {
            console.log(data)
            stripe.paymentIntents.create({
                //payment_method: cardCredentials.id,
                amount: Math.round(Number(totalPrice)*100),
                currency: "usd",
                automatic_payment_methods: {enabled: true},
            }).then(dataD => {
                console.log(dataD)
                console.log('Success!')
                res.status(200).json(dataD)
                transportMail.sendMail({
                    from: `Portal <${process.env.MAIL}>`,
                    to: email,
                    subject: 'Receipt for your purchase',
                    html: `
                        Your receipt for your last purchase </br> <a href="${data.receipt_url}">${data.receipt_url}</a>
                    `
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
        }).catch(err => {
            console.log(err)
        })

        
        //res.status(200).json({message:'success'})
    } catch(err) {
        console.log(err)
        res.status(500).json({message:"OOPS"})
    }
})

app.get('/getBoughtStock/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT * FROM stockbought WHERE owner = $1', [id])
    .then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getCountOfStock/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT COUNT(*) FROM stockbought WHERE owner = $1', [id])
    .then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getBoughtCrypto/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT * FROM cryptobought WHERE owner = $1', [id])
    .then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getCountOfCrypto/:id', async (req, res) => {
    const id = req.params.id
    await pg_client.query('SELECT COUNT(*) FROM cryptobought WHERE owner = $1', [id])
    .then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/buyStock', async (req, res) => {
    const {item, quantity, totalPrice, owner} = req.body
    await pg_client.query('INSERT INTO stockbought (item, quantity, owner) VALUES ($1, $2, $3)', [item, quantity, owner])
    .then(data => {
        res.status(201).json(data)
        stripe.products.create({
            name: item,
            metadata: {price: totalPrice}
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/updateStock', async (req, res) => {
    const {id, item, quantity} = req.body
    await pg_client.query('UPDATE stockbought SET owner = $1 WHERE item = $2 AND quantity = $3', [id, item, quantity])
})

app.post('/updateCrypto', async (req, res) => {
    const {id, item, quantity} = req.body
    await pg_client.query('UPDATE cryptobought SET owner = $1 WHERE item = $2 AND quantity = $3', [id, item, quantity])
})

app.post('/buyCrypto', async (req, res) => {
    const {item, quantity, totalPrice, owner} = req.body
    await pg_client.query('INSERT INTO cryptobought (item, quantity, owner) VALUES ($1, $2, $3)', [item, quantity, owner])
    .then(data => {
        res.status(201).json(data)
        stripe.products.create({
            name: item,
            metadata: {price: totalPrice},
            default_price_data: Math.round(Number(totalPrice)*100)
        }).then(response => {
            console.log(response)
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/addChatMessage', async (req, res) => {
    const {content, author, receiver} = req.body
    console.log(req.body)
    await pg_client.query('INSERT INTO chats (content, sender, receiver) VALUES ($1, $2, $3)', [content, author, receiver])
    .then(data => {
        res.status(201).json(data)
    })
})

server.listen(2023, () => {
    console.log('App backend works!')
})