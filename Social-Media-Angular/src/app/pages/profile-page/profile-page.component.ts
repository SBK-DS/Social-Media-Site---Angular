import { Component, Injectable, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { PostData, PostFeedComponent } from '../post-feed/post-feed.component';
import { FirebaseTSApp} from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {

  firestore = new FirebaseTSFirestore()
  auth = new FirebaseTSAuth()
  userName!: string;
  userDesc!: string;
  isEdit: boolean = true;
  posts: PostData[] = []
  isPosts: boolean = false
  
  constructor() {
    console.log(AppComponent.getUserDocument()?.description)
  }

  ngOnInit(): void {
    
    this.userName = <string>AppComponent.getUserDocument()?.publicName

    this.userDesc = <string>AppComponent.getUserDocument()?.description

    console.log(this.userName, this.userDesc)

    this.getCurrentUserPosts()

  }

  onEditClick(event: Event, profileName: HTMLInputElement, profileDesc: HTMLInputElement) {
    
    event.preventDefault()

    if(this.isEdit) { 
      this.onEditDoneClick(profileName.value, profileDesc.value)
      this.isEdit = false
    }
    else {
      this.isEdit = true
      this.postNewProfile()
    }
  }

  onEditDoneClick(profileName: string, profileDesc: string) {
    if(this.isEdit)
    {
      this.userName = profileName
      this.userDesc = profileDesc
    }
  }

  getCurrentUserPosts() {
    this.posts = PostFeedComponent.currUserPosts.filter((post) => post.createrId === <string>AppComponent.getUserDocument()?.userId)
    console.log(this.posts)

    if(this.posts.length > 0) {this.isPosts = true}
    else {this.isPosts = false}
  }

  postNewProfile() {
    if (this.auth !== null && this.auth.getAuth() !== null) {
      const currentUser = this.auth.getAuth().currentUser;
      if (currentUser !== null) {
        // this.firestore.getCollection(
        //   {
        //     path: ["Posts"],
        //     where: [
        //       // new Where("CreatorId", "==", "abcadsafsafsafd"),
        //       new OrderBy("timestamp", "desc"),
        //       new Limit(10)
        //     ],
        //     onComplete: (result) => {
        //       result.docs.forEach((doc) => {
        //         let post = <PostData>doc.data()
        //         post.postId = doc.id
        //         this.posts.push(post)
        //       })
        //     },
        //     onFail: (err) => {
    
        //     }
            
        //   }
        // )
        this.firestore.update(
          {
            path: ["Users", currentUser.uid],
            data: {
              publicName: this.userName,
              description: this.userDesc
            },
            onComplete: (doc) => {
              alert("User updated!")
              console.log('User Detail updated : ', doc)
            },
            onFail: (error) => {
              alert("User not updated!")
              console.log("User Detail not updated", error)
            }
          }
        )
      }
    }
  }

}
