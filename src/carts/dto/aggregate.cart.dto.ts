export class aggregateCartDto {
  _id: string;

  items: [
    {
      product: object;
      quantity: number;
      itemPrice: number;
    },
  ];

  totalQuantity: number;
  totalPrice: number;
  shipping: number;
  orderPrice: number;
}
