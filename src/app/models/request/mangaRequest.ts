export class MangaRequest {
    public id: string;
    public title: string ;
    public author: string;
    public photo: string;
    public tome: number;
    public description: string;
    public genre: string;
    public userId: string;

    public constructor(data: any) {
        this.photo = '';
        if (data !== undefined) {
            this.id = data.id;
            this.author = data.author;
            this.userId = data.userId;
            this.title = data.title;
            this.photo = data.photo;
            this.tome = data.tome;
            this.description = data.description;
            this.genre = data.genre;
        }
    }
}
