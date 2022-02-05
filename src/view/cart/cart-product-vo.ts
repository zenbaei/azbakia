export class CartProductVO {
  constructor(
    public _id: string,
    public name: string,
    public quantity: number,
    public price: number,
    public inventory: number,
    public description: string,
    public language: Language,
  ) {}
}
