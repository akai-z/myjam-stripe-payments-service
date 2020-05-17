const stripe = rootRequire('services/integrations/stripe')
const order = rootRequire('services/payment/order')
const shipping = rootRequire('services/payment/shipping')

async function create(total, lineItems) {
  const paymentIntent = await stripe.createPaymentIntent({
    amount: (total * 100) + shipping.amount(),
    metadata: { "shipping_amount": shipping.amount() }
  })

  order.createOrder(paymentIntent.id, lineItems)

  return paymentIntent
}

async function update(paymentIntentId, total, lineItems) {
  const paymentIntent = await stripe.paymentIntent(paymentIntentId)
  total = (total * 100) + shipping.amount()

  if (paymentIntent.metadata.tip_amount) {
    total += parseInt(paymentIntent.metadata.tip_amount)
  }

  if (paymentIntent.metadata.coupon_code) {
    total -= parseInt(paymentIntent.metadata.coupon_discount)
  }

  const updatedPaymentIntent = await stripe.updatePaymentIntent(
    paymentIntentId,
    { amount: total }
  )

  order.updateItems(paymentIntent.id, lineItems)

  return updatedPaymentIntent
}

module.exports = {
  create,
  update
}
