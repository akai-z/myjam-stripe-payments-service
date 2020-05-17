const cart = rootRequire('services/payment/cart')

const routeName = 'cart'

function setRoute(app) {
  app.post(`/${routeName}`, routeHandler)
}

async function routeHandler(req, res) {
  try {
    const paymentIntent = await cart.create(
      req.body.amount,
      req.body.line_items
    )

    res.send(paymentIntent)
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
