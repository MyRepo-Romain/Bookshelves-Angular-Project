import firebase from 'firebase';
import moment from 'moment';
import 'moment-timezone';

export class DateHelper {

    public static toLocal(date: any): Date {
        var tmp = moment.utc(date).toDate().toUTCString();
        var tmpLocal = moment(tmp).tz('Europe/Paris').toDate();
        return new Date(tmpLocal);
    }
}
