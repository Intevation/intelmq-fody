import { toAscii } from 'idna-uts46'

export const validateAndNormalizeDomain = (value, options) => {
  var removeTrailingDot = Object.keys(options || {}).includes('removeTrailingDot') ? options['removeTrailingDot'] : false
  var result = value
  if (removeTrailingDot) {
    // https://datatracker.ietf.org/doc/html/rfc3490#section-3.1
    if (['\u{002E}', '\u{3002}', '\u{FF0E}', '\u{FF61}'].includes(result.slice(-1))) {
      result = result.slice(0, -1)
    }
  }
  try {
    result = toAscii(result, {transitional: false, useStd3ASCII: true, verifyDnsLength: true})
  } catch (e) {
    return { result: `"${value}" is invalid`, isError: true }
  }
  if (!result.includes('.')) {
    return { result: `"${value}" has less than two dot-separated labels`, isError: true }
  }
  return { result, isError: false }
}
