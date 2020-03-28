const errors = {
  '-61' : {
    status: 500,
    validate: [{
      rule: 'database_connect',
      field: null,
      message: 'error:database_connect',
    }],
  },
  '23505' : {
    status: 422,
    validate: [{
      rule: 'registry_unique',
      field: null,
      message: 'error:registry_unique',
    }],
  },
}

const getError = (error, lang) => {
  if(!errors[error]) {
    return false
  }

  let _error = errors[error]
  _error.validate[0].message = lang.t(_error.validate[0].message)

  return _error
}
export default getError
