import QuoteOrderDetailsContainer from "@/components/dashboardLayout/csr/quote-details/[id]/QuoteOrderDetailsContainer";

const QuoteOrderDetaisPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <QuoteOrderDetailsContainer id={params.id}></QuoteOrderDetailsContainer>
    </div>
  );
};

export default QuoteOrderDetaisPage;
