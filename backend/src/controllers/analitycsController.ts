import { Request, Response } from 'express';
import { analitycsInfoService } from '../services/analitycsService';

export const getInfoProjectController = async (req: Request, res: Response) => {
  try {
    const analitycsInfo = await analitycsInfoService();
    res.status(201).json(analitycsInfo);
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};