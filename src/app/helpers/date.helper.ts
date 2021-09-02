import moment from 'moment';
import 'moment-timezone';

export class DateHelper {

    public static toLocal(date: any): Date {
        let tmp = moment.utc(date).toDate().toUTCString();
        let tmpLocal = moment(tmp).tz('Europe/Paris').toDate();
        return new Date(tmpLocal);
    }
}
