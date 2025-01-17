export const getRandomInclusive = (min, max): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is inclusive and the minimum is inclusive
}
