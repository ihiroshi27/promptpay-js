/**
 * 
 * @param {string} tagID 
 * @param {string} value 
 * 
 */
function encode (tagID, value) {
  if (value.length > 99) throw new Error('Exceed maximum size of payload')
  return tagID + String(value.length).padStart(2, '0') + value
}

/**
 * 
 * @param {string} payload 
 * 
 */
function decode (payload) {
  const id = payload[0] + payload[1]
  const length = payload[2] + payload[3]
  const value = payload.substr(4, Number(length))
  const raw = id + length + value
  return { raw, id, value }
}

module.exports = {
  encode,
  decode
}