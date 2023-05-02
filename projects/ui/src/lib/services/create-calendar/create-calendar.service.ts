import { Injectable } from '@angular/core';
import { MonthsConstants } from '../../constants/months';
import { CalendarThreeMonth } from '../../models/calendar-three-month';
import { MonthAttr } from '../../models/month-attr';

@Injectable({
  providedIn: 'root'
})
export class CreateCalendarService {

  constructor() { }

  getCalendarThreeMonths(month: number, year: number): CalendarThreeMonth {
    const dayOfWeekInitial = this._getDayOfWeekInitialMonth(month, year);
    const numberOfDays = this._getNumberOfDaysForMonth(month, year);

    const prevMonthYear = this.getOtherMonthYear(month, year, true);
    const prevNumberOfDays = this._getNumberOfDaysForMonth(prevMonthYear.month, prevMonthYear.year);
    const nextMonthYear = this.getOtherMonthYear(month, year);
    const nextNumberOfDays = this._getNumberOfDaysForMonth(nextMonthYear.month, nextMonthYear.year);

    const calendar: CalendarThreeMonth = {
      previousMonth: {
        year: prevMonthYear.year,
        month: prevMonthYear.month,
        numberOfDays: prevNumberOfDays,
        dayOfWeekInitial: this._getDayOfWeekByNumberOfDays(dayOfWeekInitial, prevNumberOfDays, true)
      },
      currentMonth: {
        year: year,
        month: month,
        numberOfDays: numberOfDays,
        dayOfWeekInitial: dayOfWeekInitial
      },
      nextMonth: {
        year: nextMonthYear.year,
        month: nextMonthYear.month,
        numberOfDays: nextNumberOfDays,
        dayOfWeekInitial: this._getDayOfWeekByNumberOfDays(dayOfWeekInitial, numberOfDays)
      }
    }

    return calendar;
  }

  public getCalendarOtherMonth(dayOfWeekInitial: number, numberOfDaysInitial: number, monthInitial: number, yearInitial: number, previous: boolean = false): MonthAttr {
    const monthYear = this.getOtherMonthYear(monthInitial, yearInitial, previous);
    const numberOfDays = this._getNumberOfDaysForMonth(monthYear.month, monthYear.year);

    return {
      year: monthYear.year,
      month: monthYear.month,
      numberOfDays: numberOfDays,
      dayOfWeekInitial: this._getDayOfWeekByNumberOfDays(dayOfWeekInitial, previous ? numberOfDays : numberOfDaysInitial, previous)
    }
  }

  public getOtherMonthYear(monthInitial: number, yearInitial: number, previous: boolean = false): { previous: boolean, month: number, year: number } {
    const otherMonth = previous ? (monthInitial > 0 ? monthInitial - 1 : 11) : (monthInitial < 11 ? monthInitial + 1 : 0);
    const otherYear = previous ? (monthInitial > 0 ? yearInitial : yearInitial - 1) : (monthInitial < 11 ? yearInitial : yearInitial + 1);

    return {
      previous: previous,
      month: otherMonth,
      year: otherYear
    }
  } 


  private _getDayOfWeekByNumberOfDays(dayOfWeekInitial: number, numberOfDaysInitial: number, previous: boolean = false) {
    const direction = previous ? -dayOfWeekInitial : dayOfWeekInitial;
    const dayOfWeek = ((direction + numberOfDaysInitial) % 7);
    return previous ? 7 - dayOfWeek : dayOfWeek;
  }

  private _getDayOfWeekInitialMonth(month: number, year: number): number {
    const isLeapYear = month > 1 && year % 4 === 0 ? 1 : 0;

    const daysUntilMonth = MonthsConstants.filter(item => item.number < month)
      .reduce((prev, current, _) => prev + current.numberOfDays, 0);

    const allDays = (year * 365) + Math.floor((year - 1) / 4) + daysUntilMonth + isLeapYear;
    const dayOfWeek = (allDays % 7) - 1;

    return dayOfWeek;
  }

  private _getNumberOfDaysForMonth(month: number, year: number): number {
    const isLeapYear = month === 1 && year % 4 === 0 ? 1 : 0;
    const numberOfDays = MonthsConstants.find(item => item.number === month)?.numberOfDays;
    return numberOfDays ? numberOfDays + isLeapYear : 0;
  }

}
