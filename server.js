require('dotenv').config(); //chama o dotenv (dep de segurança para ajudar a proteger senha e login do BD )
const express = require('express'); // chama o express
const app = express(); // express
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING,
  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
  })
  .then(() => {
    app.emit('pronto');
  })
  .catch(e => console.log(e));
const session = require('express-session');// sessions para flash
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');// flash para mensagens autodestr
const routes = require('./routes');// chama rotas
const path = require('path');// chama path
const helmet = require('helmet');// chama helmet (dep de segurança)
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
  secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
});
