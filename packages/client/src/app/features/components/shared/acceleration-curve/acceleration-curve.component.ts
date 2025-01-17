import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core'
import { isTruthy, newUUID } from '@talk2resume/common'
import { IDefferedActivationCapable } from '@talk2resume/types'
import { Chart } from 'chart.js'
import { BehaviorSubject } from 'rxjs'
import { AccelerationProfileGraphService } from './acceleration-profile-graph.service'

@Component({
  selector: 'app-acceleration-curve',
  standalone: false,
  templateUrl: './acceleration-curve.component.html',
  styleUrl: './acceleration-curve.component.scss'
})
export class AccelerationCurveComponent implements OnInit, AfterViewInit, IDefferedActivationCapable {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef

  isChartActive$ = new BehaviorSubject<boolean>(false)
  chart!: Chart
  uuid: string = newUUID()
  @Input() deferRender = false

  constructor(
    private graphService: AccelerationProfileGraphService,
    private cdr: ChangeDetectorRef
  ) {
    this.isChartActive$
      .pipe(isTruthy())
      .subscribe(() => {
        if (!this.chart) {
          this.chart = this.createChart()
        }
      })
  }
  ngOnInit(): void { }
  ngAfterViewInit(): void {
    this.isChartActive$.next(!this.deferRender)
  }

  createChart() {
   return  this.graphService.createAccelerationProfileChart(this.uuid)
  }

  activate() {
    this.isChartActive$.next(true)
  }

  @HostListener('window:resize', [])
  onResize() {
    if (this.chart) {
      this.chart.resize()
    }
  }

  @HostListener('document:visibilitychange', [])
  onVisibilityChange() {
    if (!document.hidden && this.chart) {
      this.chart.render()
      this.chart.resize()
    }
  }
}
