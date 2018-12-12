import { Inject, Injectable } from "@angular/core";
@Injectable({
    providedIn: 'root'
})
export class AuthenService{
    private accessKey ='assessToken';

    //กำหนดค่า access token ไว้ในความจำ browser
    setAuthenticated(accesToken: string){
        localStorage.setItem(this.accessKey,accesToken);
    }

    //ดึงค่า access token ในความจำ browser ออกมา
    getAuthenticated(): string{
       return localStorage.getItem(this.accessKey);
    }

     //ล้างค่า access token ที่อยู่ในความจำ browser 
     clearAuthenticated(): void{
        localStorage.removeItem(this.accessKey);
     }
}