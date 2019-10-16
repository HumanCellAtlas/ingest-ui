import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {
  AuthConfig,
  JwksValidationHandler,
  OAuthService,
  OAuthSuccessEvent,
  ValidationParams
} from "angular-oauth2-oidc";
import {BehaviorSubject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

// Workaround for issue: https://github.com/manfredsteyer/angular-oauth2-oidc/issues/466
class CustomJwksValidationHandler extends JwksValidationHandler {
  async validateAtHash(params: ValidationParams): Promise<boolean> {
    return true;
  }
}

export const authCodeFlowConfigTest: AuthConfig = {
  // issuer: 'https://auth.integration.data.humancellatlas.org/',
  issuer: 'https://humancellatlas.auth0.com',
  redirectUri: 'http://myapp.example:4200',
  // redirectUri: 'http://localhost:4200',
  clientId: 'ycbt5RBAgfjxdrVTcom976IQejacp2VN',
  // responseType: 'code',
  scope: 'openid profile read:profile email',
  showDebugInformation: true,
  disableAtHashCheck: true,
  silentRefreshRedirectUri: 'http://myapp.example:4200' + '/silent-refresh.html',
  skipIssuerCheck: true,
  silentRefreshMessagePrefix: '?',
  // sessionChecksEnabled: true
  // silentRefreshRedirectUri: 'http://localhost:4200' + '/silent-refresh.html'
};

//
// export const authCodeFlowConfig: AuthConfig = {
//   issuer: 'https://' + environment.AUTH_DOMAIN,
//   issuer: 'humancellatlas.auth0.com',
//   redirectUri: window.location.origin,
//   clientId: 'ycbt5RBAgfjxdrVTcom976IQejacp2VN',
//   responseType: 'code',
//   scope: 'openid profile read:profile email offline_access',
//   showDebugInformation: true,
//   disableAtHashCheck: true,
//   skipIssuerCheck: true
// };


@Injectable()
export class AuthService {

  userProfile: BehaviorSubject<object>;
  authenticated: boolean;
  private discoveryDocument: object;

  //TODO make oauth service private, making public for now for testing
  constructor(private router: Router, public oauthService: OAuthService, private http: HttpClient) {
    this.userProfile = new BehaviorSubject({});
    this.oauthService.configure(authCodeFlowConfigTest);
    this.oauthService.tokenValidationHandler = new CustomJwksValidationHandler();
    this.oauthService.loadDiscoveryDocument().then(
      (doc:OAuthSuccessEvent) => {
        this.discoveryDocument = doc.info.discoveryDocument;
        this.authenticate();
      });
  }

  authenticate() {
    const callbackParams =  window.location.hash || '#' + window.location.search
    this.oauthService.tryLogin({customHashFragment: callbackParams}).then(
      (success) => {
        if (success) {
          this.oauthService.setupAutomaticSilentRefresh();
          if (this.hasValidAccessToken()) {
            this.oauthService.loadUserProfile().then((userInfo) => {
              this.userProfile.next(userInfo);
            });
            this.router.navigate(['/home']);
          } else {
            this.authenticated = true
            this.router.navigate(['/login']);
          }
        }
      },
      (err) => {
        console.log('Error loading auth config', err);
        this.router.navigate(['/login']);
      });
  }

  login(): void {
    this.oauthService.initLoginFlow();
  }

  getProfile(): BehaviorSubject<object> {
    return this.userProfile;
  }

  logout(): void {
    // this.revokeToken().subscribe(
    //   (res) => {
    //     this.router.navigate(['/login']);
    //
    //   },
    //   (err) => {
    //     console.log('Error in revoking refresh token', err)
    //     this.router.navigate(['/login']);
    //   }
    // );

    this.clearBrowser();

  }

  clearBrowser() {
    this.oauthService.logOut();
  }

  hasValidAccessToken(): boolean {
    const expiresAt = this.oauthService.getAccessTokenExpiration();
    return new Date().getTime() < expiresAt;
  }

  revokeToken() {
    const revoke_endpoint = this.discoveryDocument['revocation_endpoint'];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    const body = {
      client_id: authCodeFlowConfigTest.clientId,
      token: this.oauthService.getRefreshToken()
    };
    console.log('revoke url', revoke_endpoint);
    console.log('body', body);

    return this.http.post(revoke_endpoint, body, httpOptions);
  }

  refreshToken() {
    this.oauthService.silentRefresh();
  }

}
