export type Cart = {
  products: CartProduct[];
  date: Date;
};

export type CartProduct = {
  productId: string;
  quantity: number;
};
