
export interface ProductData {
    id: string;
    name: string;
    image: string;
    price: number;
    attributes?: Array<{
      name: string;
      values: string[];
    }>;
  }