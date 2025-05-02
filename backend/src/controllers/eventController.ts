import { Request, Response } from 'express';
import { createEvent, getAllEventsService, updateEvent, deleteEvent } from '../services/eventService';

export const create = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;

    if (!accountId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { eventName, startEvent, location, remindTime, isRecurring, patternRecurring, description, eventType, color } = req.body;
    const event = await createEvent(accountId, eventName, startEvent, location, remindTime, isRecurring, patternRecurring, description, eventType, color);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const getAllController = async (req: Request, res: Response) => {
    try {
        const accountId = req.user?.primarykey;

        if (!accountId) {
        return res.status(401).json({ message: 'User not authenticated' });
        }

        const events = await getAllEventsService(accountId);
        res.status(201).json(events);
    } catch (error) {
        console.error('Error in register controller:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

export const updateEventController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { eventName, startEvent, location, remindTime, isRecurring, patternRecurring, description, eventType, color } = req.body;

        if (!id) {
        return res.status(401).json({ message: 'ID ивента пустое' });
        }

        const events = await updateEvent(id, eventName, startEvent, location, remindTime, isRecurring, patternRecurring, description, eventType, color);
        res.status(201).json(events);
    } catch (error) {
        console.error('Error in register controller:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

export const deleteEventController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
        return res.status(401).json({ message: 'ID ивента пустое' });
        }

        const event = await deleteEvent(id);
        res.status(201).json(event);
    } catch (error) {
        console.error('Error in process of deleting event:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
};