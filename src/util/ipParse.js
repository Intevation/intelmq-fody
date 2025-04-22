const ipaddr = require('ipaddr.js')

export const validateAndNormalizeCIDROrIP = (value, options) => {
  var enforceZero = Object.keys(options || {}).includes('noTrailingZeroWithoutNetmask') ? options['noTrailingZeroWithoutNetmask'] : false
  var addr = value
  var netmask = null
  var offset = value.indexOf('/')
  if (offset !== -1) {
    addr = value.substring(0, offset)
    netmask = value.substring(offset + 1)
    if (!/^(?:0|[1-9][0-9]*)$/.test(netmask)) {
      return {result: `"${value}" has invalid netmask "${netmask}"`, isError: true}
    }
    netmask = +netmask
  }
  try {
    var parsed = ipaddr.parse(addr)
  } catch (e) {
    return {result: `"${addr}" cannot be parsed as IP address`, isError: true}
  }
  var ipv4 = parsed.kind() === 'ipv4' // else 'ipv6'
  if (ipv4 && !/^(?:(?:0|[1-9][0-9]*)\.){3}(?:0|[1-9][0-9]*)$/.test(addr)) {
    return {result: `"${addr}" cannot be parsed as IP address`, isError: true}
  }
  var byteArray = parsed.toByteArray()
  if (netmask === null) {
    if (ipv4) {
      if (enforceZero && byteArray[3] === 0) {
        return {result: `"${value}" looks like a network (ends in .0) but has no netmask`, isError: true}
      }
      netmask = 32
    } else { // ipv6
      if (enforceZero && byteArray[15] === 0 && byteArray[14] === 0) {
        return {result: `"${value}" looks like a network (ends in :0) but has no netmask`, isError: true}
      }
      netmask = 128
    }
  } else {
    if (netmask > (ipv4 ? 32 : 128)) {
      return {result: `"${value}": netmask too large`, isError: true}
    }
    var minNetmask = 0
    for (var i = byteArray.length * 8 - 1; i >= 0; --i) {
      if (byteArray[i >> 3] & 1 << 7 - i % 8) {
        minNetmask = i + 1
        break
      }
    }
    if (netmask < minNetmask) {
      return {result: `"${value}" has host bits set (did you mean "${parsed.toString()}/${minNetmask}"?)`, isError: true}
    }
  }
  return {result: `${parsed.toString()}/${netmask}`, isError: false}
}
