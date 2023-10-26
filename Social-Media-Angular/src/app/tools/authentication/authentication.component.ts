import { Component } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'
import { MatBottomSheet } from '@angular/material/bottom-sheet'


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})

export class AuthenticationComponent {
  
  state = AuthenticatorCompState.LOGIN;
  firebaseAuth!: FirebaseTSAuth;

  constructor(private bottomSheetRef: MatBottomSheet) {
    this.firebaseAuth = new FirebaseTSAuth()
  }

  isNotEmpty(text: string) {
    return text != null && text.length > 0;
  }

  isAMatch(text: string, comparedWith: string) {
    return text === comparedWith
  }

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

  onResetClick(
    resetEmail: HTMLInputElement
  ) {
    let email = resetEmail.value 
    if(this.isNotEmpty(email)) {
      this.firebaseAuth.sendPasswordResetEmail({
        email: email,
        onComplete: (oc) => {
          this.bottomSheetRef.dismiss()
          alert(`email sent to ${email}`)
          
        },
      })
    }
  }

  onLogin(
    loginEmail: HTMLInputElement, 
    loginPassword: HTMLInputElement
  ){
    let email = loginEmail.value
    let password = loginPassword.value

    if(
      this.isNotEmpty(email)
      &&
      this.isNotEmpty(password)
    ) {
      this.firebaseAuth.signInWith(
        {
          email: email,
          password: password,
          onComplete: (oc) => {
            alert("Logged In")
            this.bottomSheetRef.dismiss()
            loginEmail.value = ""
            loginPassword.value = ""
            
          },
          onFail: (err) => {alert(err)}
        }
      )
    }
  }

  onRegisterClick(
    registerEmail: HTMLInputElement,
    registerPassword: HTMLInputElement,
    registerConfirmPassword: HTMLInputElement
  ) {
    
    let email = registerEmail.value
    let password = registerPassword.value
    let confirmPass = registerConfirmPassword.value

    if(
      this.isNotEmpty(email) 
      && 
      this.isNotEmpty(password)
      &&
      this.isNotEmpty(confirmPass)
      &&
      this.isAMatch(password, confirmPass)
      ) {

    }

    this.firebaseAuth.createAccountWith(
      {
        email: email,
        password: password,
        onComplete: (oc) => {
          alert("Account created")
          this.bottomSheetRef.dismiss()
          registerEmail.value = ""
          registerPassword.value = ""
          registerConfirmPassword.value = ""
        },
        onFail: (err) => {
          alert("Failed to create the account.")
        }
      }
    )
  }
}


export enum AuthenticatorCompState {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}
