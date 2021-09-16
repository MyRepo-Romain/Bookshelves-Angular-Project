export class MangaResponse {
    public id: string;
    public title: string ;
    public author: string;
    public photo: string;
    public tome: number;
    public description: string;
    public genre: string;
    public userId: string;

    public constructor(dx: any) {
        if (dx !== undefined) {
            let data = dx.data();
            this.id = dx.id;
            this.userId = data.userId;
            this.title = data.title;
            this.author = data.author;
            this.photo = data.photo;
            this.tome = data.tome;
            this.description = data.description;
            this.genre = data.genre;
        }
    }
}
