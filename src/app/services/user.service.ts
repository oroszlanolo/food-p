// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let google: any;
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TokenPayload, User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  serverLoginUrl = `${environment.serverPath}api/login`;

  googleReadyEvt = new EventEmitter<void>();
  loginEvt = new EventEmitter<void>();
  googleReady = false;
  user?: User;
  accessToken?: string;

  get loggedIn(): boolean {
    return this.user !== undefined;
  }

  constructor(private http: HttpClient) {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      this.accessToken = accessToken;
      this.user = this.convertToUser(this.decodeJWTToken(accessToken));
      console.log('user retrieved from storage');
    } else {
      // @ts-expect-error google login stuff
      window.onGoogleLibraryLoad = () => {
        console.log('google library loaded');
        google.accounts.id.initialize({
          client_id: '406074535204-tnrjrd519js21j2c6iql44akg97qhlv3.apps.googleusercontent.com',
          callback: (resp: unknown) => this.handleOauthResponse(resp),
        });
        this.googleReady = true;
        this.googleReadyEvt.emit();
        google.accounts.id.prompt();
      };
    }
  }

  logout() {
    sessionStorage.removeItem('accessToken');
  }

  private decodeJWTToken(token: string): TokenPayload {
    return JSON.parse(atob(token.split('.')[1]));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleOauthResponse(response: any) {
    // console.log(response);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: response.credential,
      }),
    };
    return this.http.get(this.serverLoginUrl, httpOptions).subscribe({
      next: () => {
        this.accessToken = response.credential;
        const responsePayload = this.decodeJWTToken(response.credential);
        console.log(responsePayload);
        console.log(JSON.stringify(responsePayload));
        this.user = this.convertToUser(responsePayload);
        sessionStorage.setItem('accessToken', response.credential);
        this.loginEvt.emit();
      },
      error: () => {
        console.log('error logging in');
      },
    });
  }

  private convertToUser(usr: TokenPayload): User {
    return {
      id: usr.sub,
      email: usr.email,
      family_name: usr.family_name,
      given_name: usr.given_name,
      name: usr.name,
      picture: usr.picture,
    };
  }
}
