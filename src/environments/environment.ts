// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAU8mhXTGneR_O4Xya5xbrWaruFBv9LdME",
    authDomain: "bookshelves-5fac8.firebaseapp.com",
    projectId: "bookshelves-5fac8",
    storageBucket: "bookshelves-5fac8.appspot.com",
    messagingSenderId: "75171728316",
    appId: "1:75171728316:web:7ddffa582c5d604ba0b9b9"
  },
  smartphoneWidth: 734,
  passwordRegex: new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+])(?!.*?[\s]).{8,}$/)

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance ifan error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
