export type NoteItem = {
    id: string;
    text: string;
    checked: boolean;
  };

  export type HistoryAction = 
  | 'CREATED' 
  | 'UPDATED_TITLE' 
  | 'UPDATED_CONTENT' 
  | 'UPDATED_LIST_TYPE'
  | 'SHARED' 
  | 'UNSHARED' 
  | 'DELETED';

  export type AccessLevel = 'VIEW' | 'EDIT';

  export interface HistoryEntry {
    timestamp: Date;
    accountId: string;      // ID пользователя, совершившего действие
    action: HistoryAction;
  }
  
  export type ListType = 'checkbox' | 'dash' | 'number' | 'none';
  
  export interface NoteResponse {
    id: string;
    title: string;
    content: NoteItem[];
    listType: ListType;
    createdAt: Date;
    updatedAt: Date;
    history?: HistoryEntry[];
  }