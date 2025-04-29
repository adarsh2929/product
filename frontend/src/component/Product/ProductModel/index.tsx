// product/frontend/src/component/Product/ProductForm/ProductModal.tsx
import React from 'react';
import { Modal } from 'antd';
import ProductForm from '../ProductForm';

const ProductModal = (props:any) => {
  const { isVisible, onClose, productData, isEdit, onSuccess } = props;
  
  return (
  <Modal
    title={productData ? 'Edit Product' : 'Create New Product'}
    open={isVisible}
    onCancel={onClose}
    footer={null}
    width={800}
    destroyOnClose
  >
    <ProductForm
      initialData={productData}
      isEdit={isEdit}
      onSuccess={onSuccess}
      onClose={onClose}
    />
  </Modal>
);
}
export default ProductModal;