import {  getApi,postApi,putApi } from "../apis";

const getProduct = async (url:string,query?:any) => {
    return await getApi(url,query);
    
}

export const getProductImageUrl = (productId: string) => {
  if (!productId) return '';
  return `${process.env.REACT_APP_API_ENDPOINT}/product/image/${productId}`;
};

const createProduct = async (url: string, data: any) => {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    
    // Add image file if it exists
    if (data.image && data.image.originFileObj) {
      console.log("Daataaaa");
      
      formData.append('image', data.image.originFileObj);
    }
    
    // Add attributes as JSON string
    if (data.attributes) {
      formData.append('attributes', JSON.stringify(data.attributes));
    }
    
    return await postApi(url, formData, true);
  };

const updateProduct = async (url: string, data: any) => {
    const formData = new FormData();
    
    // Add id and text fields
    formData.append('id', data.id);
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    
    // Add image file if it exists
    if (data.image && data.image.originFileObj) {
      formData.append('image', data.image.originFileObj);
    }
    
    // Add attributes as JSON string
    if (data.attributes) {
      formData.append('attributes', JSON.stringify(data.attributes));
    }
    
    return await putApi(url, formData, true);
  };

export {getProduct,createProduct,updateProduct}



