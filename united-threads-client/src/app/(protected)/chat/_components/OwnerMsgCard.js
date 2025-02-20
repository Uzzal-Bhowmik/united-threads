// import { showImage } from "@/utils/fileHelper";
// import Image from "next/image";
import { Image } from "antd";
import React from "react";

export default function OwnerMsgCard({ message }) {
  return (
    <div className={"mt-4 grid"}>
      {message?.file?.length > 0 && (
        <div className="mb-2 grid grid-cols-2 gap-2 rounded-xl border p-2">
          <Image.PreviewGroup>
            {message?.file?.map((img) => (
              <Image
                src={img}
                alt={img}
                height={200}
                width={200}
                className="h-[80px] w-auto rounded-xl border"
              />
            ))}
          </Image.PreviewGroup>
        </div>
      )}

      {message?.text && (
        <p className="ml-auto w-max rounded-xl bg-gray-200 px-3 py-2 font-medium text-primary-black">
          {message?.text}
        </p>
      )}
    </div>
  );
}
