export class NewspaperRequest {
    public id: string;
    public title: string ;
    public photo: string;
    public description: string;
    public date: Date;
    public userId: string;

    public constructor(data: any) {
        this.photo = '';
        if (data !== undefined) {
            this.id = data.id;
            this.userId = data.userId;
            this.title = data.title;
            this.photo = data.photo;
            this.date = data.date;
            this.description = data.description;
        }
    }
}
