import { Component } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage'
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {

  selectedImageFile!: File
  auth = new FirebaseTSAuth()
  firestore = new FirebaseTSFirestore()
  storage = new FirebaseTSStorage()

  constructor(private dialog: MatDialogRef<CreatePostComponent>) {

  }

  onPostClick(commentInput: HTMLTextAreaElement) {
    
    if (
      this.auth !== null 
      && 
      this.auth.getAuth() !== null
    ) {
      let currentUser = this.auth.getAuth().currentUser;
    if (currentUser !== null) 
    {
      
      let uid = currentUser.uid;

      let comment = commentInput.value
    
      if(comment.length < 1) return
  
      if(this.selectedImageFile)
      {
        this.uploadImagePost(comment, uid)
      }
      else
      {
          this.uploadPost(comment, uid)
      }
    }
  }

}

  uploadImagePost(comment: string, uid: string) {
    let postId = this.firestore.genDocId()
    this.storage.upload(
      {
        uploadName: "Upload Image Post",
        path: ["Posts", postId, "image"],
        data: {
          data: this.selectedImageFile
        },
        onComplete: (downloadURL) => {
          alert(downloadURL)
          this.firestore.create(
            {
              path: ["Posts"],
              data: {
                comment: comment,
                createrId: uid,
                imageUrl: downloadURL,
                timestamp: FirebaseTSApp.getFirestoreTimestamp()
              },
              onComplete: (docId) => {
                this.dialog.close()
              }
            }
          )
          this.dialog.close()
        }
      }
    )
  }

  uploadPost(comment: string, uid: string) {
    this.firestore.create(
      {
        path: ["Posts"],
        data: {
          comment: comment,
          createrId: uid,
          timestamp: FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete: (docId) => {
          this.dialog.close()
        }
      }
    )
  }

  onPhotoSelected(photoSelector: HTMLInputElement) {
    if (photoSelector.files && photoSelector.files.length > 0) {
      
      this.selectedImageFile = photoSelector.files[0];
      console.log(this.selectedImageFile)
      
      let fileReader = new FileReader()
      fileReader.readAsDataURL(this.selectedImageFile)
      console.log(fileReader)
      fileReader.addEventListener(
        "loadend",
        (ev) => {
          
          let readableString = fileReader.result?.toString()
          
          if(readableString) {
            let postPreviousImage = <HTMLInputElement>document.getElementById("post-preview-img")
            postPreviousImage.src = readableString
          }
        }
      )
    }
  }

}
