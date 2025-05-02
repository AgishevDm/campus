import { Request, Response } from 'express';
import { EtisService } from '../services/etisService';
import prisma from '../prisma';

export const EtisController = {
  async syncEvents(req: Request, res: Response) {
    try {
      const accountId = req.user?.primarykey;
      const { sheduleEtis } = req.body;

      if (!accountId || !sheduleEtis) {
        return res.status(400).json({ message: 'Invalid request data' });
      }

      const events = await EtisService.syncUserEvents(accountId, sheduleEtis);
      res.json(events);
    } catch (error) {
      console.error('ETIS sync error:', error);
      res.status(500).json({ message: 'Failed to sync ETIS schedule' });
    }
  },

  async getEvents(req: Request, res: Response) {
    try {
      const accountId = req.user?.primarykey;
      if (!accountId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const events = await EtisService.getUserEtisEvents(accountId);
      res.json(events);
    } catch (error) {
      console.error('ETIS get events error:', error);
      res.status(500).json({ message: 'Failed to get ETIS events' });
    }
  },

  async getIcalUrl(req: Request, res: Response) {
    try {
      const accountId = req.user?.primarykey;
      if (!accountId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const account = await prisma.account.findUnique({
        where: { primarykey: accountId },
        select: { sheduleEtis: true }
      });

      res.json({ sheduleEtis: account?.sheduleEtis });
    } catch (error) {
      console.error('Get ICAL URL error:', error);
      res.status(500).json({ message: 'Failed to get ICAL URL' });
    }
  },

  async deleteEtisCalendar(req: Request, res: Response) {
    try {
      const accountId = req.user?.primarykey;
      if (!accountId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      return await prisma.$transaction(async (tx) => {
        const deleteResult = await tx.accountEvents.deleteMany({
          where: {
            account: accountId,
            isFromEtis: true
          }
        });

        await tx.account.update({
          where: { primarykey: accountId },
          data: { sheduleEtis: null }
        });

        return res.status(200).json(deleteResult);
      });
    } catch (error) {
      console.error('Get ICAL URL error:', error);
      res.status(500).json({ message: 'Failed to get ICAL URL' });
    }
  }
};