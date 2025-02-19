type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  meta?: TMeta;
};

export type TChatList = {
  chatId: string;
  participants: [
    {
      user: string;
      isBlocked: boolean;
      _id: string;
    },
    {
      user: string;
      isBlocked: boolean;
      _id: string;
    },
  ];
  latestMessage: {
    _id: string;
    sender: string;
    receiver: string;
    chat: string;
    text: string;
    seen: boolean;
    file?: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  unreadMessageCount: number;
};
