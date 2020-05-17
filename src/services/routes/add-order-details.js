const order = rootRequire('services/payment/order')

const routeName = 'order-details'

function setRoute(app) {
  app.put(`/${routeName}`, routeHandler)
}

async function routeHandler(req, res) {
  try {
    order.updateOrder(
      req.body.order_id,
      req.body.details
    )

    res.send()
  } catch (err) {
    console.error(err)
    res.status(500).send(
      'An error has occurred. Please contact the website administrator.'
    )
  }
}

module.exports = {
  setRoute
}
