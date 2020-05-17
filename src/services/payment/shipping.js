function amount() {
  return process.env.SHIPPING_AMOUNT * 100
}

module.exports = {
  amount
}
