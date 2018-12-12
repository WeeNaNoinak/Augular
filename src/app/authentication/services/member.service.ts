import { Injectable } from "@angular/core";
import { AccountService, IAccount, IRoleAccount } from "src/app/shareds/services/account.service";
import { ImemberSearch, Imember } from "../components/members/members.interface";

@Injectable()
export class MemberService{
    constructor(private account:AccountService){
        if(this.account.mockUserItems.length <=2)
            this.generateMembers();
     }

    //ดึงข้อมูลสมาชิกทั้งหมด
    getMembers(options?: ImemberSearch){
        return new Promise<Imember>((resolve,reject)=>{
            //เรียงข้อมูลจากวันที่ล่าสุด
            let items = this.account.mockUserItems.sort((a1,a2) =>{
                return Date.parse(a2.updated.toString())-Date.parse(a1.updated.toString());
            });
            //คำนวณเรื่อง pagination
            const startItem = (options.startPage - 1) * options.limitPage;
            const endItem = options.startPage * options.limitPage;
            

            //หากมีการค้นหาข้อมูล
            if(options && options.searchText && options.searchType){
                //ค้นหาข้อมูลมาเก็บไว้ในตัวแปร items
                items = this.account
                    .mockUserItems
                    .filter(item => {
                        switch(options.searchType){
                            case 'updated':
                                return item.updated >= options.searchText['0'] && item.updated <= options.searchText['1'];//date from -to
                            default:
                                return item[options.searchType].toString().toLowerCase()
                                    .indexOf(options.searchText.toString().toLowerCase())>=0
                        }
                    });
            }
            resolve({items: items.slice(startItem,endItem),totalItems: items.length});
        });
    }

    //ดึงข้อมูลสมาชิกคนเดียว
    getMembersById(id){
        return new Promise<IAccount>((resolve,reject) => {
            const member = this.account.mockUserItems.find(item => item.id ==id);
            if(!member)return reject({Message: 'ไม่พบข้อมูลสมาชิกในระบบ' });
            resolve(member);
        })
    }

    //เพิ่มข้อมูลสมาชิก
    createMember(model: IAccount){
        return new Promise<IAccount>((resolve,reject) =>{
            if(this.account.mockUserItems.find(item => item.email ==model.email))
                return reject({Message: 'อีเมล์นี้มีในระบบแล้ว'});
            model.id = Math.random();
            model.created = new Date();
            model.updated = new Date();

            this.account.mockUserItems.push(model);
            resolve(model);
        });
    }

    //ลบข้อมูลสมาชิก
    deleteMember(id:any){
        return new Promise((resolve,reject) =>{
            const findIndex = this.account.mockUserItems.findIndex(item => item.id ==id);
            if(findIndex < 0) return reject({ Message: 'ไม่พบข้อมูลนี้ในระบบ'});
            resolve(this.account.mockUserItems.splice(findIndex,1));
        });
    }

    //แก้ไขข้อมูล
    updateMember(id:any,model:IAccount){
        return new Promise<IAccount>((resolve,reject) =>{
            const member = this.account.mockUserItems.find(item =>item.id==id);
            if(!member) return reject({Message: 'ไม่มีข้อมูลสมาชิกในระบบ'});
            
            //check mail มีในระบบหรือยัง
            if(this.account.mockUserItems.find(item => {
                return item.email == model.email && model.email !=member.email;
            })) return reject({Message: 'อีเมล์นี้มีในระบบแล้ว'});

            member.email=model.email;
            member.password=model.password || member.password;//ถ้าไม่กรอก password ให้ใช้ตัวเดิม
            member.firstname=model.firstname;
            member.lastname=model.lastname;
            member.position =model.position;
            member.role=model.role;
            member.image=model.image;
            member.updated= new Date();
            resolve(member);
            
        });
    }

    //จำลอง data
    private generateMembers(){
        const positions = ['Programer','Backend Developer',,'Frontend Developer'];
        const roles = [IRoleAccount.Member,IRoleAccount.Employee,IRoleAccount.Admin]
        //this.account.mockUserItems.splice(2);
        for(let i=4; i<=333;i++)
        this.account.mockUserItems.push({
            id: i.toString(),
            firstname: `fristname ${i}`,
            lastname: `lastname ${i}`,
            email: `mail-${i}@mail.com`,
            password: `123456`,
            position: positions[Math.round(Math.random()*1)],
            role: roles[Math.round(Math.random()*2)],
            created: new Date(),
            updated: new Date(2018,11,Math.round(Math.random()*24 +1))
        })
    }
}