export class CartBookVO {
  constructor(
    public _id: string,
    public name: string,
    public nuOfCopies: number,
    public price: number,
    public imageFolderName: string,
    public availableCopies: number,
  ) {}
}
