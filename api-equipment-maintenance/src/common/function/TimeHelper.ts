import * as moment from 'moment';
export class TimeHelper {
  //TODO
  getNow() {
    const currentUtcOffset = moment().utcOffset();
    const from = moment(new Date()).utcOffset(currentUtcOffset);
    return from;
  }
  addMinus(date: Date, minus: number) {
    return date.setTime(date.getTime() + minus * 60 * 1000);
  }
}

