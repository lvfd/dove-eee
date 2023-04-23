const { dataServer, redisCluster } = require('./project.config')
const path = require('path')
const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const session = require('express-session')
const Redis = require('ioredis')
const RedisStore = require('connect-redis').default
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const axios = require('axios')
const app = express()
const port = 3000
const env = process.env.NODE_ENV? process.env.NODE_ENV: 'production'
const appname = 'dove-eee'
const dirname = __dirname
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, '/home/appusr/...')
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const arr = file.originalname.split('.')
    const fileSuffix = arr.length > 1? `.${arr[arr.length - 1]}`: ''
    const uniqueCode = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    cb(null, `${file.fieldname}-${uniqueCode}${fileSuffix}`)
  }
})
// const upload = multer({ dest: 'uploads/'})
const upload = multer({ storage: storage })

app.set('view engine', 'html')
app.engine('html', ejs.__express)
app.set('views', path.resolve(dirname, 'views'))
app.use(`/${appname}/libs`, express.static(path.resolve(dirname, 'libs')))
app.use(`/${appname}/release`, express.static(path.resolve(dirname, 'release')))
app.use(`/${appname}/uploads`, express.static(path.resolve(dirname, 'uploads')))

app.use(cookieParser())
app.use(session({
  name: 'dove.eee.uid',
  secret: 'goose',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 1000 * 60 * 60/*min*/,
    httpOnly: false
  },
  store: new RedisStore({
    prefix: 'DOVEPAY:DOVE_EEE:USER:',
    client: new Redis.Cluster(redisCluster.rootNodes, {
      redisOptions: {
        password: redisCluster.password
      },
      // keyPrefix: "DOVEPAY:",
      clusterRetryStrategy: (times) => Math.min(times * 50, 2000),
      enableReadyCheck: true
    })
  })
}))

function isAuthenticated (req, res, next) {
  if (req.session.username) next()
  else res.redirect(`/${appname}`)
}

/* Login Page: */
app.get(`/${appname}`, (req, res) => res.render('login'))

/* Login Post: */
app.post(`/${appname}/login`, bodyParser.json(), (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  axios.post(`${dataServer}/dove-eee-data/checkPassword`, {
    username: username,
    password: password
  })
  .then(response => {
    if (response.data === true) {
      return req.session.regenerate(err => {
        if (err) next(err)
        req.session.username = username
        req.session.save(err => {
          if (err) return next(err)
          res.status(201).json({ msg: '验证通过' })
        })
      })
    }
    return res.status(403).json({ msg: '密码错误' })
  })
  .catch(error => res.status(500).json({ 
    msg: '数据服务器连接错误',
    errorMsg: error
  }))
})

/* Logout: */
app.get(`/${appname}/logout`, (req, res, next) => {
  req.session.username = null
  req.session.save(err => {
    if (err) next(err)
    req.session.regenerate(err => {
      if (err) next(err)
      res.redirect(`/${appname}`)
    })
  })
})

/* Main Page: */
app.get(`/${appname}/main`, isAuthenticated, (req, res) => {
  res.render('main', { username: req.session.username })
})

/* New article Page: */
app.get(`/${appname}/main/new`, isAuthenticated, (req, res) => {
  res.render('new', { username: req.session.username })
})

app.get(`/${appname}/edit`, isAuthenticated, (req, res) => res.render('edit'))

app.post(`/${appname}/images/upload`, upload.single('file'), (req, res) => {
  const image = req.file
  res.status(200).json({
    msg: 'success',
    location: `/${appname}/uploads/${image.filename}`
  })
})

app.listen(port, () => console.log(`eee is running in port: ${port}, env = ${env}`))