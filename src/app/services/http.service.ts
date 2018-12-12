import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class HttpService{
    constructor(
        private http: HttpClient
    ){
        // this.http
        //     .get('http://192.168.0.26:8888/emp/getemp/ffbdbf7c94f64751df08773bc704c6c7bd0f6f3a396d6ad747ad43be6258c85d/597419')
        //     .subscribe(res => console.log(res));
    }
    private address: string ='http://192.168.0.26:8888/';
    
    requestPost(url: string, body: any){
        return this.http.post(`${this.address}${url}`,body);
    }
}