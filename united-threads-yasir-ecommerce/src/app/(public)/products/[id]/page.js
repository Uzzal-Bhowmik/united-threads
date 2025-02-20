import CustomTShirtDesigner from "@/components/CustomTShirtDesigner/CustomTShirtDesigner";

export const metadata = {
  title: "Design Your Apparel",
  description: "Custom apparel designer  page",
};

export default function DynamicProductPage() {
  return (
    <div className="lg:mx-auto lg:w-3/4">
      <CustomTShirtDesigner />
    </div>
  );
}
