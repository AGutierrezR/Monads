const Either = require('../src/either')

// CON EITHER MONAD
function parseJSON(json) {
  return Either.attempt(() => JSON.parse(json))
}

const eitherData = parseJSON('{"name": "John"}')
  .flatMap((person) => Either.attempt(() => person.name.testing.first))
  .flatMap((name) => Either.attempt(() => name.toUpperCase))
  .fold(
    (e) => console.log({ e: e.message }),
    (v) => v
  )

console.log(eitherData)

// SIN EITHER MONAD
let eitherData2
try {
  const person = JSON.parse('{"name": "John"}')
  const name = person.name.first
  eitherData2 = name.toUpperCase()
} catch (e) {
  console.log({ e: e.message })
}

console.log(eitherData2)
