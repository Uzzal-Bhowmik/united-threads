import Image from "next/image";
import ModalWrapper from "@/components/shared/ModalWrapper/ModalWrapper";

export default function ShadePendingModal({ open, setOpen, quote }) {
  console.log("🚀quote:", quote);
  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className="mb-10">
        <div className="flex-center gap-x-5">
          <div>
            <Image
              src={quote?.frontSide}
              alt="user uploaded front design"
              height={1200}
              width={1200}
              className="mx-auto block rounded-lg border border-primary-black/50 p-2"
            />
            <h3 className="text-center font-medium text-green-500/75">
              Front Design
            </h3>
          </div>
          <div>
            <Image
              src={quote?.backSide}
              alt="user uploaded back design"
              height={1200}
              width={1200}
              className="mx-auto block rounded-lg border border-primary-black/50 p-2"
            />
            <h3 className="text-center font-medium text-green-500/75">
              Back Design
            </h3>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6 gap-x-16">
        <div className="col-span-2">
          <h4 className="text-lg font-medium">Product</h4>
          <h5 className="text-lg font-extrabold text-black">{quote?.name}</h5>
        </div>

        <div>
          <h4 className="text-lg font-medium">Category</h4>
          <h5 className="text-lg font-extrabold text-black">
            {quote?.category?.name}
          </h5>
        </div>

        <div>
          <h4 className="text-lg font-medium">Size</h4>
          <h5 className="text-lg font-extrabold text-black">{quote?.size}</h5>
        </div>

        <div>
          <h4 className="text-lg font-medium">Pantone Color</h4>
          <h5 className="flex-center-start gap-x-2 text-lg font-extrabold text-black">
            <div
              className="h-5 w-5 rounded-full"
              style={{
                backgroundColor: quote?.hexColor?.includes("#")
                  ? quote?.hexColor
                  : `#${quote?.hexColor}`,
              }}
            />
            <p>{quote?.pantoneColor}</p>
          </h5>
        </div>

        <div>
          <h4 className="text-lg font-medium">Quantity</h4>
          <h5 className="text-lg font-extrabold text-black">
            {quote?.quantity}pcs
          </h5>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-medium">Materials Preference</h4>
        <h5 className="rounded-lg bg-slate-100 p-2 text-lg font-extrabold text-black">
          {quote?.materialPreferences}
        </h5>
      </div>
    </ModalWrapper>
  );
}
