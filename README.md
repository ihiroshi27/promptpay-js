# PromptPay
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

PromptPay Generator and Parser for Node.js

## Install
```
$ npm install promptpay-js
```

## Method
### Generate
| Name                              | Type   | Length | Required    | Description                                                                                                                                                                                                                                                                                                                                   |
|-----------------------------------|--------|--------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| method                            | Enum   |        | Required    | - QR_STATIC<br>- QR_DYNAMIC<br>- BLE_STATIC<br>- BLE_DYNAMIC<br>- NFC_STATIC<br>- NFC_DYNAMIC                                                                                                                                                                                                                                                 |
| application                       | Enum   |        | Required    | - PROMPTPAY_CREDIT_TRANSFER<br>- PROMPTPAY_CREDIT_TRANSFER_WITH_OTA<br>- PROMPTPAY_BILL_PAYMENT<br>- PROMPTPAY_BILL_PAYMENT_CROSS_BORDER                                                                                                                                                                                                      |
| mobileNumber                      | String | 13     | Conditioned | For application<br>- PROMPTPAY_CREDIT_TRANSFER<br>- PROMPTPAY_CREDIT_TRANSFER_WITH_OTA                                                                                                                                                                                                                                                        |
| nationalID                        | String | 13     | Conditioned | For QR_DYMANIC method only.<br><br>For application<br>- PROMPTPAY_CREDIT_TRANSFER<br>- PROMPTPAY_CREDIT_TRANSFER_WITH_OTA                                                                                                                                                                                                                     |
| taxID                             | String | 13     | Conditioned | For application<br>- PROMPTPAY_CREDIT_TRANSFER<br>- PROMPTPAY_CREDIT_TRANSFER_WITH_OTA                                                                                                                                                                                                                                                        |
| eWalletID                         | String | 15     | Conditioned | For application<br>- PROMPTPAY_CREDIT_TRANSFER<br>- PROMPTPAY_CREDIT_TRANSFER_WITH_OTA                                                                                                                                                                                                                                                        |
| bankAccount                       | String | 1 - 43 | Conditioned | Bank code (3 digits) + account no.<br><br>For application<br>- PROMPTPAY_CREDIT_TRANSFER<br>- PROMPTPAY_CREDIT_TRANSFER_WITH_OTA                                                                                                                                                                                                              |
| ota                               | String | 10     | Conditioned | For PROMPTPAY_CREDIT_TRANSFER_WITH_OTA application only.                                                                                                                                                                                                                                                                                      |
| billerID                          | String | 15     | Conditioned | National ID/Tax ID + Suffix<br><br>For application<br>- PROMPTPAY_BILL_PAYMENT<br>- PROMPTPAY_BILL_PAYMENT_CROSS_BORDER                                                                                                                                                                                                                       |
| reference1                        | String | 1 - 20 | Conditioned | For application<br>- PROMPTPAY_BILL_PAYMENT<br>- PROMPTPAY_BILL_PAYMENT_CROSS_BORDER                                                                                                                                                                                                                                                          |
| reference2                        | String | 1 - 20 | Optional    | For application<br>- PROMPTPAY_BILL_PAYMENT<br>- PROMPTPAY_BILL_PAYMENT_CROSS_BORDER                                                                                                                                                                                                                                                          |
| mcc                               | String | 4      | Optional    | As defined by ISO 8583:1993 for Card Acceptor Business Code (MCC).                                                                                                                                                                                                                                                                            |
| currencyCode                      | String | 3      | Required    | 764 for Thai Baht (ISO 4217).                                                                                                                                                                                                                                                                                                                 |
| amount                            | String | 1 - 13 | Optional    | This amount is expressed as to how the value appears,<br>amount "100.00" is defined as "100.00", or <br>amount "99.85" is defined as "99.85", or <br>amount "99.333" is defined as "99.333"<br>amount "99.3456" is defined as "99.3456"                                                                                                       |
| tip                               | String | 1 - 13 | Optional    | The convenience fee of a fixed amount should be specified here.<br>This amount is expressed as to how the value appears,<br>amount "100.00" is defined as "100.00", or<br>amount "99.85" is defined as "99.85", or<br>amount "99.333" is defined as "99.333"<br>amount "99.3456" is defined as "99.3456"<br><br>Note: 0 is not a valid value. |
| countryCode                       | String | 2      | Required    | TH for Thailand (ISO 3166-1 alpha-2).                                                                                                                                                                                                                                                                                                         |
| merchantName                      | String | 1 - 25 | Optional    |                                                                                                                                                                                                                                                                                                                                               |
| merchantCity                      | String | 1 - 15 | Optional    |                                                                                                                                                                                                                                                                                                                                               |
| postalCode                        | String | 1 - 10 | Optional    | Zipcode or Pin code or Postal code of the merchant.                                                                                                                                                                                                                                                                                           |
| additional                        | Object |        | Optional    | Additional information may be required in certain cases.<br>This information may be either presented by the merchant or acquirer<br>or the Consumer may be prompted for entry on the app.                                                                                                                                                     |
| additional.billNumber             | String | 1 - 26 | Optional    | Invoice number or bill number.                                                                                                                                                                                                                                                                                                                |
| additional.mobileNumber           | String | 1 - 26 | Optional    | To be used for top-up or bill payment.                                                                                                                                                                                                                                                                                                        |
| additional.storeID                | String | 1 - 26 | Optional    | A distinctive number associated to the store.                                                                                                                                                                                                                                                                                                 |
| additional.loyaltyNumber          | String | 1 - 26 | Optional    | As defined by store or airline.                                                                                                                                                                                                                                                                                                               |
| additional.referenceID            | String | 1 - 26 | Optional    | As defined by merchant or acquirer.                                                                                                                                                                                                                                                                                                           |
| additional.customerID             | String | 1 - 26 | Optional    | Typically a subscriber ID for subscription services or student.                                                                                                                                                                                                                                                                               |
| additional.terminalID             | String | 1 - 26 | Optional    | A distinctive number associated with the terminal in the store.<br><br>For application<br>- PROMPTPAY_BILL_PAYMENT<br>- PROMPTPAY_BILL_PAYMENT_CROSS_BORDER                                                                                                                                                                                   |
| additional.purposeOfTransaction   | String | 1 - 26 | Optional    | For application<br>- PROMPTPAY_BILL_PAYMENT<br>- PROMPTPAY_BILL_PAYMENT_CROSS_BORDER<br><br>Currency Code (3 digits) +<br>Local Amount (13 digits) +<br>Country Code (2 digits)                                                                                                                                                               |
| additional.additionalCustomerData | String | 1 - 3  | Optional    |                                                                                                                                                                                                                                                                                                                                               |
| merchantInformation               | String | 1 - 99 | Optional    |                                                                                                                                                                                                                                                                                                                                               |
| sellerTaxBranchID                 | String | 4      | Optional    | VAT TQRC                                                                                                                                                                                                                                                                                                                                      |
| vatRate                           | String | 1 - 5  | Optional    |                                                                                                                                                                                                                                                                                                                                               |
| vatAmount                         | String | 1 - 13 | Conditioned |                                                                                                                                                                                                                                                                                                                                               |

