import { FormGroup } from "@angular/forms";

export interface ILoginCompanent{
    Url:any;
    returnURL: string;
    form:FormGroup;
    onSubmit():void;
}

export interface ILogin {
    email:string;
    password:string;
    remember:boolean;
}