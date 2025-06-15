// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import s3Routes from "./s3Routes";
import userRoutes from './userRoutes';
import faq from './faq';
import feetback from './feetback';
import events from './events';
import etisRoutes from './etisRoutes'
import newsRoutes from './newsRoutes'
import likeRouter from './likeRoutes'
import analyticsRoutes from './analyticsRoutes'
import noteRoutes from './noteRoutes';
import chatRoutes from './chatRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use("/s3", s3Routes);
router.use('/user', userRoutes); 
router.use('/faq', faq);
router.use('/feetback', feetback)
router.use('/events', events);
router.use('/etis', etisRoutes);
router.use('/news', newsRoutes);
router.use('/news/likes', likeRouter);
router.use('/analytics', analyticsRoutes);
router.use('/notes', noteRoutes);
router.use('/chats', chatRoutes);

export default router;