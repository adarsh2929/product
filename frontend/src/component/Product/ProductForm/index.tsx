// product/frontend/src/component/Product/ProductForm/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Space, Card, message, Upload } from 'antd';
import { createProduct, updateProduct } from '../../../API/productAPI';
import { PlusOutlined } from '@ant-design/icons';
import { getProductImageUrl } from '../../../API/productAPI';

// Make this a function to ensure a fresh object each time
const createDefaultAttribute = () => ({ key: '', values: [''] });

const ProductForm = ({ initialData = {}, isEdit = false, onSuccess, onClose }:any) => {
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Initialize attributes from initialData or with a default
  const [attributes, setAttributes] = useState(() => {
    if (initialData?.attributes?.length) {
      return initialData.attributes;
    }
    return [createDefaultAttribute()];
  });
  
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (initialData && isEdit ) {
      // Check if initialData is an array
      const data = Array.isArray(initialData) ? initialData : initialData;
      
      if (data) {
        const imageValue = data.id ? {
          uid: '-1',
          name: 'product-image.jpg',
          status: 'done',
          url: getProductImageUrl(data.id)
        } : undefined;
        
        
        form.setFieldsValue({
          name: data.name || '',
          price: data.price || '',
          image: imageValue,
        });
        
      }
    }
  }, [initialData, form, isEdit]);

  useEffect(() => {
    if (initialData && isEdit && initialData.id) {
      // If editing a product with an existing image, show it
      setFileList([{
        uid: '-1',
        name: 'product-image.jpg',
        status: 'done',
        url: getProductImageUrl(initialData.id)
      }]);
    } else {
      setFileList([]);
    }
  }, [initialData, isEdit]);

  // Add a new attribute with an empty object to prevent reference issues
  const handleAddAttribute = () => {
    setAttributes((prev:any) => [...prev, createDefaultAttribute()]);
  };
  
  const handleRemoveAttribute = (idx:any) => {
    setAttributes((prev:any) => prev.filter((_:any, i:any) => i !== idx));
  };
  
  const handleAttributeChange = (idx:any, field:any, value:any) => {
    setAttributes((prev:any) => {
      const updated = [...prev];
      updated[idx] = {...updated[idx], [field]: value};
      return updated;
    });
  };
  
  const handleValueChange = (attrIdx:any, valIdx:any, value:any) => {
    setAttributes((prev:any) => {
      const updated = [...prev];
      // Create a new array to avoid mutation
      const newValues = [...updated[attrIdx].values];
      newValues[valIdx] = value;
      updated[attrIdx] = {...updated[attrIdx], values: newValues};
      return updated;
    });
  };
  

  const handleRemoveValue = (attrIdx:any, valIdx:any) => {
    setAttributes((prev:any) => {
      const updated = [...prev];
      const newValues = [...updated[attrIdx].values];
      newValues.splice(valIdx, 1);
      updated[attrIdx] = {...updated[attrIdx], values: newValues};
      return updated;
    });
  };

  const onFinish = async (values:any) => {
    const expandedAttributes:any = [];
  
  attributes
    .filter((attr:any) => attr.key && attr.values.some((v:any) => v))
    .forEach((attr:any) => {
      const validValues = attr.values.filter((v:any) => v);
      
      validValues.forEach((value:string) => {
        expandedAttributes.push({
          key: attr.key,
          values: [value] 
        });
      });
    });
  
  const payload = {
    id: initialData?.id,
    name: values.name,
    price: values.price,
    image: values.image,
    attributes: expandedAttributes
  };
    
    try {
      if (isEdit && initialData) {
        await updateProduct('/product/product', payload);
      } else {
        await createProduct('/product/create', payload);
      }
      message.success(`Product successfully ${isEdit ? 'updated' : 'created'}`);
      onSuccess?.();
      onClose?.();
    } catch (e) {
      message.error(`Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      preserve={true}
    >
      <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="price" label="Price" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="image" label="Product Image" rules={[{ required: true }]}>
        <Upload
          listType="picture-card"
          maxCount={1}
          fileList={fileList}
          beforeUpload={(file) => {
            return false;
          }}
          onChange={({ fileList }) => {
            setFileList(fileList);
            if (fileList.length > 0) {
              form.setFieldsValue({ image: fileList[0] });
            }
          }}
        >
          {fileList.length >= 1 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Card title="Attributes" style={{ marginBottom: 16 }}>
        {attributes.map((attr:any, idx:any) => (
          <div key={idx} style={{ marginBottom: 12 }}>
            <Space align="baseline">
              <Input
                placeholder="Attribute Name"
                value={attr.key}
                onChange={e => handleAttributeChange(idx, 'key', e.target.value)}
                style={{ width: 150 }}
              />
              {attr.values.map((val:any, vIdx:any) => (
                <Space key={vIdx}>
                  <Input
                    placeholder="Value"
                    value={val}
                    onChange={e => handleValueChange(idx, vIdx, e.target.value)}
                    style={{ width: 150 }}
                  />
                  {attr.values.length > 1 && (
                    <Button size="small" onClick={() => handleRemoveValue(idx, vIdx)}>-</Button>
                  )}
                </Space>
              ))}
              {attributes.length > 1 && (
                <Button size="small" danger onClick={() => handleRemoveAttribute(idx)}>Remove</Button>
              )}
            </Space>
          </div>
        ))}
        <Button type="dashed" onClick={handleAddAttribute} style={{ marginTop: 8 }}>
          Add Attribute
        </Button>
      </Card>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialData ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;