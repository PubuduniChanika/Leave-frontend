import React from 'react';

const Modal = ({ showModal, closeModal, children }) => {
  if (!showModal) return null; // Return nothing if the modal is not visible

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50" onClick={closeModal}></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
