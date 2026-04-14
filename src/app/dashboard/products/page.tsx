"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { ProductsResponse } from "@/types/product";
import { ProductCard } from "@/components/dashboard/product-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, Package, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserFormModal } from "@/components/dashboard/user-form-modal";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const { data, isLoading, isError, refetch } = useQuery<ProductsResponse>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await apiClient.get("/products");
      return response.data;
    },
  });

  const products = data?.products || [];

  const filteredProducts = products
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.title.localeCompare(b.title);
      return 0;
    });

  if (isError) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <Package className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">Failed to load products</h3>
          <p className="text-sm text-zinc-500">There was an error fetching the items from the API.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2 border-zinc-800">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pb-16">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Fleet Inventory</h1>
            <p className="text-zinc-500">Real-time oversight of available vehicles, parts, and technical specifications.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search products..."
                className="border-zinc-800 bg-zinc-900/50 pl-10 text-white ring-offset-zinc-950 focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value || "default")}>
                <SelectTrigger className="w-full border-zinc-800 bg-zinc-900/50 text-zinc-300 sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-300">
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <UserFormModal />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-zinc-800 p-4">
                <Skeleton className="aspect-square w-full rounded-lg bg-zinc-900" />
                <Skeleton className="h-4 w-2/3 bg-zinc-900" />
                <Skeleton className="h-4 w-1/3 bg-zinc-900" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-6 w-16 bg-zinc-900" />
                  <Skeleton className="h-8 w-20 bg-zinc-900" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex h-[40vh] flex-col items-center justify-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-500">
              <Package className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-white">No products found</p>
              <p className="text-sm text-zinc-500">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
