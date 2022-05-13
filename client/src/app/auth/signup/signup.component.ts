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
    firstName:new FormControl('',[Validators.required,Validators.minLength(4),Validators.pattern(/^[a-zA-Z ,.'-]+$/i)]), 
    lastName: new FormControl('',[Validators.required,Validators.minLength(4),Validators.pattern(/^[a-zA-Z ,.'-]+$/i)]),
    email:new FormControl('',[Validators.required,Validators.email]),
    number:new FormControl('',[Validators.required,Validators.minLength(8)]),
    dateOfBirth:new FormControl('',[Validators.required,Validators.pattern("^(0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](19|20)\\d\\d$")]),
    gender:new FormControl('',Validators.required),
    password: new FormControl('',[Validators.required,Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),Validators.maxLength(30)]),
    repeatPassword:new FormControl('',Validators.required),

  });
  // let nextDiv:<string>
  constructor() { 
  
    }

  ngOnInit(): void {

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
get FirstName():FormControl{
  return this.checkoutForm.get("firstName") as FormControl;
}
get LastName():FormControl{
  return this.checkoutForm.get("lastName") as FormControl;
}
get Email():FormControl{
  return this.checkoutForm.get("email") as FormControl;
}
get Number():FormControl{
  return this.checkoutForm.get("number") as FormControl;
}
get DateOfBirth():FormControl{
  return this.checkoutForm.get("dateOfBirth") as FormControl;
}
get Gender():FormControl{
  return this.checkoutForm.get("gender") as FormControl;
}
get Password():FormControl{
  return this.checkoutForm.get("password") as FormControl;
}
get RepeatPassword():FormControl{
  return this.checkoutForm.get("repeatPassword") as FormControl;
}
}
