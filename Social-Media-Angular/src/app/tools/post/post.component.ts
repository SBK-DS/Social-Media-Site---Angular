import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import { FirebaseTSFirestore, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';
import { AppComponent } from 'src/app/app.component';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() postData!: PostData
  firestore = new FirebaseTSFirestore();
  createrName!: string
  createrDescription!: string
  isLiked: boolean = false
  likedId: string = ""
  likeCountNumber: number = 0;
  auth = new FirebaseTSAuth();
  constructor(
    private dailog: MatDialog,
    ) {}

  ngOnInit(): void {
    console.log(this.postData)
    this.getCreatorInfo()
    this.likedPost()
    this.likeCount()
  }

  likeCount() {
    if (this.auth !== null && this.auth.getAuth() !== null) {
      let currentUser = this.auth.getAuth().currentUser;
      if (currentUser !== null) {
        this.firestore.getCollection(
          {
            path: ["Posts", this.postData.postId, "PostLikes"],
            where: [
              
            ],
            onComplete: (result) => {
              console.log('Like count : ', result)
              this.likeCountNumber = result.size
            }
          }
        )
      }}
  }

  onReplyClick() {
    this.dailog.open(ReplyComponent, {data: this.postData.postId})
  }
  onLikeClick() {
    if(this.isLiked) {
      this.isLiked = false
      this.onDisLike()
      // this.likeCount()
    }
    else {
      this.isLiked = true
      this.onLikeClickSend()
      // this.likeCount()
    }
    this.likeCount()
  }

  likedPost() {
    if (this.auth !== null && this.auth.getAuth() !== null) {
      let currentUser = this.auth.getAuth().currentUser;
      if (currentUser !== null) {
        this.firestore.getCollection(
          {
            path: ["Posts", this.postData.postId, "PostLikes"],
            where: [
              new Where("userId", "==", `${currentUser.uid}`)
            ],
            onComplete: (result) => {
              console.log("user like found ? ", result.docs[0].exists)
              if(result.docs[0].exists) {
                this.likedId = result.docs[0].id
                this.isLiked = true
              }
              else {
                this.isLiked = false
              }
            }
          }
        )
      }}

  }

  commentedPost() {}

  onLikeClickSend() {
    console.log("likedId ", this.likedId)
    this.firestore.create(
      {
        path: ["Posts", this.postData.postId, "PostLikes"],
        data: {
          userId: AppComponent.getUserDocument()?.userId,
          userName: AppComponent.getUserDocument()?.publicName,
          timestamp: FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete: (docId) => {
          alert(docId)
          this.likedPost()
        }
      }
    )
  }

  onDisLike() {
    if (this.auth !== null && this.auth.getAuth() !== null) {
      let currentUser = this.auth.getAuth().currentUser;
      if (currentUser !== null) {
        this.firestore.delete(
          {
            path: ["Posts", this.postData.postId, "PostLikes", this.likedId],
            onComplete() {
              
            },
            onFail(err) {
              
            },
          }
        )
      }}
      
  }

  getCreatorInfo() {
    this.firestore.getDocument(
      {
        path: ["Users", this.postData.createrId],
        onComplete: (result) => {
          if(result.data()) {
            let userDoc = result.data()
            console.log(userDoc)
            this.createrName = userDoc?.['publicName']        
            this.createrDescription = userDoc?.['description'] 
          }          
        }
        }
    )
  }

}
