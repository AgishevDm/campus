import prisma from '../prisma';


export const createEvent = async (
    accountId: string,
    eventName: string,
    startEvent: string | Date,
    endEvent: string | Date | null,
    location: string,
    remindTime: Date | null,
    isRecurring: boolean,
    patternRecurring: string | null,
    description: string,
    eventType: string,
    color: string
  ) => {
    try {
      const event = await prisma.accountEvents.create({
        data: {
          account: accountId,
          eventName: eventName,
          location: location,
          startEvent: new Date(startEvent),
          endEvent: endEvent ? new Date(endEvent) : null,
          remindTime: remindTime,
          isRecurring: isRecurring,
          patternRecurring: patternRecurring,
          description: description,
          eventType: eventType,
          color: color
        }
      });
      return event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

export const getAllEventsService = async (accountId: string) => {
    try {
        const events = await prisma.accountEvents.findMany({
            where: { account: accountId },
        });

        const etisUrl = await prisma.account.findFirst({
          where: { primarykey: accountId },
          select: {
            sheduleEtis: true
          }
        })

        const formattedEvents = events.map((event) => ({
            id: event.primarykey,
            eventName: event.eventName,
            startEvent: event.startEvent,
            endEvent: event.endEvent,
            location: event.location || '',
            remindTime: event.remindTime || null,
            isRecurring: event.isRecurring || false,
            patternRecurring: event.patternRecurring || '',
            description: event.description || '',
            eventType: 'custom',
            color: event.color,
            etisUrl: etisUrl
          }));

          return {
            formattedEvents,
            etisUrl: etisUrl?.sheduleEtis,
          };
    } catch (error) {
        console.error('Error getting all events for user:', error);
        throw error;
    }
}

export const updateEvent = async (
    id: string,
    eventName: string,
    startEvent: string | Date,
    endEvent: string | Date | null,
    location: string,
    remindTime: Date | null,
    isRecurring: boolean,
    patternRecurring: string | null,
    description: string,
    eventType: string,
    color: string
  ) => {
    try {  
      const event = await prisma.accountEvents.update({
        where: { primarykey: id },
        data: {
          eventName,
          startEvent: new Date(startEvent),
          endEvent: endEvent ? new Date(endEvent) : null,
          location,
          remindTime,
          isRecurring,
          patternRecurring,
          description,
          eventType,
          color
        }
      });
  
      console.log(event);
      return event;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  };

export const deleteEvent = async (id: string) => {
    try {
        const event = await prisma.accountEvents.delete({
            where: { primarykey: id },
        });

        return event;
    } catch (error) {
        console.error('Error deleting event in service:', error);
        throw error;
    }
}