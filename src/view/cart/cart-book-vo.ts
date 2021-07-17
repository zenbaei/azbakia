export class CartBookVO {
  constructor(
    public _id: string,
    public name: string,
    public requestedCopies: number,
    public price: number,
    public imageFolderName: string,
    public inventory: number,
  ) {}
}
