const express = require('express')
const cors = require('cors')
const pg = require('pg')
const bcrypt = require('bcryptjs')
const http = require('http')
const {PrismaClient} = require('@prisma/client')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const redis = require('redis')
const JWT = require('jsonwebtoken')
const JWT_redis = require('jwt-redis').default
const crypto = require('crypto')
const stripe = require('stripe')('sk_test_51LnUboDIfBxVZtZzXpHT2Bqu24JfNb0t3lW3clIBSin5sIBN5gCGHqZNpE6PqnpyfC8GBE4rnhqsUiAcouktxv7j00wzxPpnQu')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

//const redisclient = redis.createClient()
/*redisclient.connect({ url: 'redis://redis:6379' }).then(res => {
    console.log('redisclient is connnected')
}).catch(err => {
    console.log(err)
})
const jwtrClient = new JWT_redis(redisclient)*/

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

//const stripe = new Stripe(process.env.SECRET_PAYMENT_KEY)

/*Stripe.customers.create({
    email: 'p.najda@hotmail.com'
})//.then(item => console.log(item.email))
//.catch(err => console.log(err))
*/
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
        //const token =  JWT.sign({id: id, username}, 'elelelele')
        
        const linkCipher = crypto.randomBytes(20)
        transportMail.sendMail({
            from: `Portal <${process.env.MAIL}>`,
            to: email,
            subject: 'Activate your account',
            html: `
                Welcome! Link to activate your account: <a>http://localhost:3000/login/${linkCipher.toString('base64')}</a>
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
    await pg_client.query('SELECT * FROM users WHERE email = $1 or username = $2 and password = $3', [req.body.user, req.body.user, req.body.password])
    .then((data) => {
        let cookie
        console.log(user, password)
        console.log(data.rows[0])
        bcrypt.compareSync(password, data.rows[0].password)
        console.log(data.rows)
        const token = JWT.sign({id: data.rows[0].id, user: req.body.user}, 'elelelele')
        /*cookie = res.cookie('logData', {
            user: data.rows,
            token: token
        }, {expiresIn: '1h'})*/
        //console.log(cookie)
        cookie = res.cookie('logData', token, {maxAge: 3600000})
        console.log(cookie)
        res.status(200).json({
            user: data.rows,
            token: token
        })
        //res.send(cookie)
    }).catch(err => {
        //console.log(user, password)
        console.log(err)
        res.status(500).json(err)
    })
})

app.get('/getCookie', async (req, res) => {
    res.send(req.cookies)
})

app.get('/logout', async (req, res) => {
    const {token} = req.body

    res.cookie('logData', '', {maxAge: 1})

    /*try {
        jwtrClient.destroy(token)
        console.log('logout!')
        res.status(200).json('User is logged out!')
    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }*/
    
})

app.post('/getEmail', async (req, res) => {
    await pg_client.query('SELECT * FROM users WHERE email = $1', [req.body.email])
    .then((data) => {
        res.status(200).json(data)
        console.log(data.rows[0])
        const recoverMailCipher = crypto.randomBytes(64)
        console.log(recoverMailCipher.toString('base64'))
        transportMail.sendMail({
            from: `Portal <${process.env.MAIL}>`,
            to: req.body.email,
            subject: 'Recover your password',
            html: `
                Welcome! Link to activate your account: <a>http://localhost:3000/newPassword/${recoverMailCipher.toString('base64')}/${data.rows[0].id}</a>
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

app.delete('/deletePost/:id', async (req, res) => {
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
    const {userid, email, quantity, totalPrice, cardNumber, cardExpDate, cardCVV} = req.body
    console.log(req.body)
    console.log(`email before trying to create a client: ${email}`)
    try {
        /*await stripe.customers.create({
            id: userid,
            email: email
        }).then(data => {
            console.log(`email after trying to create a client: ${email}`)
            console.log(data)
        }).catch(err => {
            console.log(err)
        })*/

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
            amount: quantity,
            currency: 'usd',
            card: card.id,
            customer: String(userid)
        }).then(data => {
            console.log(data)
            stripe.paymentIntents.create({
                //payment_method: cardCredentials.id,
                amount: Number(quantity),
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
                        Your receipt for your last Crypto purchase : <a>${data.receipt_url}</a>
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
    await pg_client.query('SELECT * FROM stockbought')
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

app.post('/buyStock', async (req, res) => {
    const {item, quantity, owner} = req.body
    await pg_client.query('INSERT INTO StockBought VALUES ($1, $2, $3)', [item, Number(quantity), Number(owner)])
    .then(data => {
        res.status(201).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

app.post('/buyCrypto', async (req, res) => {
    const {item, quantity, owner} = req.body
    await pg_client.query('INSERT INTO cryptobought (item, quantity, owner) VALUES ($1, $2, $3)', [item, quantity, owner])
    .then(data => {
        res.status(201).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

server.listen(2023, () => {
    console.log('App backend works!')
})