### Parse
| Name    | Type   | Required | Description                                                                        |
|---------|--------|----------|------------------------------------------------------------------------------------|
| payload | String | Required |                                                                                    |
| tagType | Enum   | Optional | - PROMPTPAY_CREDIT_TRANSFER<br>- PROMPTPAY_BILL_PAYMENT<br>- ADDITIONAL_DATA_FIELD |

## Usage
### Generate
```js
const promptpay = require('promptpay-js')

const payload = promptpay.generate({
  method: 'QR_STATIC',
  application: 'PROMPTPAY_CREDIT_TRANSFER',
  mobileNumber: '0066XXXXXXXXX',
  currencyCode: '764',
  countryCode: 'TH'
})

console.log(payload)
```

```
00020101021129370016A00000067701011101130066XXXXXXXXX53037645802TH6304D37F
```
### Parse
```js
const promptpay = require('promptpay-js')

const payload = '00020101021129370016A00000067701011101130066XXXXXXXXX53037645802TH6304D37F'
const data = promptpay.parse(payload)

console.log(data)
```

```json
{
  "00": { "key": "PAYLOAD_FORMAT_INDICATOR", "value": "01" },
  "01": { "key": "POINT_OF_INITIATION_METHOD", "value": "11" },
  "29": {
    "key": "PROMPTPAY_CREDIT_TRANSFER",
    "value": {
      "00": { "key": "AID", "value": "A000000677010111" },
      "01": { "key": "MOBILE_NUMBER", "value": "0066XXXXXXXXX" }
    }
  },
  "53": { "key": "CURRENCY_CODE", "value": "764" },
  "58": { "key": "COUNTRY_CODE", "value": "TH" },
  "63": { "key": "CRC", "value": "D37F" }
}
```


## License
[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/promptpay-js.svg
[npm-url]: https://npmjs.org/package/promptpay-js
[npm-downloads-image]: https://img.shields.io/npm/dm/promptpay-js.svg
[npm-downloads-url]: https://npmcharts.com/compare/promptpay-js?minimal=true
