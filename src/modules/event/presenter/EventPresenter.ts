import { EventModel } from '@event/model/EventModel';

export class EventPresenter {
  getDefaultEvents(): EventModel[] {
    const event1 = new EventModel(1, 'This is the first event');
    const event2 = new EventModel(2, 'This is the second event');
    const event3 = new EventModel(3, 'This is the third event');
    const event4 = new EventModel(3, 'This is the third event');
    const event5 = new EventModel(3, 'This is the third event');
    const event6 = new EventModel(3, 'This is the 5 event');
    const event7 = new EventModel(3, 'This is the 7 event');
    const event8 = new EventModel(3, 'This is the 8 event');

    return [event1, event2, event3, event4, event5, event6, event7, event8];
  }
}
