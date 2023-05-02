import { Component, OnInit } from '@angular/core';
import { Day } from '../../models/day';
import { CreateCalendarService } from '../../services/create-calendar/create-calendar.service';
import { CalendarThreeMonth } from '../../models/calendar-three-month';
import { MonthsConstants } from '../../constants/months';

@Component({
  selector: 'ui-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private _calendar: CalendarThreeMonth;
  private _today = new Date();
  private _iMonthLimit = 6;

  monthActive = this._today.getMonth();
  yearActive = this._today.getFullYear();

  page: Day[] = [];

  get verifyWeekMore() {
    return this.page.length === 42;
  }

  get nameMonthActive(): string {
    const month = MonthsConstants.find(month => month.number === this.monthActive);
    return month ? month.name : '';
  }

  get currentYear() {
    return this._today.getFullYear();
  }

  get currentMonth() {
    return this._today.getMonth();
  }

  get currentDay() {
    return this._today.getDate();
  }

  constructor(
    private createCalendarService: CreateCalendarService
  ) {
    this._calendar = this.createCalendarService.getCalendarThreeMonths(this.currentMonth, this.currentYear);
  }

  ngOnInit(): void {
    this._createPage();
  }

  private _completeMonthWithPrevDays(calendar: CalendarThreeMonth): Day[] {
    const positionFinal = calendar.currentMonth.dayOfWeekInitial;
    const positionInitial = calendar.previousMonth.numberOfDays - positionFinal;
    return this._createDays(positionInitial, positionFinal, calendar.previousMonth.month, calendar.previousMonth.year);
  }

  private _completeMonthWithNextDays(calendar: CalendarThreeMonth): Day[] {
    const positionFinal = 7 - calendar.nextMonth.dayOfWeekInitial;
    const positionInitial = 0;
    return this._createDays(positionInitial, positionFinal, calendar.nextMonth.month, calendar.nextMonth.year);
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
    console.log(this._calendar);

    this.page = [
      ...this._completeMonthWithPrevDays(this._calendar),
      ...this._createDays(0, this._calendar.currentMonth.numberOfDays, this._calendar.currentMonth.month, this._calendar.currentMonth.year),
      ...this._completeMonthWithNextDays(this._calendar)
    ];
  }

  public otherMonth(previous: boolean = false) {
    const prev = this._calendar.previousMonth;
    const current = this._calendar.currentMonth;
    const next = this._calendar.nextMonth;
    const other = this._calendar.othersMonth ? this._calendar.othersMonth : [];

    const base = previous ? prev : next;
    const monthYear = this.createCalendarService.getOtherMonthYear(base.month, base.year, previous);

    // Make sure the month is loaded
    const isLoad = other.find(item => item.month === monthYear.month && item.year === monthYear.year);

    // If so, remove of other months array
    if (isLoad) {
      const indexLoad = other.indexOf(isLoad);
      other.splice(indexLoad, 1);
    }

    if (other.length + 1 > this._iMonthLimit) {
      previous ? other.shift() : other.pop();
    }

    // Add month and reorder
    other.push(previous ? next : prev);
    other.sort((a, b) => a.year == b.year ? (a.month <= b.month ? 1 : -1) : (a.year < b.year ? 1 : -1));


    const newBase = isLoad ? isLoad : this.createCalendarService.getCalendarOtherMonth(base.dayOfWeekInitial, base.numberOfDays, base.month, base.year, previous);

    this.monthActive = base.month;
    this.yearActive = base.year;

    this._calendar = previous ? {
      currentMonth: base,
      previousMonth: newBase,
      nextMonth: current,
      othersMonth: other
    } : {
      currentMonth: base,
      previousMonth: current,
      nextMonth: newBase,
      othersMonth: other
    }

    this._createPage(); 

  }

  public classByDay(day: Day): string {
    const current = day.number === this.currentDay && day.month === this.currentMonth && day.year === this.currentYear ? 'current' : '';
    const other_month = day.month !== this.monthActive ? 'other-month' : '';

    return current + ' ' + other_month;
  }
}
