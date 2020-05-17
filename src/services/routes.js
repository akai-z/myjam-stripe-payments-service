const fs = require('fs')
const cors = require('cors')

function init(app, express) {
  app.use(cors({ origin: true }))
  setBodyParser(app, express)
  setRoutes(app)
}

function setBodyParser(app, express) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
}

function setRoutes(app) {
  fs.readdirSync(srcPath('services/routes')).forEach(route => {
    rootRequire(`services/routes/${route}`).setRoute(app)
  })
}

module.exports = {
  init
}
