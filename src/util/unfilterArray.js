// Given two arrays a and b and a function f
// - if a.filter(f).length !== b.length, then return b.
// Otherwise, a has as many f-accepted elements as b has elements. In that
// case, return an array of length a.length that has a's f-rejected elements at
// the same indices as a and b's elements at the other positions in the same
// order as in b. I.e., if b has no f-rejected elements, then removing all f-
// rejected elements from the returned array will result in b.
export const unfilterArray = (oldUnfiltered, newFiltered, filterFn) => {
  var unfilteredCount = oldUnfiltered.length
  var filteredCount = newFiltered.length
  if (filteredCount >= unfilteredCount) {
    return newFiltered
  }
  var newUnfiltered = Array.from(oldUnfiltered)
  var unfilteredIndex = 0
  var filteredIndex = 0
  while (true) {
    if (unfilteredIndex >= unfilteredCount) {
      return filteredIndex >= filteredCount ? newUnfiltered : newFiltered
    }
    if (filteredIndex >= filteredCount) {
      return !oldUnfiltered.slice(unfilteredIndex).some(filterFn) ? newUnfiltered : newFiltered
    }
    if (filterFn(oldUnfiltered[unfilteredIndex])) {
      newUnfiltered[unfilteredIndex++] = newFiltered[filteredIndex++]
    } else {
      unfilteredIndex++
    }
  }
}

export const mapFilteredIndices = (unfiltered, filterFn, indexMapFn) => {
  var unfilteredCount = unfiltered.length
  var arr = new Array(unfilteredCount)
  var filteredIndex = 0
  for (var unfilteredIndex = 0; unfilteredIndex < unfilteredCount; ++unfilteredIndex) {
    arr[unfilteredIndex] = filterFn(unfiltered[unfilteredIndex]) ? indexMapFn(filteredIndex++) : null
  }
  return arr
}
