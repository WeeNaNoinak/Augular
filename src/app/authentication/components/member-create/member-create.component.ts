import { Component, OnInit } from '@angular/core';
import { IMemberCreateComponent } from './member-create.interface';
import { IRoleAccount } from 'src/app/shareds/services/account.service';
import { SharedsService } from 'src/app/shareds/services/shareds.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { ValidatorsService } from 'src/app/shareds/services/validators.service';
import { MemberService } from '../../services/member.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppURL } from 'src/app/app.url';
import { AuthURL } from '../../authentication.url';

@Component({
  selector: 'app-member-create',
  templateUrl: './member-create.component.html',
  styleUrls: ['./member-create.component.scss'],
  providers: [MemberService]
})
export class MemberCreateComponent implements IMemberCreateComponent {
  constructor(
    private shareds: SharedsService,
    private buider: FormBuilder,
    private alert: AlertService,
    private validators: ValidatorsService,
    private member: MemberService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) { 
    this.activatedRouter.params.forEach(params => {
      this.memId = params.id;
    });

    this.initailCreateFormData();
    this.initailUpdateFormData();
    //เพิ่ม position
    this.positionItems=this.shareds.positionItems;

  }

  form:FormGroup;
  memId:any;
  positionItems: string[];
  roleItems: IRoleAccount[] = [
        IRoleAccount.Member,
        IRoleAccount.Employee,
        IRoleAccount.Admin
  ];

  //บันทึกแก้ไข
  onSubmit():void{
    if(this.form.invalid)
      return this.alert.someting_wrong();
      //เพิ่มสมาชิกใหม่

      if(!this.memId){
        this.member
        .createMember(this.form.value)
        .then(res => {
          this.alert.notify('บันทึกข้อมูลสำเร็จ','info');
          this.router.navigate(['/',AppURL.Authen,AuthURL.Member]);
        })
        .catch(err => this.alert.notify(err.Message));
      }
      //แก้ไขสมาชิก
      else{
        this.member
        .updateMember(this.memId,this.form.value)
        .then(res => {
          this.alert.notify('แก้ไขสมาชิกสำเร็จ','info');
          this.router.navigate(['/',AppURL.Authen,AuthURL.Member]);
        })
        .catch(err => this.alert.notify(err.Message));
        
      }
    
    
  }

  //แสดงข้อมูลสิทธิ์ผู้ใช่เป็น Name
  getRoleName(role: IRoleAccount): string {
    return IRoleAccount[role];
  }

  //แสดงตัวอย่างอัพโหลดภาพ
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

  //สร้างฟร้อม
  private initailCreateFormData(){
    this.form=this.buider.group({
      image:[''],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,this.validators.isPassword]],
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      position:['',Validators.required],
      role:['',Validators.required]
      
    })
  }

  //แก้ไขฟร้อม
  private initailUpdateFormData(){
    if(!this.memId)return;
    this.member
        .getMembersById(this.memId)
        .then(member =>{
          //นำข้อมูลมาใส่ form
          const form = this.form;
          form.controls['image'].setValue(member.image);
          form.controls['email'].setValue(member.email);
          form.controls['firstname'].setValue(member.firstname);
          form.controls['lastname'].setValue(member.lastname);
          form.controls['position'].setValue(member.position);
          form.controls['role'].setValue(member.role);
          form.controls['password'].setValidators(this.validators.isPassword);
        })
        .catch(err => {
          this.alert.notify(err.Message);
          this.router.navigate(['/',AppURL.Authen,AuthURL.Member]);
        });

  }
}
