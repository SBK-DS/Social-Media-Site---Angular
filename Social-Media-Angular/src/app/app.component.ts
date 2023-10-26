import { Component, ViewChild  } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { AuthenticationComponent } from 'src/app/tools/authentication/authentication.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore'
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Social-Media-Angular';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore()
  userHasProfile: boolean = false
  private static userDocument: UserDocument | null = null
  loggedIn$ = new BehaviorSubject<boolean>(false);

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
              // console.log('checking post feed ' + this.postFeed)
              AppComponent.userDocument = null
              this.loggedIn$.next(false)
            },
            
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"])
            },

            whenSignedInAndEmailVerified: user => {
              this.getUserProfile()
              this.loggedIn$.next(true)
            },
            
            whenChanged: user => {
              
            }

          }
        )
      }
    )
  }

  public static getUserDocument(): UserDocument | null {
    return AppComponent.userDocument
  }

  getUserName() {
    try {
      return AppComponent.userDocument?.publicName
    } catch(error) {
      return alert(error)
    }
  }

  getUserProfile() {

    if (this.auth !== null && this.auth.getAuth() !== null) {
      let currentUser = this.auth.getAuth().currentUser;
      if (currentUser) {
        console.log(currentUser.uid)
        this.firestore.listenToDocument({
          name: "Getting Document",
          path: ["Users", currentUser.uid],
          onUpdate: (result) => {
            AppComponent.userDocument = <UserDocument>result.data()
            this.userHasProfile = result.exists 
            if(currentUser) {
              AppComponent.userDocument.userId = currentUser.uid
            } 
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
    // this.postFeed.getPosts()
  }

}

export interface UserDocument {
  publicName: string;
  description: string;
  userId: string
}
