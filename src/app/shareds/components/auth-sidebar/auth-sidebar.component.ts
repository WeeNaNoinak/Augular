import { Component, OnInit } from '@angular/core';
import { AppURL } from 'src/app/app.url';
import { AuthURL } from 'src/app/authentication/authentication.url';
import { IAuthSidebarComponent } from './auth-sidebar.interface';
import { IAccount, AccountService, IRoleAccount } from '../../services/account.service';
import { AuthenService } from 'src/app/services/authen.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-sidebar',
  templateUrl: './auth-sidebar.component.html',
  styleUrls: ['./auth-sidebar.component.scss']
})
export class AuthSidebarComponent implements OnInit,IAuthSidebarComponent {

  constructor(
      private account: AccountService,
      private authen: AuthenService,
      private alert: AlertService,
      private router: Router
  ) { 
      this.initialLoadUserLogin();
  }

  ngOnInit() {
  }
  
  AppURL=AppURL;
  AuthURL=AuthURL;
  UserLogin: IAccount;
  Role = IRoleAccount;
  //โหลดข้อมูล user ที่เข้าระบบ จาก Token
  private initialLoadUserLogin(){
      this.account
      .getUserLogin(this.authen.getAuthenticated())
      .then(userLogin => this.UserLogin=userLogin)
      .catch(err => {
            this.alert.notify(err.Message);
          this.authen.clearAuthenticated();
          this.router.navigate(['/',AppURL.Login]);
        });
  }
}
