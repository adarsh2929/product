import { ChangeEvent } from "react";
export interface SearchProductProps  {
  performSearchHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  searchValue: string;
}
