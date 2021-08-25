import { JwtHelperService } from '@auth0/angular-jwt';

export abstract class JwtHelper {

    private static jwtHelper: JwtHelperService = null;

    public static isAuth(jwtToken: string) {
        if(this.jwtHelper == null) {
            this.jwtHelper = new JwtHelperService();
        }
        return !this.jwtHelper.isTokenExpired(jwtToken);
    }

}
