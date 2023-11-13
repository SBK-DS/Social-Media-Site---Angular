import { Component, Injectable, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {

  userName!: string;
  userDesc!: string;
  isEdit: boolean = true;

  constructor() {
    console.log(AppComponent.getUserDocument()?.description)
  }

  ngOnInit(): void {
    
    this.userName = <string>AppComponent.getUserDocument()?.publicName

    this.userDesc = <string>AppComponent.getUserDocument()?.description

    console.log(this.userName, this.userDesc)

  }

  onEditClick() {
    if(this.isEdit) { this.isEdit = false}
    else {this.isEdit = true}
  }

}
