import { MonthAttr } from "./month-attr";

export interface CalendarThreeMonth {
    previousMonth: MonthAttr,
    currentMonth: MonthAttr,
    nextMonth: MonthAttr,
    othersMonth?: MonthAttr[]
}