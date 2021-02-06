
module.exports = ({options, methods}) => {

  Object.keys(methods).forEach((key) => {
    if (!options[key]) {
      var alias = methods[key].find((alias) => Object.keys(options).includes(alias))
      if (alias) {
        options[key] = options[alias]
        delete options[alias]
      }
    }
  })

  return options

}
