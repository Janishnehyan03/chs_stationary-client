import React, { createContext, useState } from "react";
import ConfirmationModal from "../components/common/ConfirmationModal";

export const ModalContext = createContext({
  openModal: (_title: string, _message: string, _onConfirm: () => void) => {},
  closeModal: () => {},
});

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const openModal = (title: string, message: string, onConfirm: () => void) => {
    setModalState({ isOpen: true, title, message, onConfirm });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
      />
    </ModalContext.Provider>
  );
};
