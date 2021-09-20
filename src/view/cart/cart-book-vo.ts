export class CartBookVO {
  constructor(
    public _id: string,
    public name: string,
    public quantity: number,
    public price: number,
    public imageFolderName: string,
    public inventory: number,
  ) {}
}
