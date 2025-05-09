import { toAscii } from 'idna-uts46'

export const validateAndNormalizeDomain = (value, options) => {
  var removeTrailingDot = Object.keys(options || {}).includes('removeTrailingDot') ? options['removeTrailingDot'] : false
  var result = value
  // https://datatracker.ietf.org/doc/html/rfc3490#section-3.1
  if (['\u{002E}', '\u{3002}', '\u{FF0E}', '\u{FF61}'].includes(result.slice(-1))) {
    if (removeTrailingDot) result = result.slice(0, -1)
    else return { result: `"${value}" ends in a dot`, isError: true }
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

// Only pass normalized domains to this function
export const getDomainRelation = (domain1, domain2) => {
  domain1 = domain1.split('.').reverse()
  domain2 = domain2.split('.').reverse()
  var swapped = false
  if (domain1.length > domain2.length) {
    swapped = true;
    ([domain1, domain2] = [domain2, domain1])
  }
  for (var i = domain1.length - 1; i >= 0; --i) {
    if (domain1[i] !== domain2[i]) return '<>'
  }
  return domain1.length === domain2.length ? '==' : swapped ? '>' : '<'
}
