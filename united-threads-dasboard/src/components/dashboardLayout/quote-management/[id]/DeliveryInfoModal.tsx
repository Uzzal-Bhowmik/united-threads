import { Button, Form, FormProps, Input, Modal, Select } from "antd";
import { useRouter } from "next/navigation";

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
};

type FieldType = {
  category: string;
};



const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  

const DeliveryInfoModal = ({ open, setOpen }: TPropsType) => {
  const route = useRouter();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    route.push("/quote-management/1/deliveryQuoteProduct")
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      style={{
        minWidth: "max-content",
        position: "relative",
      }}
    >
      <div className="pb-2">
        <div className="flex justify-between">
          <h4 className="text-center text-xl ">
          Available Quantity : <span className="font-medium">400</span>
          </h4>
          <Select
              defaultValue="fullDelivery"
              style={{ width: 180, border: "none", marginRight: "20px" }}
              
              onChange={handleChange}
              options={[
                { value: "fullDelivery", label: "Full Delivery" },
                { value: "partialDelivery", label: "Partial Delivery" },
              ]}
            />
        </div>
        <div className="mt-10">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Shipment Quantity" name="shipmentQuantity" rules={[{required: true}]}>
              <Input size="large" placeholder="Enter Shipment Quantity"></Input>
            </Form.Item>
            <Button htmlType="submit" block size="large">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryInfoModal;
