import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { IMembersComponent, IMemberSearchKey, ImemberSearch, Imember } from './members.interface';
import { IAccount, IRoleAccount } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { PageChangedEvent, BsLocaleService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { AppURL } from 'src/app/app.url';
import { AuthURL } from '../../authentication.url';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  providers: [MemberService]
})
export class MembersComponent implements IMembersComponent {
  
  void: any;
  
  constructor(
    private member: MemberService,
    private alert: AlertService,
    private detect: ChangeDetectorRef,
    private router: Router,
    private localeService: BsLocaleService

  ) { 
    //เปลี่ยน datepicker เป็นภาษาไทย
    this.localeService.use('th');
    this.initailLoadMembers({
      startPage: this.startPage,
      limitPage: this.limitPage
    });
    //กำหนดค่าเริ่มต้นให้ searchtype
    this.searchType=this.searchTypeItems[0];
  }

  items:  Imember;
 
  //ตัวแปรของการค้นหา
  searchText: string ='';
  searchType: IMemberSearchKey;
  searchTypeItems: IMemberSearchKey[]=[
    { key: 'email',value: 'ค้นหาจากอีเมล์'},
    { key: 'firstname',value: 'ค้นหาจากชื่อ'},
    { key: 'lastname',value: 'ค้นหาจากนามสกุล'},
    { key: 'position',value: 'ค้นหาจากตำแหน่ง'},
    { key: 'role',value: 'ค้นหาจากสิทธิ์ผู้ใช้'},
    { key: 'updated',value: 'ค้นหาจากวันที่'}
  ];

  //ตัวแปร pagination
  startPage: number = 1;
  limitPage: number = 5;

  //เปลี่ยนหน้า pagination
  onPageChanged (page: PageChangedEvent){
    this.initailLoadMembers({
      searchText: this.getSearchText,
      searchType: this.searchType.key,
      startPage:page.page,
      limitPage:page.itemsPerPage
    });
  }

  //ค้นหาข้อมูล
  onSearchItem(){
    this.startPage=1;
    this.initailLoadMembers({
      searchText: this.getSearchText,
      searchType: this.searchType.key,
      startPage:this.startPage,
      limitPage:this.limitPage
    });
    //กระตุ้น event
    this.detect.detectChanges();
  }

  //แสดงชื่อผู้ใช้งาน
  getRoleName(role: IRoleAccount){
    return IRoleAccount[role];
  }

  //ลบข้อมูลสามชิก
  onDeleteMember(item: IAccount){
      this.alert.confiam().then(status =>{
        if(!status)return;
        this.member
            .deleteMember(item.id)
            .then(()=>{
              this.initailLoadMembers({
                //โหลดข้อมูล Member ใหม่
                searchText: this.getSearchText,
                searchType: this.searchType.key,
                startPage: this.startPage,
                limitPage: this.limitPage
              });
              this.alert.notify('ลบข้อมูลสำเร็จ','info');
            })
            .catch(err => this.alert.notify(err.Message));
      });
  }

  //แก้ไขข้อมูลสามชิก โดยส่ง id ไปยัง url
  onUpdateMember(item: IAccount){
    //this.alert.notify(item.id);
    this.router.navigate(['/',
          AppURL.Authen,
          AuthURL.MemberCreate,
          item.id 
        ]);
    
}

  //ตรวจสอบและ return ค่า serchText
  private get getSearchText(){
    let responseSearchText=null;
    
    switch (this.searchType.key){
      case 'role':
        responseSearchText = IRoleAccount[this.searchText] || '';
        break;
      case 'update':
        responseSearchText = { from: this.searchText[0], to: this.searchText[1]};
        break;
      default:
        responseSearchText = this.searchText;
        break;
    }
    //console.log(responseSearchText);
    return responseSearchText;
  }

  //โหลดข้อมูลสมาชิก
  private initailLoadMembers(options?: ImemberSearch){
    this.member
        .getMembers(options)
        .then(items => this.items = items)
        .catch(err =>this.alert.notify(err.Message));
      
  }
}
