export const errorMixin = {
  methods: {
    setErrorMsg: function (response, targetVar) {
      // construct the error message for a failed $http.get() from response
      // place it in this.[targetVar]
      if (response.status === 0) {
        this[targetVar] = 'Error: Failed to connect properly.'
      } else {
        response.text().then((bodyText) => {
          this[targetVar] = 'Error ' + response.status + ': ' + bodyText
        })
      }
    }
  }
}
