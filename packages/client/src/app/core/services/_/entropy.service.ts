import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntropyService {
  private previousNumbers: number[] = [];

  constructor() { }

  getRandomIndex<TVal>(datasource: Array<TVal>): number {
    return Math.floor(Math.random() * datasource.length);
  }
  geRandomValueFromSet<TVal>(datasource: Array<TVal>): TVal {
    return datasource[this.getRandomIndex(datasource)];
  }
  generateRandomNumber(min: number = 0, max: number = 1): number {
    let randomNumber;
    do {
      randomNumber = Math.random() * (max - min) + min;
    } while (this.previousNumbers.includes(randomNumber));

    this.previousNumbers.push(randomNumber);
    if (this.previousNumbers.length > 1000) {
      this.previousNumbers.shift();
    }

    return randomNumber;
  }

  generateTrueBasedOnPercentage(threshold: number, scale: number): boolean {
    if (threshold < 0 || threshold > scale) {
      throw new Error('Percentage must be between 0 and 100');
    }
    const randomValue = Math.random() * scale;
    return randomValue < threshold;
  }

  async rollActionAsync(
    threshold: number,
    scale: number,
    onPass: () => Promise<any>,
    onFail?: () => Promise<any>
  ) {
    const shouldPass = this.generateTrueBasedOnPercentage(threshold, scale);
    const action = shouldPass ? onPass : onFail;
    if (!action) return
    await action();
  }

  async rollAction(
    chance: number,
    chance2: number,
    onPass: () => any,
    onFail?: () => any
  ) {
    const shouldPass = this.generateTrueBasedOnPercentage(chance, chance2);
    const action = shouldPass ? onPass : onFail;
    if (!action) return
    action();
  }

}
