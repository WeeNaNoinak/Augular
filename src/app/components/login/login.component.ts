import { Component, OnInit } from '@angular/core';
import { AppURL } from '../../app.url';
import { ILoginCompanent } from './login.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthURL } from 'src/app/authentication/authentication.url';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AuthenService } from 'src/app/services/authen.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements ILoginCompanent {
 
  constructor(
  private builder:FormBuilder,
  private alert: AlertService,
  private router: Router,
  private account: AccountService,
  private authen: AuthenService,
  private activateRoute: ActivatedRoute
  
  ) { 
    // เก็บค่า return url เพื่อ redirect หลังจาก login
    this.activateRoute.params.forEach(params =>{
      this.returnURL = params.returnURL || `/${AppURL.Authen}/${AuthURL.Profile}`;
      console.log(this.returnURL);
    });
    this.initialCreateFormData();
    //console.log(this.authen.getAuthenticated());
  }
  Url = AppURL;
  returnURL: string;
  form: FormGroup;

  //เข้าสู่ระบบ
  onSubmit(): void {
    //throw new Error("Method not implemented.");
    if(this.form.invalid)
      return this.alert.someting_wrong();
    this.account
    .onLogin(this.form.value)
    .then(res =>{
      //เก็บ seesion
      this.authen.setAuthenticated(res.accessToken);
      //alert และ redirect หน้า page
      this.alert.notify('เข้าสู่ระบบสำเร็จ','info');
      this.router.navigateByUrl(this.returnURL);
    })
    .catch(err => this.alert.notify(err.Message));

    //console.log(this.form.value);
    //this.router.navigate(['/',AppURL.Authen,AuthURL.Dashboard]);
  }

  //สร้างฟร์อม
  private initialCreateFormData(){
    this.form = this.builder.group({
        email:['',Validators.required],
        password:['',Validators.required],
        remember:[true]
    });
  }
}
