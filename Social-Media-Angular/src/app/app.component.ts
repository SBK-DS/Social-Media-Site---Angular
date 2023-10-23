import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { AuthenticationComponent } from 'src/app/tools/authentication/authentication.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Social-Media-Angular';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore
  userHasProfile: boolean = false
  userDocument!: UserDocument

  constructor(
    private loginSheet: MatBottomSheet,
    private router: Router
    ){
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
              // alert('Logged In')
            },
            whenSignedOut: user => {
            },
            
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"])
            },

            whenSignedInAndEmailVerified: user => {
              this.getUserProfile()
            },
            
            whenChanged: user => {
              
            }

          }
        )
      }
    )
  }

  getUserProfile() {

    if (this.auth !== null && this.auth.getAuth() !== null) {
      let currentUser = this.auth.getAuth().currentUser;
      if (currentUser !== null) {
        console.log(currentUser.uid)
        this.firestore.listenToDocument({
          name: "Getting Document",
          path: ["Users", currentUser.uid],
          onUpdate: (result) => {
            this.userDocument = <UserDocument>result.data()
            this.userHasProfile = result.exists 
            console.log('user profile found ? : ', this.userHasProfile)
            if(this.userHasProfile) {
              this.router.navigate(["postFeed"])
            } 
          },
    
        })
      }}
  }

  loggedIn() {
    return this.auth.isSignedIn()
  }

  onLoginClick() {
    this.loginSheet.open(AuthenticationComponent)
  }

  onLogoutClick() {
    this.auth.signOut()
  }

}

export interface UserDocument {
  publicName: string;
  description: string;
}
