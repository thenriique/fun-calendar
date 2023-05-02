import { TestBed } from '@angular/core/testing';

import { EventsCalendarService } from './events-calendar.service';

describe('EventsCalendarService', () => {
  let service: EventsCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
