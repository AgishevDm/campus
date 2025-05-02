import { InputJsonValue } from '@prisma/client/runtime/library';
import prisma from '../prisma';
import { NoteItem, ListType, HistoryEntry, HistoryAction, AccessLevel } from '../types/note';

const MAX_HISTORY_ENTRIES = 10;

export const getNotesByAccount = async (accountId: string) => {
  try {
    const notes = await prisma.note.findMany({
      where: { accountId: accountId },
      orderBy: { editTime: 'desc' },
      select: {
        primarykey: true,
        title: true,
        content: true,
        listType: true,
        createTime: true,
        editTime: true,
        history: true,
      }
    });

    return notes.map(note => ({
      id: note.primarykey,
      title: note.title,
      content: note.content,
      listType: note.listType,
      createdAt: note.createTime,
      updatedAt: note.editTime,
      history: note.history === null ? [] : ((note.history as unknown) as HistoryEntry[])
    }));
  } catch (error) {
    console.error('Error in getNotesByAccount:', error);
    throw error;
  }
};

export const getNoteById = async (noteId: string, accountId: string) => {
  try {
    const note = await prisma.note.findUnique({
      where: { 
        primarykey: noteId,
        accountId: accountId 
      },
      select: {
        primarykey: true,
        title: true,
        content: true,
        listType: true,
        createTime: true,
        editTime: true,
        history: true,
      }
    });

    if (!note) return null;

    return {
      id: note.primarykey,
      title: note.title,
      content: note.content,
      listType: note.listType,
      createdAt: note.createTime,
      updatedAt: note.editTime,
      history: note.history === null ? [] : ((note.history as unknown) as HistoryEntry[])
    };
  } catch (error) {
    console.error('Error in getNoteById:', error);
    throw error;
  }
};

export const createNote = async (
    title: string, 
    content: NoteItem[] | undefined, 
    listType: ListType, 
    accountId: string
) => {
  try {
    const initialHistory: HistoryEntry[] = [
        {
          timestamp: new Date(),
          accountId,
          action: 'CREATED'
        }
      ];
    
    const note = await prisma.note.create({
      data: {
        title,
        content: content || [{ id: '1', text: '', checked: false }],
        listType: listType || 'none',
        accountId: accountId,
        editTime: new Date(),
        history: initialHistory as unknown as InputJsonValue,
      },
      select: {
        primarykey: true,
        title: true,
        content: true,
        listType: true,
        createTime: true,
        editTime: true,
        history: true,
      }
    });

    return {
      id: note.primarykey,
      title: note.title,
      content: note.content,
      listType: note.listType,
      createdAt: note.createTime,
      updatedAt: note.editTime,
      history: note.history === null ? [] : ((note.history as unknown) as HistoryEntry[])
    };
  } catch (error) {
    console.error('Error in createNote:', error);
    throw error;
  }
};

export const addHistoryEntry = async (noteId: string, action: HistoryAction, accountId: string) => {
    const note = await prisma.note.findUnique({
      where: { primarykey: noteId },
      select: { history: true }
    });
  
    const currentHistory = note?.history || []; // Приведение к HistoryEntry[]
    const newEntry: HistoryEntry = {
      timestamp: new Date(),
      accountId,
      action
    };
  
    const updatedHistory = [(currentHistory as unknown as HistoryEntry[]), newEntry].flat().slice(-MAX_HISTORY_ENTRIES);
  
    await prisma.note.update({
      where: { primarykey: noteId },
      data: { history: updatedHistory as unknown as InputJsonValue } // История уже в правильном формате
    });
};

export const updateNote = async (
    noteId: string, 
    title: string, 
    content: NoteItem[], 
    listType: ListType, 
    accountId: string
) => {
  try {
    const currentNote = await prisma.note.findUnique({
        where: { primarykey: noteId }
    });
  
    if (!currentNote) {
        throw new Error('Note not found');
    }

    const changes: HistoryAction[] = [];
    if (currentNote.title !== title) changes.push('UPDATED_TITLE');
    if (JSON.stringify(currentNote.content) !== JSON.stringify(content)) {
      changes.push('UPDATED_CONTENT');
    }
    if (currentNote.listType !== listType) changes.push('UPDATED_LIST_TYPE');

    const note = await prisma.note.update({
      where: { 
        primarykey: noteId,
        accountId: accountId 
      },
      data: {
        title,
        content,
        listType: listType,
        editTime: new Date()
      },
      select: {
        primarykey: true,
        title: true,
        content: true,
        listType: true,
        createTime: true,
        editTime: true,
        history: true
      }
    });

    for (const change of changes) {
        await addHistoryEntry(noteId, change, accountId);
    }

    return {
      id: note.primarykey,
      title: note.title,
      content: note.content,
      listType: note.listType,
      createdAt: note.createTime,
      updatedAt: note.editTime,
      history: note.history,
    };
  } catch (error) {
    console.error('Error in updateNote:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string, accountId: string) => {
  try {
    await prisma.noteShare.deleteMany({
        where: {
            noteId: noteId
        },
    })

    await prisma.note.delete({
      where: { 
        primarykey: noteId,
        accountId: accountId 
      }
    });
  } catch (error) {
    console.error('Error in deleteNote:', error);
    throw error;
  }
};

// Для операций совместного доступа
export const shareNote = async (
    noteId: string,
    targetAccountId: string,
    access: AccessLevel,
    accountId: string
  ) => {
    await prisma.noteShare.create({
      data: {
        noteId,
        accountId: targetAccountId,
        access
      }
    });
  
    await addHistoryEntry(noteId, 'SHARED', accountId);
  };

//   export const unshareNote = async (
//     noteId: string,
//     targetAccountId: string,
//     accountId: string
//   ) => {
//     await prisma.noteShare.delete({
//       where: {
//         noteId_accountId: {
//           noteId,
//           accountId: targetAccountId
//         }
//       }
//     });
  
//     await addHistoryEntry(noteId, 'UNSHARED', accountId);
//   };

// export const getNoteHistory = async (noteId: string, accountId: string) => {
//     const note = await prisma.note.findFirst({
//       where: {
//         primarykey: noteId,
//         OR: [
//           { accountId },
//           { noteShare: { some: { accountId, access: 'EDIT' } } }
//         ]
//       },
//       select: {
//         history: true
//       }
//     });
  
//     if (!note) {
//       throw new Error('Note not found or access denied');
//     }
  
//     return note.history as HistoryEntry[] || [];
//   };