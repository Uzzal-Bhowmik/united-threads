import { TUser } from "./userType";

export interface TChatList {
  chatId: string;
  participants: Participant[];
  latestMessage: LatestMessage;
  unreadMessageCount: number;
}

export interface Participant {
  user: TUser;
  isBlocked: boolean;
  _id: string;
}

export interface LatestMessage {
  _id: string;
  sender: string;
  receiver: string;
  chat: string;
  text: string;
  seen: boolean;
  file: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
