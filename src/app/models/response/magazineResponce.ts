export class MagazineResponse {
    public id: string;
    public title: string ;
    public photo: string;
    public page: number;
    public description: string;
    public theme: string;
    public userId: string;

    public constructor(dx: any) {
        if (dx != undefined) {
            let data = dx.data();
            this.id = dx.id;
            this.userId = data.userId;
            this.title = data.title;
            this.photo = data.photo;
            this.page = data.page;
            this.description = data.description;
            this.theme = data.theme;
        }
    }
}
