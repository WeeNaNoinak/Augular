import { Component, OnInit } from '@angular/core';
import { AppURL } from '../../app.url';
import { IRegisterComponent } from './register.interface';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { AccountService } from 'src/app/shareds/services/account.service';
import { Router } from '@angular/router';
import { ValidatorsService } from 'src/app/shareds/services/validators.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements IRegisterComponent {
  
  constructor(
	private builder: FormBuilder,
  private alert: AlertService,
  private account: AccountService,
  private rounter:Router,
  private validators: ValidatorsService
  ) { 
    this.initialCreateform();
  }

  Url=AppURL;
  form: FormGroup;

  //ลงทะเบียน
  onSubmit() {

//ส่งข้อมูลหา server
	if(this.form.invalid)
		return this.alert.someting_wrong();
    this.account
      .onRegister(this.form.value)
      .then(res => {
        this.alert.notify('ลงทะเบียนสำเร็จ','info');
        this.rounter.navigate(['/',AppURL.Login]);
      })
      .catch(err => this.alert.notify(err.Message));
  }
  private initialCreateform(){
    //สร้างฟอร์ม
    this.form=this.builder.group({
      firstname:['',[Validators.required]],
      lastname:['',[Validators.required]],
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required,this.validators.isPassword]],
      cpassword:['',[Validators.required,this.validators.comparePassword('password')]]
    });
  }

  // //สร้าง validate เอง
  // private comparePassword(passwordField:string){
  //   return function (confirm_password: AbstractControl){
  //     if(!confirm_password.parent)return;
  //     const password = confirm_password.parent.get(passwordField);
  //     const passwordSubscripe = password.valueChanges.subscribe(()=>{
  //       confirm_password.updateValueAndValidity();
  //       passwordSubscripe.unsubscribe();
  //     });
  //     if(confirm_password.value === password.value)
  //       return;
  //     return { compare: true };
  //   }
  // }
}
