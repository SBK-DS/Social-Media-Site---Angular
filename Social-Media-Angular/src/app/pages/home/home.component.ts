import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { AuthenticationComponent } from 'src/app/tools/authentication/authentication.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  

  constructor(private loginSheet: MatBottomSheet){}
  
  ngOnInit(): void {}

  onGetStartedClick() {
    this.loginSheet.open(AuthenticationComponent)
  }
}
