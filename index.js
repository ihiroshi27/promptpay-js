const { crc16xmodem } = require('crc')

const { encode, decode } = require('./tvl') 

const tag = require('./constants/tag.json')
const pointOfInitiationMethod = require('./constants/pointOfInitiationMethod.json')
const application = require('./constants/application.json')
const promptPayCreditTransfer = require('./constants/promptPayCreditTransfer.json')
const promptPayBillPayment = require('./constants/promptPayBillPayment.json')
const additionalDataField = require('./constants/additionalDataField.json')
const vat = require('./constants/vat.json')

const PROMPTPAY_CREDIT_TRANSFER = 'PROMPTPAY_CREDIT_TRANSFER'
const PROMPTPAY_CREDIT_TRANSFER_WITH_OTA = 'PROMPTPAY_CREDIT_TRANSFER_WITH_OTA'
const PROMPTPAY_BILL_PAYMENT = 'PROMPTPAY_BILL_PAYMENT'
const PROMPTPAY_BILL_PAYMENT_CROSS_BORDER = 'PROMPTPAY_BILL_PAYMENT_CROSS_BORDER'

const MOBILE_NUMBER = 'MOBILE_NUMBER'
const NATIONAL_ID = 'NATIONAL_ID'
const TAX_ID = 'TAX_ID'
const E_WALLET_ID = 'E_WALLET_ID'
const BANK_ACCOUNT = 'BANK_ACCOUNT'

const CRC_INITIAL = 0xFFFF
const CRC_LENGTH = '04'

const ADDITIONAL_DATA_FIELD = 'ADDITIONAL_DATA_FIELD'

const UNKNOWN = 'UNKNOWN'

/**
 * 
 * @typedef {'QR_STATIC' | 'QR_DYNAMIC' | 'BLE_STATIC' | 'BLE_DYNAMIC' | 'NFC_STATIC' | 'NFC_DYNAMIC'} Method
 * @typedef {'PROMPTPAY_CREDIT_TRANSFER' | 'PROMPTPAY_CREDIT_TRANSFER_WITH_OTA' | 'PROMPTPAY_BILL_PAYMENT' | 'PROMPTPAY_BILL_PAYMENT_CROSS_BORDER'} Application
 * @typedef {'PROMPTPAY_CREDIT_TRANSFER' | 'PROMPTPAY_BILL_PAYMENT' | 'ADDITIONAL_DATA_FIELD'} TagType
 * 
 */

 /**
 * 
 * @param {TagType} type
 * @param {string} id
 * 
 */
