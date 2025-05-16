
export type User = {
    id: string;
    name: string;
    login: string;
    email: string;
    avatar: string;
    online: boolean;
    lastSeen?: string;
    status?: 'student' | 'teacher' | 'guest';
    faculty?: string;
    degree?: string;
    course?: string;
    position?: string;
    department?: string;
    direction?: string;
    about?: string;
    chats?: Chat[];
};
  
export type FileData = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  description: string;
  location: string;
  color: string;
  participants: User[];
};

export type Message = {
  id: string;
  text: string;
  sender: User;
  timestamp: string;
  read: boolean;
  isEdited?: boolean;
  files?: FileData[];
  event?: CalendarEvent;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
};
  
export type Chat = {
    id: string;
    name: string;
    avatar: string;
    participants: User[];
    isGroup: boolean;
    muted: boolean;
    messages: Message[];
    unread: number;
    createdAt: string;
    isPinned: boolean;
    creatorId?: string;
    lastActivity: string;
    typingUsers: string[];
    isArchived?: boolean;
  };