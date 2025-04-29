import { useState, useEffect, ChangeEvent } from 'react';
import {  Button, message } from 'antd';
import { useDebounce } from "use-debounce";
import ProductTable from './ProductTable';
import { ProductData } from './types';
import { getProduct } from '../../API/productAPI';
import ProductModal from './ProductModel';

const Product = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = {
        page: currentPage,
        pageSize: pageSize,
        name: debouncedSearchValue,
        startDate,
        endDate
      }
      const response = await getProduct('/product/products',query);
      setProducts(response.data.data.data);
      setTotal(response.data.data.total);
    } catch (error) {
      message.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchValue, startDate, endDate, pageSize,currentPage]);

  const formatAttributesForForm = (attributeArray: any[] = []): { key: string; values: string[] }[] => {
    if (!attributeArray.length) return [];
    
    // Group attributes by attribute name
    const groupedAttributes = attributeArray.reduce((acc: any, item: any) => {
      const attrName = item.attributeValue.attribute.name;
      const attrValue = item.attributeValue.value;
      
      if (!acc[attrName]) {
        acc[attrName] = {
          key: attrName,
          values: []
        };
      }
      
      acc[attrName].values.push(attrValue);
      return acc;
    }, {});
    
    return Object.values(groupedAttributes);
  };

  const handleEdit = (product: ProductData) => {
    const formattedProduct = {
      ...product,
      attributes: formatAttributesForForm(product.attributes)
    };

    console.log("formattedProduct",formattedProduct)

    setEditProduct(formattedProduct);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditProduct(null);
  };

  const handleSuccess = () => {
    fetchProducts();
  };

  
  const performSearchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (newStartDate: string | undefined, newEndDate: string | undefined) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setCurrentPage(1);
  };

  const paginationChangeHandler = (pageNo: number, pageSize: number) => {
    setCurrentPage(pageNo);
    setPageSize(pageSize);
  };


  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={handleAdd}>
          Add Product
        </Button>
      </div>
      
      
      <ProductTable 
        products={products} 
        loading={loading}
        onEdit={handleEdit} 
        performSearchHandler={performSearchHandler}
        searchValue={searchValue}
        handleDateRangeChange={handleDateRangeChange}
        total={total}
        page={currentPage}
        pageSize={pageSize}
        paginationChangeHandler={paginationChangeHandler}
      />
      
      <ProductModal
        isVisible={modalVisible}
        onClose={handleModalClose}
        productData={editProduct}
        isEdit={!!modalVisible}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Product;