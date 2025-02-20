export type TMessage = {
  _id: string;
  sender: string;
  receiver: string;
  chat: string;
  text: string;
  seen: boolean;
  file: string[] | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

