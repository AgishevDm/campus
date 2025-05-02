import prisma from '../prisma';

export const getFaq = async () => {
  try {
    const faq = await prisma.faq.findMany({
        select: {
            question: true,
            answer: true
        }
    });

    if (!faq) {
        throw new Error('FAQ not found');
    }

    return faq;
  } catch (error) {
    console.error('Error in getFaq:', error);
    throw error;
  }
};