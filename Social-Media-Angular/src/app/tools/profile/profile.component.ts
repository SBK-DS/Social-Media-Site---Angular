import { Component, Input } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  @Input() show!: boolean

  firestore!: FirebaseTSFirestore
  auth!: FirebaseTSAuth

  constructor() {
    this.firestore = new FirebaseTSFirestore()
    this.auth = new FirebaseTSAuth()
  }

  onContinueClick(
    nameInput: HTMLInputElement,
    descriptionInput: HTMLTextAreaElement
  ) {
    let name = nameInput.value;
    let description = descriptionInput.value;
  
    if (this.auth !== null && this.auth.getAuth() !== null) {
      let currentUser = this.auth.getAuth().currentUser;
      if (currentUser !== null) {
        let uid = currentUser.uid;
  
        this.firestore.create({
          path: ["Users", uid],
          data: {
            publicName: name,
            description: description
          },
          onComplete: (docId) => {
            alert('Profile Created in Firestore')
            nameInput.value = ""
            descriptionInput.value = ""
          },
          onFail: (err) => {
            // Handle failure
            alert(err)
          }
        });
      } else {
        console.error('Current user is null');
      }
    } else {
      console.error('Authentication service or user is null');
    }
  }
  
}