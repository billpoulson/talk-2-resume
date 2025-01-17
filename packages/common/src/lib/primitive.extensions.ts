export const unixTimestamp = () => ({ timestamp: +new Date() })
export const emptyString = ''
export const trimWhitespace = (value: string) => value.trim()
export const hasContent = ({ length }) => length > 0
export const calculatePercent = (progress: number, total: number): number => {
  return Math.min(Math.max(Math.floor((progress / total) * 100), 0), 100)
}
