export class NewspaperResponse {
    public id: string;
    public title: string ;
    public photo: string;
    public description: string;
    public date: Date;
    public userId: string;

    public constructor(dx: any) {
        if(dx != undefined) {
            var data = dx.data();
            this.id = dx.id;
            this.userId = data.userId;
            this.title = data.title;
            this.photo = data.photo;
            this.date = data.date;
            this.description = data.description;
        }
    }
}
