export interface WarehouseAddress{
    id?:number;
    cityId?:number;
    provinceId?:number;
    addressDetail:string;
    longitude:number;
    latitude:number;
    isActive:boolean;
}