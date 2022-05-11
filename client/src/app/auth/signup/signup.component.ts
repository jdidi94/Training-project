import { Component, OnInit } from '@angular/core';
import {  FormControl,FormGroup ,Validators } from '@angular/forms';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  ProgressForm=true
  nextDivs:number[]=[1,2,3,4]
  show:number=1
  checkoutForm = new FormGroup({
    firstName:new FormControl('',Validators.required), 
    lastName: new FormControl('',Validators.required),
    email:new FormControl('',[Validators.required,Validators.email]),
    number:new FormControl('',Validators.required),
    dateOfBirth:new FormControl('',Validators.required),
    gender:new FormControl('',Validators.required),
    password: new FormControl('',[Validators.required]),
    repeatPassword:new FormControl('',Validators.required),

  });
  // let nextDiv:<string>
  constructor() { 
  
    }

  ngOnInit(): void {
 console.log(this.checkoutForm.get("firstName"))
  }
  changeDivNext(){
if(this.show <4&& this.ProgressForm ){
  this.show++
  
}else {
  this.ProgressForm=false
}
  }
  changeDivPrevious(){
    if(this.show >1){
      this.show--
  console.log("showprev",this.show)

    }else{
      this.show=1
    }
      }
 onSubmit(){

}
}
