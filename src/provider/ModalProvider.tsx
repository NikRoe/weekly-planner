import Modal from "@/components/Modal/Modal";
import { createContext, ReactNode, useContext, useState } from "react";

interface ModalContextType {
  openModal: (content: ReactNode, hideCloseButton?: boolean) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [hideCloseButton, setHideCloseButton] = useState(false);

  function openModal(content: ReactNode, hideCloseButton = false) {
    setModalContent(content);
    setHideCloseButton(hideCloseButton);
  }

  function closeModal() {
    setModalContent(null);
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalContent && (
        <Modal onClose={closeModal} hideCloseButton={hideCloseButton}>
          {modalContent}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
}
