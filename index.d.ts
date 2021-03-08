declare function generate (
  config: {
    method: 'QR_STATIC' | 'QR_DYNAMIC' | 'BLE_STATIC' | 'BLE_DYNAMIC' | 'NFC_STATIC' | 'NFC_DYNAMIC',
    application: 'PROMPTPAY_CREDIT_TRANSFER' | 'PROMPTPAY_CREDIT_TRANSFER_WITH_OTA' | 'PROMPTPAY_BILL_PAYMENT' | 'PROMPTPAY_BILL_PAYMENT_CROSS_BORDER',
    mobileNumber?: string,
    nationalID?: string,
    taxID?: string,
    eWalletID?: string,
    bankAccount?: string,
    ota?: string,
    billerID?: string,
    reference1?: string,
    reference2?: string
    mcc?: string,
    currencyCode: string,
    amount?: string,
    tip?: string,
    countryCode: string,
    merchantName?: string,
    merchantCity?: string,
    postalCode?: string,
    additional?: {
      billNumber?: string,
      mobileNumber?: string,
      storeID?: string,
      loyaltyNumber?: string,
      referenceID?: string,
      customerID?: string,
      terminalID?: string,
      purposeOfTransaction?: string,
      additionalCustomerData?: string
    },
    merchantInformation?: string,
    sellerTaxBranchID?: string,
    vatRate?: string,
    vatAmount?: string
  }
): string

declare function parse (
  payload: string,
  tagType?: 'PROMPTPAY_CREDIT_TRANSFER' | 'PROMPTPAY_BILL_PAYMENT' | 'ADDITIONAL_DATA_FIELD'
): { [key: string]: { key: string, value: any } }

export default {
  generate,
  parse
}
