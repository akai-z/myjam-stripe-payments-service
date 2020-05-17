const airtable = rootRequire('services/integrations/airtable')

function createOrder(orderId, items) {
  airtable.createRecord(
    process.env.AIRTABLE_ORDER_VIEW,
    { "order_id": orderId },
    (err, record) => {
      if (err) {
        console.error(err)
        return
      }

      items.forEach(item => {
        item.fields['order_id'] = [ record.id ]
      })

      addItems(items)
    }
  )
}

async function updateOrder(orderId, data) {
  const orderRecordId =  await airtableRecordId(
    orderId,
    process.env.AIRTABLE_ORDER_VIEW,
    { maxRecords: 1, pageSize: 1 }
  )

  airtable.updateRecord(process.env.AIRTABLE_ORDER_VIEW, orderRecordId, data)
}

function addItems(items) {
  airtable.createRecord(process.env.AIRTABLE_ORDER_ITEMS_VIEW, items)
}

function updateItems(orderId, items) {
  deleteItems(
    orderId,
    async (err, record) => {
      if (err) {
        console.error(err)
        return
      }

      const orderRecordId =  await airtableRecordId(
        orderId,
        process.env.AIRTABLE_ORDER_VIEW
      )

      items.forEach(item => {
        item.fields['order_id'] = [ orderRecordId ]
      })

      addItems(items)
    }
  )
}

async function deleteItems(orderId, callback) {
  const orderItemRecordIds =  await airtableRecordId(
    orderId,
    process.env.AIRTABLE_ORDER_ITEMS_VIEW
  )

  airtable.deleteRecords(
    process.env.AIRTABLE_ORDER_ITEMS_VIEW,
    orderItemRecordIds,
    callback
  )
}

async function airtableRecordId(
  orderId,
  table,
  additionalSelectParams = {}
) {
  const recordIds = []
  let selectParams = {
    fields: ['order_id'],
    filter: `order_id = "${orderId}"`
  }

  const records = await airtable.list(
    table,
    { ...selectParams, ...additionalSelectParams }
  )

  records.forEach(record => {
    recordIds.push(record.id)
  })

  return recordIds.length === 1 ? recordIds[0] : recordIds
}

module.exports = {
  createOrder,
  addItems,
  updateOrder,
  updateItems
}
