export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: string;
}

export interface IChatParticipant {
  id: string;
  chatId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
  user: IUser;
}

export interface IMessage {
  id: string;
  content: string | null;
  fileUrl: string | null;
  type: "TEXT" | "IMAGE" | "FILE" | "VIDEO" | "AUDIO" | "LOCATION" | "CALL";
  senderId: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
  sender: IUser;
}

export interface IChat {
  id: string;
  name: string | null;
  isGroup: boolean;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  participants: IChatParticipant[];
  lastMessage?: IMessage;
  _count?: {
    messages: number;
  };
}
