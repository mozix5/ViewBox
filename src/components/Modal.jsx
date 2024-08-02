import React from "react";

const Modal = ({ loading, children, onClosePath, setIsOpen }) => {
  const handleClick = () => {
    if (!loading) {
      setIsOpen && setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full z-40 flex justify-center items-center backdrop-blur-sm">
      <div
        className="fixed inset-0 w-full h-full opacity-40 bg-slate-900"
        onClick={handleClick}
      ></div>
      {children}
    </div>
  );
};

export default Modal;
