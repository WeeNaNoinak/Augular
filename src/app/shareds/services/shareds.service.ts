import { Injectable } from "@angular/core";
import { ReturnStatement } from "@angular/compiler";


@Injectable()
export class SharedsService{
    //ตำแหน่งสมาชิก
    positionItems: any[]=[
        'Frontend Developer',
        'Backend Developer',
        'Programer'
      ];

      //แปลงไฟล์รูปเป็น Base64
  onConvertImage(input: HTMLInputElement){
    return new Promise((resolve,reject) =>{
        const imageTypes = ['image/jpeg','image/png'];
        const imageSize = 200;
        //หากไม่มีการอัพโหลดภาพ
        if(input.files.length==0)
            return resolve(null);
        //ตรวจสอบชนิอไฟล์ที่อัพโหลดเข้ามา
        if(imageTypes.indexOf(input.files[0].type) < 0){
            return reject({Message: 'กรุณาอัพโหลดรูปภาพเท่านั้น'});
        }
        //ตรวจสอบขนาดรูปภาพ
        if((input.files[0].size / 1024) >imageSize)
            return reject({Message: `กรุณาอัพโหลดรูปภาพไม่เกิน ${imageSize} KB`})
        
    
        const reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        //คืนค่า image base64 
        reader.addEventListener('load',() => resolve(reader.result));
    });
    
  }
}