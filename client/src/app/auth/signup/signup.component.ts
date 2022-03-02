import { Component, OnInit } from '@angular/core';
import {  FormControl,FormGroup  } from '@angular/forms';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
 
  checkoutForm = new FormGroup({
    name:new FormControl(''), 
    lastName: new FormControl(''),
    email:new FormControl(''),
    gender:new FormControl(''),
    password: new FormControl(''),
    repeatPassword:new FormControl(''),

  });
  // let nextDiv:<string>
  constructor() { 
     
    }

  ngOnInit(): void {
    let ProgressForm=true
    let nextDiv=[1,2,3,4]
  }
  changeDiv(){

  }
 onSubmit(){

}
}
