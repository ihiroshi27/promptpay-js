const { decode } = require('./tvl')

const tag = require('./constants/tag.json')
const promptPayCreditTransfer = require('./constants/promptPayCreditTransfer.json')
const promptPayBillPayment = require('./constants/promptPayBillPayment.json')
const additionalDataField = require('./constants/additionalDataField.json')

const PROMPTPAY_CREDIT_TRANSFER = 'PROMPTPAY_CREDIT_TRANSFER'
const PROMPTPAY_BILL_PAYMENT = 'PROMPTPAY_BILL_PAYMENT'
const ADDITIONAL_DATA_FIELD = 'ADDITIONAL_DATA_FIELD'

const UNKNOWN = 'UNKNOWN'

/**
 * 
 * @typedef {'PROMPTPAY_CREDIT_TRANSFER' | 'PROMPTPAY_BILL_PAYMENT' | 'ADDITIONAL_DATA_FIELD'} TagType
 * 
 */

/**
 * 
 * @param {TagType} tagType
 * @param {string} tagID
 * 
 */
function findTagKey (tagType, id) {
  switch (tagType) {
    case PROMPTPAY_CREDIT_TRANSFER:
      return Object.keys(promptPayCreditTransfer).find((key) => promptPayCreditTransfer[key] === id) || UNKNOWN
    case PROMPTPAY_BILL_PAYMENT:
      return Object.keys(promptPayBillPayment).find((key) => promptPayBillPayment[key] === id) || UNKNOWN
    case ADDITIONAL_DATA_FIELD:
      return Object.keys(additionalDataField).find((key) => additionalDataField[key] === id) || UNKNOWN
    default:
      return Object.keys(tag).find((key) => tag[key] === id) || UNKNOWN
  }
}

/**
 * 
 * @param {string} payload 
 * @param {TagType} [tagType] 
 */
function parse (payload, tagType) {
  if (!payload) throw new Error('Missing required payload')
  if (typeof payload !== 'string') throw new Error('Invalid parameter: payload must be string')
  if (tagType && ![PROMPTPAY_CREDIT_TRANSFER, PROMPTPAY_BILL_PAYMENT, ADDITIONAL_DATA_FIELD].includes(tagType)) throw new Error('Invalid Parameter: tagType')

  const data = {}
  while (payload.length > 0) {
    const decoded = decode(payload)

    switch (decoded.id) {
      case tag.PROMPTPAY_CREDIT_TRANSFER:
        data[decoded.id] = {
          key: findTagKey(tagType, decoded.id),
          value: parse(decoded.value, PROMPTPAY_CREDIT_TRANSFER)
        }
        break
      case tag.PROMPTPAY_BILL_PAYMENT:
        data[decoded.id] = {
          key: findTagKey(tagType, decoded.id),
          value: parse(decoded.value, PROMPTPAY_BILL_PAYMENT)
        }
        break
      case tag.ADDITIONAL_DATA_FIELD:
        data[decoded.id] = {
          key: findTagKey(tagType, decoded.id),
          value: parse(decoded.value, ADDITIONAL_DATA_FIELD)
        }
        break
      default:
        data[decoded.id] = {
          key: findTagKey(tagType, decoded.id),
          value: decoded.value
        }
    }

    if (payload.length - decoded.raw.length < 0) throw new Error('Invalid Payload')

    payload = payload.substr(decoded.raw.length, payload.length)
  }

  return data
}

module.exports = parse