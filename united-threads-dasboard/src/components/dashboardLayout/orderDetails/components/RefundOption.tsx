"use client";
import { useState } from "react";
import { useUpdateOrderPaymentStatusMutation } from "@/redux/api/orderApi";
import { TOrder } from "@/redux/api/orderType";
import { Button, Input, Modal, notification, Radio, Space } from "antd";
import { Redo2 } from "lucide-react";
import { toast } from "sonner";

const RefundOption = ({ record }: { record: TOrder }) => {
  const [updatePaymentStatus, { isLoading: isUpdating }] = useUpdateOrderPaymentStatusMutation();
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [isFullRefund, setIsFullRefund] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isRefunding, setIsRefunding] = useState<boolean>(false);

  const handleRefund = async () => {
    if (!isFullRefund && !refundAmount) {
      notification.error({
        message: "Refund Amount Required",
        description: "Please enter a refund amount before confirming.",
      });
      return;
    }

    try {
      setIsRefunding(true);
      const refundAmountToUse = isFullRefund ? record.amount : Number(refundAmount);

      const res = await updatePaymentStatus({
        orderId: record._id,
        data: { refundAmount: refundAmountToUse },
      }).unwrap();

      if (res.success) {
        toast.success(res?.message);
        setIsModalVisible(false);
        setRefundAmount("");
        setIsFullRefund(false);
      } else {
        toast.error(res?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    } finally {
      setIsRefunding(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setRefundAmount("");
    setIsFullRefund(false);
  };

  const handleConfirmRefund = () => {
    Modal.confirm({
      title: "Refund the Order",
      content: "Are you sure you want to refund this order?",
      okText: "Yes",
      cancelText: "No",
      onOk: handleRefund,
    });
  };

  return (
    <>
      <Button
        size='small'
        style={{ padding: "14px 10px" }}
        className={`text-xs text-white font-semibold rounded-md flex items-center gap-x-1 ${
          record.paymentStatus === "REFUNDED" ? "bg-gray-400" : "bg-red-500"
        }`}
        onClick={showModal}
        disabled={record.paymentStatus === "REFUNDED"}
      >
        Refund
        <Redo2 size={16} />
      </Button>

      <Modal
        title='Refund the Order'
        open={isModalVisible}
        confirmLoading={isRefunding}
        //okText='Confirm Refund'
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={handleCancel}
        width={400}
      >
        <div className='mb-4'>
          <label htmlFor='refundAmount' className='block text-sm mb-2'>
            Choose refund type:
          </label>
          <Radio.Group
            onChange={(e) => {
              setIsFullRefund(e.target.value === "full");
              setRefundAmount("");
            }}
            value={isFullRefund ? "full" : "partial"}
          >
            <Space direction='vertical'>
              <Radio value='full'>Full Refund (${record.amount.toFixed(2)})</Radio>
              <Radio value='partial'>Partial Refund</Radio>
            </Space>
          </Radio.Group>
        </div>

        {isFullRefund ? null : (
          <div className='mb-4'>
            <label htmlFor='refundAmount' className='block text-sm mb-2'>
              Enter refund amount:
            </label>
            <Input
              type='number'
              id='refundAmount'
              value={refundAmount}
              min={0}
              max={record.amount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder='Enter partial refund amount'
              disabled={isFullRefund}
            />
          </div>
        )}

        <Button
          type='primary'
          onClick={handleConfirmRefund}
          loading={isRefunding}
          disabled={isRefunding || (isFullRefund === false && !refundAmount)}
          block
        >
          Confirm Refund
        </Button>
      </Modal>
    </>
  );
};

export default RefundOption;
