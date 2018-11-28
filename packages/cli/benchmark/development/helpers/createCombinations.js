import keymbinatorial from 'keymbinatorial'

export default function createCombinations (input) {
  const combinations = keymbinatorial(input);

  return combinations.map(combination => {
    Object.keys(combination).forEach(key => {
      switch (combination[key]) {
        case 'true':
          combination[key] = true
          break
        case 'false':
          combination[key] = false
          break
      }
    })

    return combination
  })
}

createCombinations.BOOL = ['true', 'false']
createCombinations.TRUE = ['true']
createCombinations.FALSE = ['false']