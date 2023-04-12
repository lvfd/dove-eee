const path = require('path')
const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const session = require('express-session')
const bodyParser = require('body-parser')
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

app.use(session({
  name: 'dove.eee.uid',
  secret: 'goose',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {}
}))

/* Login Page: */
app.get(`/${appname}`, (req, res) => res.render('login'))

/* Login Post: */
app.post(`/${appname}/login`, bodyParser.urlencoded({ extended: false }), (req, res) => {
  const loginInfo = req.body
  const session = req.session
  for ( var p in loginInfo ) {
    session[p] = loginInfo[p]
  }
  res.redirect(`/${appname}/main`)
})

/* Main Page: */
app.get(`/${appname}/main`, (req, res) => {
  // res.render('main')
  res.send(req.session)
})

app.get(`/${appname}/edit`, (req, res) => res.render('edit'))

app.post(`/${appname}/images/upload`, upload.single('file'), (req, res) => {
  const image = req.file
  res.status(200).json({
    msg: 'success',
    location: `/${appname}/uploads/${image.filename}`
  })
})

app.listen(port, () => console.log(`eee is running in port: ${port}, env = ${env}`))