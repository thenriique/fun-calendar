import { Component, HostBinding, OnInit } from '@angular/core';
import { Day } from '../../models/day';

@Component({
  selector: 'ui-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  private _calendar = {
    previousMonth: {
      year: 2023,
      month: 3,
      dayOfWeekInitial: 6,
      numberOfDays: 30
    },
    currentMonth: {
      year: 2023,
      month: 4,
      dayOfWeekInitial: 1,
      numberOfDays: 31
    },
    nextMonth: {
      year: 2023,
      month: 5,
      dayOfWeekInitial: 4,
      numberOfDays: 30
    }
  }

  private _today = new Date();

  page: Day[] = [];

  get verifyWeekMore() {
    return this.page.length === 42;
  }

  get currentMonth() {
    return this._today.getMonth();
  }

  get currentDay() {
    return this._today.getDate();
  }

  constructor() {

  }

  ngOnInit(): void {
    this._createPage();
  }

  private _completeMonthWithPrevDays(): Day[] {
    const prevMonth = this._calendar.previousMonth;
    const prevDays = this._calendar.currentMonth.dayOfWeekInitial;
    return this._createDays(prevMonth.numberOfDays - prevDays, prevDays, prevMonth.month, prevMonth.year);
  }

  private _completeMonthWithNextDays(): Day[] {
    const nextMonth = this._calendar.nextMonth;
    const nextDays = (this._calendar.currentMonth.numberOfDays + this._calendar.currentMonth.dayOfWeekInitial) % 7;
    return this._createDays(0, 7 - nextDays, nextMonth.month, nextMonth.year);
  }

  private _createDays(numberDayInitial: number, numberOfDays: number, month: number, year: number): Day[] {
    let days: Day[] = [];
    for (let index = 0; index < numberOfDays; index++) {
      const day: Day = {
        number: numberDayInitial + index + 1,
        month: month,
        year: year
      }
      days.push(day);
    }
    return days;
  }

  private _createPage() {
    const currentMonth = this._calendar.currentMonth;
    this.page = [
      ...this._completeMonthWithPrevDays(),
      ...this._createDays(0, currentMonth.numberOfDays, currentMonth.month, currentMonth.year),
      ...this._completeMonthWithNextDays()
    ];
  }


}
