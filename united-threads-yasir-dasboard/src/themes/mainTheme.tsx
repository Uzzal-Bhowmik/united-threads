import { ThemeConfig } from "antd";

const mainTheme: ThemeConfig = {
  token: {
    colorPrimary: "#232323",
    colorInfo: "#232323",
  },
  components: {
    Layout: {
      siderBg: "#232323",
      headerColor: "rgb(35,35,35)",
      bodyBg: "#232323",
      algorithm: true,
      lightTriggerBg: "rgb(87,88,88)",
      lightSiderBg: "rgb(35,35,35)",
      triggerColor: "rgb(35,35,35)",
    },
    Menu: {
      colorPrimaryBorder: "#232323",
      algorithm: true,
      itemColor: "rgb(248,250,252)",
      itemBg: "",
      itemBorderRadius: 4,
      itemHoverColor: "#a1a1aa",
      itemHoverBg: "rgb(248,250,252)",
      itemActiveBg: "rgb(248,250,252)",
      itemSelectedBg: "rgb(255,255,255)",
      itemSelectedColor: "rgb(0,0,0)",
    },
    Button: {
      colorBgContainer: "rgb(35,35,35)",
      colorText: "rgba(255,255,255,0.88)",
      colorPrimaryHover: "rgb(175,157,157)",
      borderRadius: 8,
    },
    Segmented: {
      itemActiveBg: "rgb(35,35,35)",
      itemHoverBg: "rgb(35,35,35)",
      itemColor: "rgb(35,35,35)",
      itemHoverColor: "rgb(255,255,255)",
      itemSelectedBg: "rgb(35,35,35)",
      trackBg: "rgba(245,245,245,0)",
      colorText: "rgb(255,255,255)",
      borderRadius: 8,
      controlHeight: 42,
    },
    Popconfirm: {
      colorWarning: "rgb(245,34,45)",
    },
    Table: {
      colorBgContainer: "rgb(248,250,252)",
      colorText: "#232323",
      colorTextHeading: "rgb(248,250,252)",
      headerBg: "#232323",
      headerSplitColor: "#232323",
    },
    Input: {
      colorBorder: "rgb(0,0,0)",
    },
    Form: {
      labelFontSize: 18,
    },
    Tabs: {
      colorText: "rgb(248,250,252)",
      itemSelectedColor: "rgb(0,176,71)",
    },
    Select: {
      colorBorder: "rgb(0,0,0)",
      colorTextDisabled: "rgb(0,0,0)",
    },
    Spin: {
      colorPrimary: "#232323",
    },
    DatePicker: {
      colorBgElevated: "rgb(35,35,35)",
      colorBgContainer: "rgb(35,35,35)",
      colorText: "rgba(255,255,255,0.88)",
      colorTextDisabled: "rgba(255,253,253,0.7)",
      colorTextHeading: "rgba(255,255,255,0.88)",
      colorIconHover: "rgba(247,225,225,0.88)",
      colorIcon: "rgba(255,255,255,0.8)",
      colorTextPlaceholder: "rgba(255,255,255,0.8)",
    },
    InputNumber: {
      colorTextDisabled: "rgba(0,0,0,0.8)",
    },
  },
};

export default mainTheme;
