export class ErrorTypeHelper {

    static GLOBAL_ERROR = class {
        public static missingField: any = { code: 'missing_field', msg: 'Ce champ ne peut pas être vide' };
        public static invalidEmail: any = { code: 'invalid_email', msg: `L'email est invalide` };
        public static missingFileSelection: any = { code: 'missing_selection', msg: 'Vous devez selectionner un fichier' };
        public static invalidNumberNotZero: any = { code: 'invalid_number_not_zero', msg: 'Vous devez saisir un nombre supérieur à zéro' };
        public static invalidDate: any = { code: 'invalid_date', msg: 'Vous devez saisir une date' };
        public static wrongConfirmEmail: any = { code: 'wrong_confirm_email', msg: 'L\'email saisie ne correspond pas' };
        public static wrongConfirmPassword: any = { code: 'wrong_confirm_password', msg: 'Le mot de passe saisie ne correspond pas' };
        public static toWeakPassword: any = { code: 'to_weak_password', msg: 'Le mot de passe saisie doit contenir au moins 8 caractères et au moins une majuscule, un nombre et un caractère spécial' };
    };

    static SIGN_IN_ERROR = class {
        public static invalidAuth: any = { code: 'invalid_auth', msg: `Email ou mot de passe incorrect` };
    };

    static CREATE_USER_ERROR = class {
        public static emailAlreadyUsed: any = { code: 'email_already_used', msg: 'Cette adresse e-mail est déjà utilisée' };
    };

    static FORGET_PASSWORD_ERROR = class {
        public static unknownEmail: any = { code: 'unknown_email', msg: `L'email saisi est inconnu` };
    };

    static SNACK_BAR_INFORMATION = class {
        public static deleteAccount: any = { code: 'delete_account', msg: 'Votre compte a bien été supprimé' };
        public static updateUserFail: any = { code: 'update_user_fail', msg: 'Suite à une erreur de réseau votre compte n\'as pas pus etre modifié' };
        public static updatePasswordFail: any = { code: 'update_password_fail', msg: 'Suite à une erreur de réseau votre mot de passe n\'as pas pus etre modifié' };
        public static updateMailFail: any = { code: 'update_mail_fail', msg: 'Suite à une erreur de réseau votre email n\'as pas pus etre modifié' };
    };

    static SNACK_BAR_DELETE = class {
        public static deleteAccountFail: any = { code: 'delete_account_Fail', msg: 'Vous êtes connecté depuis trop longtemps veuillez vous réauthentifié pour supprimer votre compte' };
    };

}
