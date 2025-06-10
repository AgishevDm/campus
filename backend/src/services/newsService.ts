import prisma from '../prisma';
import S3Service from './s3Service';

export const createNewsService = async (
  creatorId: string, 
  title: string, 
  typeNews: string, 
  locationMap: string, 
  dateEvent: string, 
  advertisingUrl: string, 
  description: string, 
  imageUrls: string[]
) => {
  try {
    const localDate = new Date(dateEvent);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

    const news = await prisma.news.create({
      data: {
        title: title,
        locationMap: locationMap,
        createdBy: creatorId,
        typeNews: typeNews,
        dateEvent: utcDate,
        advertisingUrl: advertisingUrl,
        description: description,
      },
      include: {
        createdById: {
          select: {
            accountFIO: true,
            avatarUrl: true
          }
        }
      }
    });

    let images: { imageUrl: string }[] = [];
    if (imageUrls && imageUrls.length > 0) {
      await prisma.postImages.createMany({
        data: imageUrls.map((url, index) => ({
          newsId: news.primarykey,
          imageUrl: url,
          imageOrder: index,
        })),
      });

      // Получаем созданные изображения
      images = await prisma.postImages.findMany({
        where: { newsId: news.primarykey },
        orderBy: { imageOrder: 'asc' },
        select: { imageUrl: true }
      });
    }

    return {
      primarykey: news.primarykey,
      typeNews: news.typeNews,
      title: news.title,
      createdBy: news.createdById?.accountFIO,
      authorId: creatorId,
      avatar: news.createdById?.avatarUrl,
      locationMap: news.locationMap,
      dateEvent: news.dateEvent,
      advertisingUrl: news.advertisingUrl,
      description: news.description,
      createTime: news.createTime,
      images: images.map(img => img.imageUrl),
      likesCount: 0,
      isFavorite: false
    };
  } catch (error) {
    console.error("Ошибка при сохранении новости:", error);
    // // Удаляем уже загруженные изображения при ошибке
    // if (imageUrls && imageUrls.length > 0) {
    //   await Promise.all(
    //     imageUrls.map(url => 
    //       S3Service.deleteFile(this.extractFileNameFromUrl(url), 'posts')
    //     )
    //   );
    // }
    throw error;
  }
};

export const getAllNewsService = async (userId?: string) => {
    try {
        const news = await prisma.news.findMany({
            select: {
                primarykey: true,
                createdById: {
                    select: {
                        primarykey: true,
                        accountFIO: true,
                        avatarUrl: true
                    }
                },
                title: true,
                dateEvent: true,
                locationMap: true,
                typeNews: true,
                createTime: true,
                description: true,
                picture: true,
                advertisingUrl: true,
                likesCount: true,
                likes: {
                    select: {
                        userId: true
                    }
                },
                favorites: {
                    where: userId ? { userId } : undefined,
                    select: {
                        userId: true
                    }
                },
                images: {
                  orderBy: { imageOrder: 'asc' },
                  select: { imageUrl: true }
                },
              },
              orderBy: [
                { createTime: 'desc' },
              ]
        });

        const formattedEvents = news.map((news) => ({
            id: news.primarykey,
            createdBy: news.createdById?.accountFIO || '',
            authorId: news.createdById?.primarykey,
            title: news.title,
            dateEvent: news.dateEvent || null,
            locationMap: news.locationMap || '',
            typeNews: news.typeNews,
            createTime: news.createTime,
            description: news.description || '',
            picture: news.picture || '',
            images: news.images.map(img => img.imageUrl),
            avatar: news.createdById?.avatarUrl,
            likesCount: news.likesCount,
            // Можно добавить список пользователей, которые лайкнули
            likedBy: news.likes.map(like => like.userId),
            isFavorite: userId ? news.favorites.length > 0 : false
          }));

          return {
            formattedEvents
          };
    } catch (error) {
        console.error('Error getting all news:', error);
        throw error;
    }
}