function findTagKey (type, id) {
  switch (type) {
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
 * @param {object} config 
 * @param {Method} config.method
 * @param {Application} config.application
 * @param {string} [config.mobileNumber]
 * @param {string} [config.nationalID]
 * @param {string} [config.taxID]
 * @param {string} [config.eWalletID]
 * @param {string} [config.bankAccount]
 * @param {string} [config.ota]
 * @param {string} [config.billerID]
 * @param {string} [config.reference1]
 * @param {string} [config.reference2]
 * @param {string} [config.mcc]
 * @param {string} config.currencyCode
 * @param {string} [config.amount]
 * @param {string} [config.tip]
 * @param {string} config.countryCode
 * @param {string} [config.merchantName]
 * @param {string} [config.merchantCity]
 * @param {string} [config.postalCode]
 * @param {object} [config.additional]
 * @param {string} [config.additional.billNumber]
 * @param {string} [config.additional.mobileNumber]
 * @param {string} [config.additional.storeID]
 * @param {string} [config.additional.loyaltyNumber]
 * @param {string} [config.additional.referenceID]
 * @param {string} [config.additional.customerID]
 * @param {stirng} [config.additional.terminalID]
 * @param {string} [config.additional.purposeOfTransaction]
 * @param {string} [config.additional.additionalCustomerData]
 * @param {string} [config.merchantInformation]
 * @param {string} [config.sellerTaxBranchID]
 * @param {string} [config.vatRate]
 * @param {string} [config.vatAmount]
 * 
 */
function generate (config) {
  if (typeof config !== 'object') throw new Error('Missing config')
  if (!config.method) throw new Error('Missing required config: method')
  if (!config.application) throw new Error('Missing required config: application')
  if (!config.currencyCode) throw new Error('Missing required config: currencyCode')
  if (!config.countryCode) throw new Error('Missing required config: countryCode')

  if (!Object.keys(pointOfInitiationMethod).includes(config.method)) throw new Error('Invalid parameter: method')
  if (!Object.keys(application).includes(config.application)) throw new Error('Invalid parameter: application')

  let payload = encode(tag.PAYLOAD_FORMAT_INDICATOR, '01')
  payload += encode(tag.POINT_OF_INITIATION_METHOD, pointOfInitiationMethod[config.method])

  if (
    config.application === PROMPTPAY_CREDIT_TRANSFER ||
    config.application === PROMPTPAY_CREDIT_TRANSFER_WITH_OTA
  ) {
    const identification = [
      { key: MOBILE_NUMBER, value: config.mobileNumber },
      { key: NATIONAL_ID, value: config.nationalID },
      { key: TAX_ID, value: config.taxID },
      { key: E_WALLET_ID, value: config.eWalletID },
      { key: BANK_ACCOUNT, value: config.bankAccount }
    ].filter((val) => val.value)

    if (identification.length === 0) throw new Error(`${config.application} missing required config`)
    if (config.application === PROMPTPAY_CREDIT_TRANSFER_WITH_OTA && !config.ota) throw new Error(`${config.application} missing required config: ota`)

    payload += encode(
      tag.PROMPTPAY_CREDIT_TRANSFER,
      encode(promptPayCreditTransfer.AID, application[config.application]) +
      encode(promptPayCreditTransfer[identification[0].key], identification[0].value) +
      (config.ota ? encode(promptPayCreditTransfer.OTA, config.ota) : '')
    )
  } else if (
    config.application === PROMPTPAY_BILL_PAYMENT ||
    config.application === PROMPTPAY_BILL_PAYMENT_CROSS_BORDER
  ) {
    if (!config.billerID) throw new Error(`${config.application} missing required config: billerID`)
    if (!config.reference1) throw new Error(`${config.application} missing required config: reference1`)

    payload += encode(
      tag.PROMPTPAY_BILL_PAYMENT, 
      encode(promptPayBillPayment.AID, application[config.application]) +
      encode(promptPayBillPayment.BILLER_ID, config.billerID) +
      encode(promptPayBillPayment.REFERENCE_1, config.reference1) +
      (config.reference2 ? encode(promptPayBillPayment.REFERENCE_2, config.reference2) : '')
    )
  }

  if (config.mcc) payload += encode(tag.MCC, config.mcc)
  payload += encode(tag.CURRENCY_CODE, config.currencyCode)
  if (config.amount) payload += encode(tag.AMOUNT, config.amount)
  payload += encode(tag.COUNTRY_CODE, config.countryCode)
  if (config.merchantName) payload += encode(tag.MERCHANT_NAME, config.merchantName)
  if (config.merchantCity) payload += encode(tag.MERCHANT_CITY, config.merchantCity)
  if (config.postalCode) payload += encode(tag.POSTAL_CODE, config.postalCode)

  if (config.additional) {
    const {
      billNumber,
      mobileNumber,
      storeID,
      loyaltyNumber,
      referenceID,
      customerID,
      terminalID,
      purposeOfTransaction,
      additionalCustomerData
    } = config.additional
    payload += encode(
      tag.ADDITIONAL_DATA_FIELD,
      (billNumber ? encode(additionalDataField.BILL_NUMBER, billNumber) : '') +
      (mobileNumber ? encode(additionalDataField.MOBILE_NUMBER, mobileNumber) : '') +
      (storeID ? encode(additionalDataField.STORE_ID, storeID) : '') +
      (loyaltyNumber ? encode(additionalDataField.LOYALTY_NUMBER, loyaltyNumber) : '') +
      (referenceID ? encode(additionalDataField.REFERENCE_ID, referenceID) : '') +
      (customerID ? encode(additionalDataField.CUSTOMER_ID, customerID) : '') +
      (terminalID ? encode(additionalDataField.TERMINAL_ID, terminalID) : '') +
      (purposeOfTransaction ? encode(additionalDataField.PERPOSE_OF_TRANSACTION, purposeOfTransaction) : '') +
      (additionalCustomerData ? encode(additionalDataField.ADDITIONAL_CUSTOMER_DATA, additionalCustomerData) : '')
    )
  }

  if (config.merchantInformation) payload += encode(tag.MERCHANT_INFORMATION, config.merchantInformation)
  if (config.sellerTaxBranchID) {
    if (!config.vatAmount) throw new Error('VAT TQRC missing required config: vatAmount')

    payload += encode(
      tag.VAT_TQRC,
      encode(vat.SELLER_TAX_BRANCH_ID, config.sellerTaxBranchID) +
      (config.vatRate ? encode(vat.VAT_RATE, config.vatRate) : '') +
      encode(vat.VAT_AMOUNT, config.vatAmount)
    )
  }

  payload += encode(
    tag.CRC,
    crc16xmodem(payload + tag.CRC + CRC_LENGTH, CRC_INITIAL)
      .toString(16)
      .padStart(4, '0')
      .toUpperCase()
  )

  return payload
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

module.exports = {
  generate,
  parse
}
