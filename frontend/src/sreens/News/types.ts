export type UserRole = 'super' | 'admin' | 'user';
export type PostType = 'news' | 'event' | 'ad';
export type ColorOption = '#ff6b6b' | '#4ecdc4' | '#45b7d1' | '#96ceb4'| '#4577d1';

export type Props = {
  currentPost: Partial<Post>;
  setCurrentPost: (post: Partial<Post>) => void;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userRole: UserRole;
  previewImages: string[];
  setPreviewImages: React.Dispatch<React.SetStateAction<string[]>>;
  removeImage: (index: number) => void;
  setImageFiles?: React.Dispatch<React.SetStateAction<File[]>>;
};

export interface Post {
    id: string;
    type: string;
    title: string;
    author: string;
    authorId: string;
    avatar: string;
    location: string;
    locationLink?: string;
    images: string[]; 
    carouselIndex?: number;
    text: string; 
    date: string;
    isFavorite: boolean;
    eventDate?: string;
    eventTime?: string;
    link?: string;
    likes: number;
    liked: boolean;
    expanded: boolean;
    showComments: boolean;
    commentsCount: number;
  }

export interface CurrentUser {
    id: string;
    role: string;
    accountFIO: string;
    avatarURL: string;
}

export type ProfileProps = {
    setIsAuthenticated: (value: boolean) => void;
    setShowSessionAlert?: React.Dispatch<React.SetStateAction<boolean>>;
};