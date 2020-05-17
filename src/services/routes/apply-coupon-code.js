const coupon = rootRequire('services/payment/coupon')

const routeName = 'coupon-code'

function setRoute(app) {
  app.post(`/${routeName}`, routeHandler)
}

async function routeHandler(req, res) {
  try {
    const paymentIntent = await coupon.applyCode(
      req.body.coupon_code,
      req.body.cart_id
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
