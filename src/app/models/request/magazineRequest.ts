export class MagazineRequest {
    public id: string;
    public title: string ;
    public photo: string;
    public page: number;
    public description: string;
    public theme: string;
    public userId: string;

    public constructor(data: any) {
        this.photo = '';
        if(data != undefined) {
            this.id = data.id;
            this.userId = data.userId;
            this.title = data.title;
            this.photo = data.photo;
            this.page = data.page;
            this.description = data.description;
            this.theme = data.theme;
        }
    }
}
