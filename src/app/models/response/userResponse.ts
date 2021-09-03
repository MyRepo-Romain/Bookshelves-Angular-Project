export class UserResponse {
    public displayName: string;
    public photoURL: string;

    constructor(data: any) {
        if (data != undefined) {
            this.displayName = data.displayName;
            this.photoURL = data.photoURL;
        }
    }
}

