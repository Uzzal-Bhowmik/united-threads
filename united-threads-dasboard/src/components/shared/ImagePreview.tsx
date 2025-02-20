"use client";
import { Carousel, Modal } from "antd";
import React, { useState } from "react";

const ImagePreview = ({ children }: { children: React.ReactNode; }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div onClick={showModal} className='cursor-pointer'>
        {children}
      </div>
      <Modal
        title='Basic Modal'
        className='w-full bg-transparent '
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Carousel arrows infinite={false} className='bg-transparent'>
          <div className='bg-transparent'>
            <h3>1</h3>
          </div>
        </Carousel>
      </Modal>
    </>
  );
};

export default ImagePreview;
