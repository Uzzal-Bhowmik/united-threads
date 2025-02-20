export type TProduct = {
  _id: string;
  user: string;
  name: string;
  description: string;
  shortDescription: string;
  images: {
    url: string;
    key: string;
  };
  primaryImage?: string;
  category: string;
  stock: number;
  price: number;
  size: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  colorsPreferences: string[];
  rating?: number;
  salesCount?: number;
  reviewCount?: number;
};
