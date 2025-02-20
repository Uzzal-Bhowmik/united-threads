import MessageContainer from "@/components/dashboardLayout/csr/message/[user]/MessageContainer";

const MessagePage = ({ params }: { params: { id: string } }) => {
  return <MessageContainer receiverId={params.id}></MessageContainer>;
};

export default MessagePage;
