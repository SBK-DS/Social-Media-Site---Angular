import { Component } from '@angular/core';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {

  selectedImageFile!: File

  constructor() {}

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
