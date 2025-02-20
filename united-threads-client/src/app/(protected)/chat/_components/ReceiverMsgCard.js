import React from "react";
import logo from "/public/logos/logo-normal.svg";
// import Image from "next/image";
import { Image } from "antd";
// import { showImage } from "@/utils/fileHelper";

export default function ReceiverMsgCard({ message, isDifferentSender }) {
  console.log(message?.file);
  return (
    <div className="flex-center-start gap-x-2">
      {isDifferentSender ? (
        <Image
          src={logo}
          alt="united threads logo"
          height={40}
          width={40}
          className="aspect-square rounded-full border border-primary-black p-1"
        />
      ) : (
        <div className="w-10"></div>
      )}
      <div className="relative mt-2 max-w-max">
        {message?.file?.length > 0 && (
          <Image.PreviewGroup className="grid grid-cols-4 gap-4">
            {message?.file?.map((img) => (
              <Image
                src={img}
                alt={img}
                height={200}
                width={200}
                className="h-[160px] w-auto"
              />
            ))}
          </Image.PreviewGroup>
        )}

        {message?.text && (
          <p className="rounded-full border bg-primary-black px-3 py-2 font-medium text-primary-white">
            {message?.text}
          </p>
        )}
      </div>
    </div>
  );
}
