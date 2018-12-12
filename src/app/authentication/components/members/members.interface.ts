import { IAccount, IRoleAccount } from "src/app/shareds/services/account.service";
import { PageChangedEvent } from "ngx-bootstrap";

export interface IMembersComponent{
    items: Imember;

    //ส่วนของการค้นหา
    searchText: string;
    searchType: IMemberSearchKey;
    searchTypeItems: IMemberSearchKey[];
    onSearchItem(); void;

    //ส่วนของ pagination
    startPage: number;
    limitPage: number;
    onPageChanged(page: PageChangedEvent);

    getRoleName(role: IRoleAccount): string;

    onDeleteMember(Item: IAccount): void;

    onUpdateMember(Item: IAccount): void;
}

export interface Imember{
    items:IAccount[];
    totalItems: number;
}

export interface ImemberSearch {
    searchText?: string;
    searchType?: string;

    startPage: number;
    limitPage: number;
}

export interface IMemberSearchKey{
    key:string;
    value:string;
}