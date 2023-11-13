import { Component, ViewChild, OnDestroy  } from '@angular/core';
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
  userHasProfile!: boolean
  private static userDocument: UserDocument | null = null
  loggedIn$ = new BehaviorSubject<boolean>(false);
  private userProfileListener: any

  constructor(
    private loginSheet: MatBottomSheet,
    private router: Router,
    ){
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
              // alert('Logged In')
              console.log('this.userProfileListener before unsubscribe : ', this.userProfileListener())
              console.log('this.userProfileListener after unsubscribe : ', this.userProfileListener())
            },
            whenSignedOut: user => {
              // console.log('checking post feed ' + this.postFeed)
              this.loggedIn$.next(false)
              if(this.userProfileListener) {
                this.userProfileListener.unsubscribe()
              }
              else
              {
                AppComponent.userDocument = null
                console.log('this.userProfileListener after unsubscribe : ', this.userProfileListener)
              }
              this.router.navigate([""])
              console.log('this.userProfileListener before unsubscribe : ', this.userProfileListener)
              console.log('AppComponent : ' + AppComponent.userDocument)
              
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

  async getUserProfile() {
    if (this.auth !== null && this.auth.getAuth() !== null) {
      let currentUser = this.auth.getAuth().currentUser;
      if (currentUser) {
        console.log(currentUser.uid)
        try {
          this.userProfileListener = await this.firestore.listenToDocument({
            name: `Getting Document for ${currentUser.uid}${new Date().toISOString()}`,
            path: ["Users", currentUser.uid],
            onUpdate: (result) => {
              if(currentUser) {
                this.userHasProfile = result.exists
                AppComponent.userDocument = <UserDocument>result.data() 
                AppComponent.userDocument.userId = currentUser.uid
              } 
              console.log('user profile found ? : ', this.userHasProfile)
              if(this.userHasProfile) {
                this.router.navigate(["postFeed"])
              } 
            },

      
          })
        }
        catch (error) {
          console.log("Error in retrieving userProfile", error)
        }
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

  openProfilePage() {
    console.log("profile page called!")
    this.router.navigate(["profile"])
  }

  // ngOnDestroy() {
  //   if (this.userProfileListener) {
  //     this.userProfileListener(); // Call the unsubscribe function
  //   }
  // }

}

export interface UserDocument {
  publicName: string;
  description: string;
  userId: string
}
