
export const isInRange = (lowLimit: number, highLimit: number, testValue: number):
  boolean => testValue >= lowLimit && testValue <= highLimit


  
export function getInterpolatedValue(
  time: number,
  accelerationMap: Array<{ time: number, speed: number | null }>
): number {
  for (let i = 0; i < accelerationMap.length - 1; i++) {
    const p1 = accelerationMap[i]
    const p2 = accelerationMap[i + 1]

    // Only process entries where speed is not null
    if (p1.speed !== null && p2.speed !== null) {
      if (time >= p1.time && time <= p2.time) {
        // Linear interpolation formula
        return p1.speed + ((time - p1.time) * (p2.speed - p1.speed)) / (p2.time - p1.time)
      }
    }
  }
  // Handle cases where speed is null for interpolation boundaries
  const firstValidSpeed = accelerationMap.find(p => p.speed !== null)?.speed
  const lastValidSpeed = [...accelerationMap].reverse().find(p => p.speed !== null)?.speed

  // If the time is out of bounds, return the closest non-null value
  if (time < accelerationMap[0].time) return firstValidSpeed ?? 0
  if (time > accelerationMap[accelerationMap.length - 1].time) return lastValidSpeed ?? 0

  return 0
}