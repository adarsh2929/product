import { ChangeEvent } from "react";

export interface ProductData {
    id: string;
    name: string;
    image: string;
    price: number;
    attributes?: any;
  }
  
  export interface ProductTableProps {
    products: ProductData[];
    onEdit: (product: ProductData) => void;
    loading: boolean;
    total: number;
    page: number;
    pageSize: number;
    // modifyPageSize: (pageSize: number) => void;
    performSearchHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    searchValue: string;
    handleDateRangeChange: (startDate: string | undefined, endDate: string | undefined) => void;
    paginationChangeHandler: (pageNo: number, pageSize: number) => void;
  }
  