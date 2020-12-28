import {_id} from 'zenbaei-js-lib/utils';

export class Cart extends _id {
  since!: number;

  constructor(public bookName: string, public userEmail: string) {
    super();
    this.since = Date.now();
  }
}
