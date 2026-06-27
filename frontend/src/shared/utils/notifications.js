import toast from "react-hot-toast";

export const showToast = (message, type = "success", duration = 4000) => {
  const options = {
    duration,
    position: "top-right",
    className: "rounded-lg bg-white p-4 shadow-xl border border-gray-100",
    style: {
      color: "#1a202c",
      fontWeight: "500",
    },
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast(message, { ...options, icon: "ℹ️" });
      break;
    case "loading":
      return toast.loading(message, options);
    default:
      toast(message, options);
  }
};
