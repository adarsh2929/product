

export interface ProductModalProps {
    isVisible: boolean;
    onClose: () => void;
    productData?: any;
    isEdit?: boolean;
    onSuccess: () => void;
  }