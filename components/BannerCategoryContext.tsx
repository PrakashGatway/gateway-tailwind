"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type CategoryValue = { path: string; name: string | null };
type BannerCategoryContextValue = {
  categoryName: string | null;
  setCategoryForPath: (path: string, name: string | null) => void;
};

const BannerCategoryContext = createContext<BannerCategoryContextValue | null>(null);

export function BannerCategoryProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const [category, setCategory] = useState<CategoryValue | null>(null);

  const setCategoryForPath = useCallback((path: string, name: string | null) => {
    setCategory({ path, name: name?.trim() || null });
  }, []);

  return (
    <BannerCategoryContext.Provider value={{
      categoryName: category?.path === pathname ? category.name : null,
      setCategoryForPath,
    }}>
      {children}
    </BannerCategoryContext.Provider>
  );
}

export function useBannerCategory() {
  const context = useContext(BannerCategoryContext);
  if (!context) throw new Error("useBannerCategory must be used within BannerCategoryProvider");
  return context;
}
