import { Component, OnInit, TemplateRef } from '@angular/core';
import { IProfileComponent } from './profile.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AuthenService } from 'src/app/services/authen.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SharedsService } from 'src/app/shareds/services/shareds.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements IProfileComponent {
  
  constructor(
    private buider: FormBuilder,
    private account: AccountService,
    private authen: AuthenService,
    private alert: AlertService,
    private modalService: BsModalService,
    private shareds: SharedsService
    
  ) {
    this.initailCreateFormData();
    this.initailLoad๊UpdateFormDate();
    //เพิ่ม position
    this.positionItems = this.shareds.positionItems;
   }

  form: FormGroup;
  modalRef: BsModalRef;
  positionItems: any[]=[];
  // positionItems: any[]=[
  //   'Frontend Developer',
  //   'Backend Developer',
  //   'Programer'
  // ];

  //บันทึกข้อมูล
  onSubmit(){
    if(this.form.invalid)return this.alert.someting_wrong();
    this.account
        .onUpdateProfile(this.authen.getAuthenticated(), this.form.value)
        .then(() => this.alert.notify('แก้ไขข้อมูลสำเร็จ','info'))
        .catch(err => this.alert.notify(err.Message));
    console.log(this.form.value);
  }

   //แปลงไฟล์รูปเป็น Base64
   onConvertImage(input: HTMLInputElement){
     const imageControl = this.form.controls['image'];
     
      this.shareds
          .onConvertImage(input)
          .then(base64 => imageControl.setValue(base64))
          .catch(err => {
            input.value = null;
            imageControl.setValue(null);
            this.alert.notify(err.Message)
          });
   }

  //เปิด modal dialog
  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  //สร้างฟอร์ม
  private initailCreateFormData(){
    this.form = this.buider.group({
      email: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      position: ['', Validators.required],
      image: [null]
    });
    //disabled email
    this.form.get('email').disable();
  }

  //โหลดข้อมูลใหม่ update form ข้อมูล
  private initailLoad๊UpdateFormDate(){
    this.account
    .getUserLogin(this.authen.getAuthenticated())
    .then(user => {
      this.form.controls['email'].setValue(user.email);
      this.form.controls['firstname'].setValue(user.firstname);
      this.form.controls['lastname'].setValue(user.lastname);
      this.form.controls['position'].setValue(user.position);
      this.form.controls['image'].setValue(user.image);
    })
    .catch(err => this.alert.notify(err.Message));
  }
}
