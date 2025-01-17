import { AccelerationMap } from '@talk2resume/common'

function asd(accelerationData: AccelerationMap) {
  // Define the data with missing values (use `null` for missing points)
  // Function to interpolate values
  function interpolateValue(time: number): number | null {
    for (let i = 0; i < accelerationData.length - 1; i++) {
      const p1 = accelerationData[i]
      const p2 = accelerationData[i + 1]

      if (p1.speed !== null && p2.speed !== null && time >= p1.time && time <= p2.time) {
        // Linear interpolation formula
        return (
          p1.speed +
          ((time - p1.time) * (p2.speed - p1.speed)) / (p2.time - p1.time)
        )
      }
    }
    return null
  }

  // Convert data to SVG path
  function generateSVGPath(data: { time: number; speed: number }[], width: number, height: number): string {
    const maxTime = Math.max(...data.map((d) => d.time))
    const maxSpeed = Math.max(...data.map((d) => d.speed))

    const scaleX = width / maxTime
    const scaleY = height / maxSpeed

    let path = `M ${data[0].time * scaleX},${height - data[0].speed * scaleY}`
    for (let i = 1; i < data.length; i++) {
      const x = data[i].time * scaleX
      const y = height - data[i].speed * scaleY
      path += ` L ${x},${y}`
    }
    return path
  }

  // Generate dense interpolated data
  function generateInterpolatedData(step: number): { time: number; speed: number }[] {
    const interpolatedData: { time: number; speed: number }[] = []
    const start = accelerationData[0].time
    const end = accelerationData[accelerationData.length - 1].time

    for (let time = start; time <= end; time += step) {
      const speed = interpolateValue(time)
      if (speed !== null) {
        interpolatedData.push({ time, speed })
      }
    }
    return interpolatedData
  }
  function generateSmoothSVGPath(
    data: { time: number; speed: number }[],
    width: number,
    height: number
  ): string {
    const maxTime = Math.max(...data.map((d) => d.time))
    const maxSpeed = Math.max(...data.map((d) => d.speed))

    const scaleX = width / maxTime
    const scaleY = height / maxSpeed

    let path = `M ${data[0].time * scaleX},${height - data[0].speed * scaleY}` // Start at the first point

    for (let i = 0; i < data.length - 1; i++) {
      const p0 = data[i]
      const p1 = data[i + 1]

      const x0 = p0.time * scaleX
      const y0 = height - p0.speed * scaleY
      const x1 = p1.time * scaleX
      const y1 = height - p1.speed * scaleY

      // Calculate control points for smooth curves
      const cp1x = x0 + (x1 - x0) / 3 // Control point 1 (1/3 towards the next point)
      const cp1y = y0
      const cp2x = x1 - (x1 - x0) / 3 // Control point 2 (1/3 towards the previous point)
      const cp2y = y1

      // Add cubic Bézier curve to the path
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x1},${y1}`
    }

    return path
  }
  // Generate and export SVG
  function exportSVG() {

    const interpolatedData = generateInterpolatedData(1) // Step of 0.1 seconds  const maxTime = Math.max(...data.map((d) => d.time))

    const width = 600
    const height = 400
    // const pathData = generateSVGPath(interpolatedData, width, height)
    const pathData = generateSmoothSVGPath(interpolatedData, width, height)

    const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <path d="${pathData}" fill="none" stroke="blue" stroke-width="3" />
  </svg>
`

    // Create a downloadable file
    const blob = new Blob([svgContent], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "acceleration_curve.svg"
    a.click()
    URL.revokeObjectURL(url)
  }

  return exportSVG
}