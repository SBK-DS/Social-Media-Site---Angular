import { Component, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from 'src/app/app.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  
  firestore = new FirebaseTSFirestore()
  comments: Comment[] = []
  @Output() childEvent = new EventEmitter();
  auth = new FirebaseTSAuth();

  constructor(@Inject(MAT_DIALOG_DATA) private postId: string, private dailog: MatDialogRef<ReplyComponent>){

  }

  ngOnInit(): void {
    this.getComments()
  }


  isCommentCreator(comment: Comment) {
    try {
      return comment.createrId == AppComponent.getUserDocument()?.userId
    }
    catch (error) {
      return error
    }

  }

  getComments() {
    this.firestore.listenToCollection(
      {
      name: "Post Comments",
      path: ["Posts", this.postId, "PostComments"],
      where: [
        new OrderBy("timestamp", "asc")
      ],
      onUpdate: (result) => {
        result.docChanges().forEach(
          postCommentDoc => {
            if(postCommentDoc.type == "added")
            {
              this.comments.push(<Comment>postCommentDoc.doc.data())
            }
          }
        )
      }
    }
    );
  }

  onSendClick(commentInput: HTMLInputElement) {
    if(commentInput.value.length < 1) return
    this.firestore.create(
      {
        path: ["Posts", this.postId, "PostComments"],
        data: {
          comment: commentInput.value,
          createrId: AppComponent.getUserDocument()?.userId,
          createrName: AppComponent.getUserDocument()?.publicName,
          timestamp: FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete: (docId) => {
          commentInput.value = ""
        }
      }
    )
  }
}

export interface Comment {
  createrId: string;
  createrName: string;
  comment: string;
  timestamp: firebase.default.firestore.Timestamp;
}
