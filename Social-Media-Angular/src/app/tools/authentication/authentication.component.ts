import { Component } from '@angular/core';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})

export class AuthenticationComponent {
  
  state = AuthenticatorCompState.LOGIN;

  constructor() {}

  onForgotPasswordClick() {
    this.state = AuthenticatorCompState.FORGOT_PASSWORD
  }
  onCreateAccountClick() {
    this.state = AuthenticatorCompState.REGISTER
  }
  onLoginClick(){
    this.state = AuthenticatorCompState.LOGIN
  }

  isLoginState() {
    return this.state == AuthenticatorCompState.LOGIN
  }

  isRegisterState() {
    return this.state == AuthenticatorCompState.REGISTER
  }

  isForgotPasswordState() {
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD
  }

  getStateText(){
    switch(this.state)
    {
      case AuthenticatorCompState.LOGIN:
        return 'Login'
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return 'Forgot Password'
      case AuthenticatorCompState.REGISTER:
        return 'Register'
    }
  }
}

export enum AuthenticatorCompState {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}