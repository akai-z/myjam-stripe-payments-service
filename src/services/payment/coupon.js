const stripe = rootRequire('services/integrations/stripe')
const airtable = rootRequire('services/integrations/airtable')

async function applyCode(code, paymentIntentId) {
  const discount = await codeDiscount(code)

  if (!discount) {
    return paymentIntent
  }

  const paymentIntent = await stripe.paymentIntent(paymentIntentId)
  let amount = paymentIntent.amount

  if (paymentIntent.metadata.coupon_code) {
    amount += parseInt(paymentIntent.metadata.coupon_discount)
  }

  return await updatePaymentIntent(
    paymentIntentId,
    amount - discount,
    code,
    discount
  )
}

async function removeCode(code, paymentIntentId) {
  const paymentIntent = await stripe.paymentIntent(paymentIntentId)

  if (!paymentIntent.metadata.coupon_code) {
    return paymentIntent
  }

  return await updatePaymentIntent(
    paymentIntentId,
    paymentIntent.amount + parseInt(paymentIntent.metadata.coupon_discount),
    null,
    null
  )
}

async function codeDiscount(code) {
  const airtableSelectParams = {
    fields: ['discount'],
    filter: `code = "${code}"`,
    maxRecords: 1,
    pageSize: 1
  }

  const records = await airtable.list(
    process.env.AIRTABLE_COUPON_VIEW,
    airtableSelectParams
  )

  return records.length
    ? records[0].get('discount') * 100
    : null
}

async function updatePaymentIntent(
  paymentIntentId,
  updateAmount,
  couponCode,
  couponDiscount
) {
  const params = {
    amount: updateAmount,
    metadata: {
      "coupon_code": couponCode,
      "coupon_discount": couponDiscount
    }
  }

  return await stripe.updatePaymentIntent(paymentIntentId, params)
}

module.exports = {
  applyCode,
  removeCode
}
