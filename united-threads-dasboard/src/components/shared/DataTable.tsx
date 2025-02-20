"use client"
import { ConfigProvider, Table, TableProps } from 'antd';

type TDataTableProps<T> = {data:T[] | [],columns:TableProps<T>["columns"]  | [],label:string,pagination?:{
    pageSize?:number

}}
const DataTable = <T,>({data,columns,label,pagination}:TDataTableProps<T>) => {

    return (
       <ConfigProvider
      theme={{
        components: {
          Table: {
            colorBgContainer: "rgb(248,250,252)",
            colorText: "#232323",
            colorTextHeading: "rgb(248,250,252)",
            headerBg: "#232323",
            borderColor: "rgb(87,88,88)",
            headerSplitColor: "#232323",
          },
        },
      }}
    >
      <div>
        <h1 className="text-2xl font-bold pb-4">{label}</h1>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{...pagination,responsive:true}}
        ></Table>
      </div>
    </ConfigProvider>
    );
};

export default DataTable;