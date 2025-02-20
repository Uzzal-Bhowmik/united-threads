"use client";
import { TCategory } from "@/types/categoryTypes";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Segmented } from "antd";
import { useRef } from "react";

const CustomSegment = ({
  items,
  setSelectedCategory,
}: {
  items: TCategory[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<TCategory | null | undefined>>;
}) => {
  // ------------------- Slider navigation buttons --------------------- //
  const scrollContainerRef: any = useRef(null);
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div id='custom-segment' className='!w-full justify-between'>
      {items?.length > 0 && (
        <div className='flex items-center gap-x-3'>
          <Button
            size='large'
            icon={<LeftOutlined />}
            onClick={handleScrollLeft}
            className='!w-[5%]'
          />

          <div
            ref={scrollContainerRef}
            className='!flex-grow !max-w-[90%] !overflow-auto scroll-hide'
          >
            <Segmented
              options={[{ name: "ALL", value: "ALL" }, ...items]?.map(
                (category: any) => category?.name,
              )}
              size='large'
              onChange={(value) => {
                setSelectedCategory(
                  items?.find(
                    (category: TCategory) =>
                      !!category && category?.name?.toLowerCase() === value.toLowerCase(),
                  ),
                );
              }}
              defaultValue={items?.length ? items[0]?.name : ""}
            />
          </div>

          <div className='!w-[5%] flex justify-end'>
            <Button
              size='large'
              icon={<RightOutlined />}
              onClick={handleScrollRight}
              className='!w-full'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSegment;
