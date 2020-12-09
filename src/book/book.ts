import {_id} from 'zenbaei-js-lib/utils';

export class Book extends _id {
  constructor(
    public name: string,
    public genre: string,
    public newArrival: boolean,
    public price: number,
    public imageName: string,
  ) {
    super();
  }
}
