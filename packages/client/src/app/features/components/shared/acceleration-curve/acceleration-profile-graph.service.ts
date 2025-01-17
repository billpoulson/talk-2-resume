import { Injectable } from '@angular/core'
import { ShipStats } from '@talk2resume/types'
import { Chart, ChartConfiguration, ChartData } from 'chart.js'
export const CHART_COLORS = {
  RED: '#F93827',
  GREEN: '#16C47F',
  BLUE: '#8B5DFF',
}
export type ShipStatsGraphData = {
  maxSpeed: number
  datapoints: (number | null)[]
  labels: string[]
}


@Injectable({ providedIn: "any" })
export class AccelerationProfileGraphService {

  private createMockShipStats(): ShipStats {
    return {
      shipType: 'Arcadian Vx Class',
      maxSpeed: 100,
      accelerationData: [
        { time: 0, speed: 0 },
        { time: 10, speed: 10 },
        { time: 20, speed: 30 },
        { time: 30, speed: 50 },
        { time: 50, speed: 70 },
        { time: 60, speed: 100 },
      ]
    }
  }

  private createViewData(
    ship: ShipStats
  ): ShipStats & ShipStatsGraphData {
    const populateIndex = (_, k) => {
      const existingValue = ship.accelerationData
        .find(({ time }) => time === k)?.speed
      if (existingValue === undefined)
        return null
      return existingValue
    }
    const maxSpeed = ship.maxSpeed
    const totalSeconds = Math.max(...ship.accelerationData.map(({ time }) => time)) + 1
    const datapoints = Array.from({ length: totalSeconds }, populateIndex)
    const labels = Array.from({ length: totalSeconds }, (_, k) => k.toString())

    return {
      ...ship,
      maxSpeed,
      datapoints,
      labels
    }
  }

  private createChartConfig({
    maxSpeed,
    datapoints,
    labels,
    shipType
  }: ShipStats & ShipStatsGraphData) {

    const data: ChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Acceleration',
          data: datapoints,
          borderColor: CHART_COLORS.RED,
          spanGaps: true,
          fill: false,
          cubicInterpolationMode: 'monotone',
          tension: 0.5
        },
      ],
    }
    const config: ChartConfiguration = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            align: 'start',
            text: `${shipType} | Acceleration Profile`
          },
        },
        interaction: {
          mode: "nearest",
          intersect: true, // Allows hovering over the line itself
        },
        scales: {
          x: {
            display: true,
            title: {
              text: 'Time (sec)',
              display: true,
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Speed'
            },
            suggestedMin: 0,
            suggestedMax: maxSpeed + 10
          }
        }
      },
    }

    return config
  }

  createAccelerationProfileChart(
    uuid: string
  ) {
    const viewData = this.createViewData(this.createMockShipStats())
    const config = this.createChartConfig(viewData)

    return this.processUpdate(new Chart(uuid, config))
  }

  processUpdate(c: Chart) {
    return c

    // interval(2000)
    //   .pipe(
    //     tap(_ => {
    //       let assss = this.chart.data.datasets[0].data.length - 1
    //       let jjjss = generateInterpolatedData(assss, accelerationData)

    //       const ffs = this.chart.data.datasets[1].data[assss]
    //       const jj2 = ffs || jjjss
    //       if (this.chart.data.datasets[1].data.length < assss) {
    //         assss = 0
    //         this.chart.data.datasets[0].data = []
    //       }
    //       const jj = this.chart.data.datasets[0].data.map(v => NaN)
    //       jj.push(jj2)
    //       // this.chart.data.labels.pop() // Remove the last time label
    //       // this.chart.data.datasets[0].data.pop() // Remove the last data point
    //       this.chart.data.datasets[0].data = jj

    //       this.chart.update() // Update chart
    //     })
    //   ).subscribe()

  }
}
