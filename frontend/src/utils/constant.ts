export const pageSizeOptionsPaging = [10, 20, 50, 100];


import toast from "react-hot-toast";

export const toastText = (message: string, type: string) => {

    const commonStyle = {
      style: {
        fontSize: "16px",
      },
    };
  
    switch (type) {
      case "success":
        toast.success(message, commonStyle);
        break;
  
      case "error":
        toast.error(message, commonStyle);
        break;
    }
  };