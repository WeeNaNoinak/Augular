import { Injectable } from "@angular/core";
import { IRegister } from "src/app/components/register/register.interface";
import { resolve } from "url";
import { reject } from "q";
import { ILogin } from "src/app/components/login/login.interface";
import { IProfile } from "src/app/authentication/components/profile/profile.interface";
import { IChangePassword } from "src/app/authentication/components/profile/change-password/change-password.interface";
import { HttpService } from "src/app/services/http.service";

@Injectable({
    providedIn:'root'
})
//service นี้คือ Global service
export class AccountService{
constructor(
    private http: HttpService
){}

public mockUserItems: IAccount[] =[
    {
        id: 1,
        firstname: 'Admin',
        lastname: 'Noinak',
        email: 'admin@mail.com',
        password: '111111',
        position: 'Backend Developer',
        image:'https://s3.amazonaws.com/uifaces/faces/twitter/jsa/48.jpg',
        role: IRoleAccount.Admin,
        created: new Date(),
        updated: new Date()
    },
    {
        id: 2,
        firstname: 'Employee',
        lastname: 'Noinak',
        email: 'emp@mail.com',
        password: '111111',
        position: 'frontend Developer',
        image:null,
        role: IRoleAccount.Employee,
        created: new Date(),
        updated: new Date()
    },
    {
        id: 3,
        firstname: 'Member',
        lastname: 'Noinak',
        email: 'mem@mail.com',
        password: '111111',
        position: 'Programmer',
        image:null,
        role: IRoleAccount.Member,
        created: new Date(),
        updated: new Date()
    }
];

    //เปลี่ยน password
    onChangePassword(accessToken: string, model: IChangePassword) {
        return new Promise((resolve,reject) =>{
            const userProfile = this.mockUserItems.find(item => item.id == accessToken);
            if(!userProfile) return reject({Message:'ไม่มีผู้ใชงานนี้ในระบบ'});
            if(userProfile.password !== model.old_pass) return reject({Message:'รหัสผ่านเดิมไม่ถูกต้อง'});
            userProfile.password=model.new_pass;
            userProfile.updated=new Date();
            resolve(userProfile);
        });
    }

    //แก้ไขข้อมูลส่วนตัว update profile
    onUpdateProfile(accessToken:string,model:IProfile){
        return new Promise((resolve,reject) =>{
            const userProfile = this.mockUserItems.find(user => user.id == accessToken);
            if(!userProfile) return reject({Message:'ไม่มีผู้ใชงานนี้ในระบบ'});
            userProfile.firstname = model.firstname;
            userProfile.lastname = model.lastname;
            userProfile.position = model.position;
            userProfile.image = model.image;
            userProfile.updated = new Date();
            resolve(userProfile);
        });
    }

    //ดึงข้อมูลผู้ที่เข้าสู่ระบบด้วย Token
    getUserLogin(accessToken: string){
        return new Promise<IAccount>((resolve,reject)=>{
            const userLogin= this.mockUserItems.find(m=>m.id == accessToken);
            if(!userLogin)return reject({Message: 'accessToken ไม่ถูกต้อง'});
            resolve(userLogin);
        });
    }

    //Login
    onLogin(model: ILogin){
        //console.log(model);
        return new Promise<{accessToken: string}>((resolve,reject)=>{
            const userLogin = this.mockUserItems.find(item => item.email==model.email && item.password==model.password);
            if(!userLogin)return reject({Message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง'});
            resolve({
                accessToken: userLogin.id
            });
            //resolve(userLogin);
            //reject({Message:'Error!!!'});

        });
    }

    //ลงทะเบียน
    
    onRegister(model: IRegister){
       // console.log(model);
        return this.http
            .requestPost('api/accout/register',model)
            .toPromise() as Promise<IAccount>;
     //console.log(model); ----sevice
     //return new Promise((resolve,reject)=>{
        // //  model['id'] = Math.random();
        // //  this.mockUserItems.push(model);
        // const _model: IAccount = model;
        // _model.id = Math.random();
        // _model.image = null;
        // _model.position = '';
        // _model.role = IRoleAccount.Member;
        // _model.created = new Date();
        // _model.updated = new Date();
        // this.mockUserItems.push(model);
        // resolve(model);
        // //reject({Message:'Error!!!'});

     //});
    }
}

export interface IAccount {
    
            firstname: string;
            lastname: string;
            email: string;
            password: string;
           

            id?: any;
            position?: string;
            image?: string;
            role?;
            created?: Date;
            updated?: Date;
}

export enum IRoleAccount{
    Member=1,
    Employee,
    Admin
}