export class LoginRequest {
    public email: string;
    public password: string;

    constructor(data: any) {
        if (data !== undefined) {
            this.email = data.email;
            this.password = data.password;
        }
    }
}
