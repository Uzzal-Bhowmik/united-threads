"use client";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import { Layout } from "antd";
import { ReactNode, useState } from "react";
const { Content } = Layout;

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100dvh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className='bg-info rounded-tl-lg p-6 h-[90vh] overflow-auto'>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
