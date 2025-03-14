const isObject = o => o !== null && typeof o === 'object'

const tryParseAsJSON = bodyText => {
  var obj
  try {
    obj = JSON.parse(bodyText)
  } catch (e) {
    if (!(e instanceof SyntaxError)) {
      throw e
    }
    return bodyText.trim()
  }
  if (!isObject(obj)) {
    return bodyText.trim()
  }
  const keys = Object.keys(obj)
  if (keys.length === 0) {
    return null
  }
  if (keys.length === 1 && keys[0] === 'reason') {
    return obj['reason']
  }
  if (keys.length === 2 && keys.includes('reason') &&
                           keys.includes('details')) {
    return obj['reason'] + '\n' +
      (isObject(obj['details']) ? JSON.stringify : String)(obj['details'])
  }
  return bodyText.trim()
}

export const errorMixin = {
  methods: {
    setErrorMsg: function (response, targetVar) {
      // construct the error message for a failed $http.get() from response
      // place it in this.[targetVar]
      if (response.status === 0) {
        this[targetVar] = 'Failed to connect properly.'
      } else {
        response.text().then(bodyText => {
          bodyText = tryParseAsJSON(bodyText)
          this[targetVar] = 'Error ' + response.status +
            (bodyText ? ': ' + bodyText : '')
        })
      }
    }
  }
}
