declare module 'node-ical' {
  interface ICalEvent {
    type: 'VEVENT';
    uid: string;
    summary: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
  }

  interface ICalEvents {
    [key: string]: ICalEvent;
  }

  export function fromURL(url: string): Promise<ICalEvents>;
  export function parseICS(icsData: string): ICalEvents;

  // Правильное объявление sync
  export const sync: {
    fromURL(url: string): Promise<ICalEvents>;
  };
}