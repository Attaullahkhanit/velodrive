import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { ProductsResponse } from "@/types/product";

export const useProducts = () => {
  return useQuery<ProductsResponse>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await apiClient.get("/products");
      return response.data;
    },
  });
};
