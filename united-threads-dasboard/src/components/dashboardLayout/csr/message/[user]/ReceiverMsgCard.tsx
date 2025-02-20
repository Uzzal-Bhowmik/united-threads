import { Image } from "antd";
import moment from "moment";

const ReceiverMsgCard = ({
  message,
  createdAt,
  file,
}: {
  message: string;
  createdAt: string;
  file: string[] | null;
}) => {
  return (
    <div className='space-y-2 flex flex-col items-start relative'>
      <p className='text-xs px-3'>{moment(createdAt).format("DD MMMM YYYY : hh:mm A")}</p>
      {message ? (
        <div className='max-w-max rounded-xl border bg-primaryBlack text-white px-3 py-2'>
          <p className='text-primaryWhite'>{message}</p>
        </div>
      ) : (
        ""
      )}
      {file?.length ? (
        <>
          <div className='grid gap-2 w-full relative'>
            {file.length > 1 ? (
              <p className='absolute top-0 right-0 bg-black/10 px-2 z-10 py-1 rounded-bl-lg text-xs'>
                Attachment {file.length}
              </p>
            ) : (
              ""
            )}
            <div className={`grid ${file.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
              <Image.PreviewGroup>
                {file?.map((img) => (
                  <Image
                    key={img}
                    src={img}
                    alt={img}
                    height={200}
                    width={200}
                    className='h-[200px] w-auto rounded-xl border'
                  />
                ))}
              </Image.PreviewGroup>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ReceiverMsgCard;
