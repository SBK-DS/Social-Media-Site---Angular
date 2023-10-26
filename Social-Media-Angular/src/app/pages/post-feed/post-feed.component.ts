import { Component, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from 'src/app/tools/create-post/create-post.component';
import { FirebaseTSFirestore, Limit, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {

  firestore = new FirebaseTSFirestore()
  auth = new FirebaseTSAuth()
  posts: PostData[] = []
  userLoggedIn: boolean = false
  
  constructor(
    private dailog: MatDialog,
    private appComponent: AppComponent  // Injecting the parent component
  ) {
    this.appComponent.loggedIn$.subscribe(loggedIn => {
      this.userLoggedIn = loggedIn;
      if (loggedIn) {
        this.getPosts();  // Call getPosts() when the user logs in
      } else {
        this.posts = [];  // Clear posts when the user logs out
      }
    });
  }
  ngOnInit(): void {
    // this.getPosts()
  }
  
  onCreatePostClick() {
    this.dailog.open(CreatePostComponent)
  }

  getPosts() {
    console.log("getPosts function called")
    // console.log("app component ", this.appComponent)
    if (this.auth !== null && this.auth.getAuth() !== null) {
      let currentUser = this.auth.getAuth().currentUser;
      if (currentUser !== null) {
        this.firestore.getCollection(
          {
            path: ["Posts"],
            where: [
              // new Where("CreatorId", "==", "abcadsafsafsafd"),
              new OrderBy("timestamp", "desc"),
              new Limit(10)
            ],
            onComplete: (result) => {
              result.docs.forEach((doc) => {
                let post = <PostData>doc.data()
                post.postId = doc.id
                this.posts.push(post)
              })
            },
            onFail: (err) => {
    
            }
          }
        )
      }
    }
  }

}

export interface PostData {
  comment: string,
  createrId: string,
  imageUrl?: string,
  postId: string;
}
