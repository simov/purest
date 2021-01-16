
module.exports = ({options, methods}) => {

  Object.keys(methods).forEach((key) => {
    if (!options[key]) {
      var alias = methods[key].find((alias) => options[alias] !== undefined)
      if (alias) {
        options[key] = options[alias]
      }
    }
  })

  return options

}
