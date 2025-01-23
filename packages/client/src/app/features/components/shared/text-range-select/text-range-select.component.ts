import { Component, ElementRef, Injectable, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { completeSubject } from '@talk2resume/common'
import { distinctUntilChanged, interval, map, Subject, takeUntil } from 'rxjs'

export type SelectedRangeValue = [number, number]
// export type SelectedRange = { start: number, end: number }

@Component({
  selector: 'app-text-range-select',
  standalone: false,
  templateUrl: './text-range-select.component.html',
  styleUrl: './text-range-select.component.scss'
})
export class TextRangeSelectComponent implements OnInit, OnDestroy {
  @ViewChild('selectStart') selectStart!: ElementRef
  @ViewChild('selectEnd') selectEnd!: ElementRef
  rangeChangeDetector = (previous, next) => {
    const a = previous[this.RANGE_START] == next[this.RANGE_START]
    const b = previous[this.RANGE_END] == next[this.RANGE_END]
    return a && b
  }
  RANGE_START = 0
  RANGE_END = 1
  @Input() text: string = ''
  safeHtml!: SafeHtml
  snapStart = 0
  snapEnd = 0
  minPosition!: number
  maxPosition!: number
  range: SelectedRangeValue = [0, 0]
  snappedRange: SelectedRangeValue = [0, 0]
  destroy$ = new Subject<void>()

  constructor(
    private sanitizer: DomSanitizer,
    public util: TextRangeUtility
  ) { }

  getSnapStart() {
    const { firstWord } = this.util.getTextInRangeAsData(this.text, this.snappedRange)
    return firstWord
  }

  getSnapEnd() {
    const { lastWord } = this.util.getTextInRangeAsData(this.text, this.snappedRange)
    return lastWord
  }

  ngOnDestroy(): void {
    completeSubject(this.destroy$)
  }

  characterUnderCursor(index: string) { return this.text[+index] }

  ngOnInit(): void {
    this.text = this.util.sanitizeString(
      'This is an example text to demonstrate draggable text range selection.This is an example text to demonstrate draggable text range selection.This is an example text to demonstrate draggable text range selection.This is an example text to demonstrate draggable text range selection.This is an example text to demonstrate draggable text range selection.This is an example text to demonstrate draggable text range selection.'
    )

    this.minPosition = 0
    this.maxPosition = this.text.length
    this.range = [this.minPosition, this.maxPosition]

    interval(50)
      .pipe(
        takeUntil(this.destroy$),
        map(() => [
          this.selectStart.nativeElement,
          this.selectEnd.nativeElement,
        ].map(x => x.value) as SelectedRangeValue),
        map(([start, end]) => [Math.min(start, end), Math.max(start, end),]),
        distinctUntilChanged(this.rangeChangeDetector),
        map((range) => this.util.SnapBoundaryToWords(this.text, range))
      )
      .subscribe((boundary) => {
        this.snappedRange = boundary
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
          this.createHighlightedTextElement(boundary)
        )
      })
  }

  createHighlightedTextElement(
    selectedRange: SelectedRangeValue
  ): string {
    const { before, selected, after } = this.util.getTextInRangeAsData(this.text, selectedRange)
    return `${before}<span class="highlight">${selected}</span>${after}`
  }

}


@Injectable({
  providedIn: "root"
})
export class TextRangeUtility {

  sanitizeString(source: string): string {
    let sanitizedSource = source.replace(/\.+/g, '. ')
    sanitizedSource = sanitizedSource.replace(/\s+/g, ' ')
    return sanitizedSource
  }

  getTextInRangeAsData(
    source: string,
    range: SelectedRangeValue
  ) {
    const [start, end] = this.SnapBoundaryToWords(source, range)

    const selectedText = source.substring(start, end)
    const { firstWord, lastWord } = this.getFirstAndLastSelectedWords(selectedText)



    return {
      firstWord, lastWord,
      before: source.substring(0, start),
      selected: source.substring(start, end),
      after: source.substring(end),
      range
    }
  }

  private getFirstAndLastSelectedWords(
    source: String
  ) {
    const result = { firstWord: '', lastWord: '' }
    if (source.length > 0) {
      let cursor = 0
      let char = ''
      let buffer = ''
      while ((char = source[cursor++]) !== ' ') {
        if (cursor == source.length) { break }
        result.firstWord += char
      }

      char = ''
      cursor = source.length - 1
      while ((char = source[cursor--]) !== ' ') {
        if (cursor == -1) { break }
        buffer += char
      }

      result.lastWord = Array.from(buffer).reverse().join('')
    }

    return result
  }

  SnapBoundaryToWords(
    source: string,
    [startIndex, endIndex]: SelectedRangeValue
  ): SelectedRangeValue {
    return [
      this.snapToWordBoundary(source, Math.min(startIndex, endIndex)),
      this.snapToWordBoundary(source, Math.max(startIndex, endIndex), false)
    ]
  }

  snapToWordBoundary(
    source: string,
    position: number,
    isStartOfWord = true
  ): number {
    while (!this.isWordDelimiter(source[position]) && position > 0 && position < source.length) {
      position = isStartOfWord ? position - 1 : position + 1
    }
    return this.moveCursorToNonWhitespaceCharacter(isStartOfWord, source, position)
  }

  private moveCursorToNonWhitespaceCharacter(
    isStartOfWord: boolean,
    source: string,
    position: number
  ) {
    if (isStartOfWord) {
      const character = source.substring(position, position + 1)
      if (this.isWordDelimiter(character))
        return position + 1
    } else {
      const character = source.substring(position, position - 1)
      if (this.isWordDelimiter(character))
        return position - 1
    }
    return position
  }

  getNearestWord(
    source: string,
    position: number
  ): string {
    const words = source.split(/\s+/)
    let currentIndex = 0
    for (let word of words) {
      // Note: +1 in the end of the range because when splitting the string,
      // the subsequent word starts one position later.
      const range = [currentIndex, currentIndex + word.length + 1]

      if (position >= range[0] && position <= range[1]) {
        return word
      }

      currentIndex += word.length + 1
    }

    return ''
  }

  isWordDelimiter(char: string): boolean {
    // return /\s|\./.test(char)
    return /\s/.test(char)
  }
  isWhitespace(char: string): boolean {
    return /\s/.test(char)
  }
}