export const deleteNewsService = async (id: string) => {
  try {
    const newsToDelete = await prisma.news.findUnique({
      where: { primarykey: id },
      include: {
        images: true,
        favorites: true,
        likes: true
      }
    });

    if (!newsToDelete) {
      throw new Error('News not found');
    }



    await Promise.all(
      newsToDelete.images.map(async (image) => {
        try {
          const fileName = S3Service.extractFileNameFromUrl(image.imageUrl);
          await S3Service.deleteFile(await fileName, 'postsImage');
        } catch (error) {
          console.error(`Error deleting image from S3: ${image.imageUrl}`, error);
        }
      })
    );

    await prisma.$transaction([
      // Удаляем изображения из БД
      prisma.postImages.deleteMany({
        where: { newsId: id }
      }),
      // Удаляем из избранного
      prisma.favoriteNews.deleteMany({
        where: { newsId: id }
      }),
      // Удаляем лайки
      prisma.newsLike.deleteMany({
        where: { postId: id }
      }),
      // Удаляем саму новость
      prisma.news.delete({
        where: { primarykey: id }
      })
    ]);

    return { success: true, deletedImagesCount: newsToDelete.images.length };
  } catch (error) {
    console.error("Ошибка при удалении поста в сервисе:", error);
    throw error;
  }
};

export const updateNewsService = async (
  id: string,
  title: string,
  typeNews: string,
  locationMap: string,
  dateEvent: string,
  advertisingUrl: string,
  description: string,
  remainingImages: string[], // Оставшиеся изображения
  newImages: Express.Multer.File[] // Новые изображения
) => {
  try {
    const localDate = new Date(dateEvent);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

    const currentPost = await prisma.news.findUnique({
      where: { primarykey: id },
      include: { images: true }
    });

    if (!currentPost) {
      throw new Error('Post not found');
    }

    // 2. Определяем изображения для удаления
    const imagesToDelete = currentPost.images.filter(
      img => !remainingImages.includes(img.imageUrl)
    );

    // 3. Удаляем изображения из S3 и БД
    await Promise.all(
      imagesToDelete.map(async img => {
        try {
          const fileName = await S3Service.extractFileNameFromUrl(img.imageUrl);
          await S3Service.deleteFile(fileName, 'postsImage');
        } catch (error) {
          console.error(`Error deleting image ${img.imageUrl}:`, error);
        }
        await prisma.postImages.delete({ where: { primarykey: img.primarykey } });
      })
    );

    // 4. Загружаем новые изображения
    const newImageUrls = newImages?.length > 0
      ? await S3Service.uploadFiles(newImages, currentPost.createdBy, 'maps/postsImage')
      : [];

    // 5. Обновляем порядок оставшихся изображений
    await Promise.all(
      remainingImages.map(async (url, index) => {
        await prisma.postImages.updateMany({
          where: { imageUrl: url },
          data: { imageOrder: index }
        });
      })
    );

    // 6. Добавляем новые изображения
    if (newImageUrls.length > 0) {
      await prisma.postImages.createMany({
        data: newImageUrls.map((url, index) => ({
          newsId: id,
          imageUrl: url,
          imageOrder: remainingImages.length + index
        }))
      });
    }

    const updatedPost = await prisma.news.update({
      where: { primarykey: id },
      data: {
        title,
        locationMap,
        typeNews,
        dateEvent: utcDate,
        advertisingUrl,
        description,
      },
      include: {
        images: {
          orderBy: { imageOrder: 'asc' },
          select: { imageUrl: true }
        },
        createdById: {
          select: {
            primarykey: true,
            accountFIO: true,
            avatarUrl: true
          }
        }
      }
    });

    return {
      ...updatedPost,
      images: updatedPost.images.map(img => img.imageUrl)
    };
  } catch (error) {
    console.error("Ошибка при сохранении новости:", error);
    throw error;
  }
}

export const updateIsFavorite = async (newsId: string, userId: string, isFavorite: boolean) => {
  try {
    if (isFavorite) {
      await prisma.favoriteNews.create({
        data: {
          userId,
          newsId
        }
      });
    } else {
      await prisma.favoriteNews.deleteMany({
        where: {
          userId,
          newsId
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Ошибка при обновлении избранного:", error);
    throw error;
  }
}