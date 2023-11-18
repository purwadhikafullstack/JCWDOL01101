import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
// import { Warehouse } from '@/interfaces/warehouses.interface';
// import { Address } from '@/interfaces/address.interface';
import { City } from '@/interfaces/city.interface';

export class CityModel extends Model<City> implements City {
    public id: number;
    public type:string;
    public city:string;
    public postalCode: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof CityModel {
    CityModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            type: {
                allowNull: false,
                type: DataTypes.STRING(45),
            },
            city: {
                allowNull: false,
                type: DataTypes.STRING(45),
            },
            postalCode:{
                allowNull: false,
                type: DataTypes.INTEGER,
            }
        },
        {
            tableName: 'cities',
            sequelize,
        },
    );


    return CityModel;
}
