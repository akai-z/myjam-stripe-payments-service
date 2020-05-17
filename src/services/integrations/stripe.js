const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY, stripeOptions)

async function createPaymentIntent(data) {
  const payload = {
    currency: process.env.CURRENCY,
    payment_method_types: process.env.PAYMENT_METHOD_TYPES.split(','),
    capture_method: process.env.CAPTURE_METHOD
  }

  return await stripe.paymentIntents.create({ ...payload, ...data })
}

async function paymentIntent(paymentIntentId) {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

async function updatePaymentIntent(paymentIntentId, params) {
  return await stripe.paymentIntents.update(paymentIntentId, params)
}

async function confirmPaymentIntent(paymentIntentId, sourceId) {
  return await stripe.paymentIntents.confirm(
    paymentIntentId,
    { source: sourceId }
  )
}

async function cancelPaymentIntent(paymentIntentId, sourceId) {
  return await stripe.paymentIntents.cancel(paymentIntentId)
}

function stripeOptions() {
  const options = {}

  if (process.env.STRIPE_MAX_NETWORK_RETRIES) {
    options.maxNetworkRetries = process.env.STRIPE_MAX_NETWORK_RETRIES
  }

  if (process.env.STRIPE_TIMEOUT) {
    options.timeout = process.env.STRIPE_TIMEOUT
  }

  return options
}

module.exports = {
  createPaymentIntent,
  paymentIntent,
  updatePaymentIntent,
  confirmPaymentIntent,
  cancelPaymentIntent
}
