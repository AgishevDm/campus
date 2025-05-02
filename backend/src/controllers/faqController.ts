import { Request, Response } from 'express';
import { getFaq } from '../services/faqService';

export const get = async (req: Request, res: Response) => {
  try {
    const faq = await getFaq();
    res.status(200).json(faq);
  } catch (error) {
    console.error('Error in getFaq controller:', error);
    res.status(500).json({ message: 'Error get faq' });
  }
};