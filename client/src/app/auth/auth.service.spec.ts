import {AuthService} from './auth.service';
import {Router} from "@angular/router";

describe('AuthService', () => {
  let authorizeSpy: jasmine.Spy;
  let authenticateSpy: jasmine.Spy;
  let mockRouter: jasmine.SpyObj<Router>;
  let authService: AuthService

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj(['navigate']);
    authService = new AuthService(mockRouter)
  });

  describe('login method', function () {
    it('should redirect to fusillade and authorise the user', () => {
      authenticateSpy = spyOn(authService, 'hasValidAccessToken').and.returnValue(false);
      authorizeSpy = spyOn(authService, 'authorize');

      authService.login();

      expect(authenticateSpy).toHaveBeenCalledTimes(1);
      expect(authorizeSpy).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
    });

    it('should navigate to home when user is authenticated', () => {
      authenticateSpy = spyOn(authService, 'hasValidAccessToken').and.returnValue(true);
      authorizeSpy = spyOn(authService, 'authorize');

      authService.login();

      expect(authenticateSpy).toHaveBeenCalledTimes(1);
      expect(authorizeSpy).toHaveBeenCalledTimes(0);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

});
