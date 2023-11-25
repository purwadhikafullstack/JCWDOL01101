import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { City } from '@/interfaces/city.interface';
import { ProvinceModel } from './province.model';
import { AddressModel } from './address.model';
export class CityModel extends Model<City> implements City {
    public id: number;
    public provinceId?: number;
    public city: string;
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
            provinceId: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            city: {
                allowNull: false,
                type: DataTypes.STRING(45),
            },
            postalCode: {
                allowNull: false,
                type: DataTypes.INTEGER,
            }
        },
        {
            tableName: 'cities',
            sequelize,
        },
    );

    ProvinceModel.hasMany(CityModel, {
        foreignKey: "provinceId",
        as:'provinceData'
    });

    CityModel.belongsTo(ProvinceModel, {
        foreignKey: "provinceId",
        as:'provinceData'

    });

    CityModel.hasOne(AddressModel, {
        foreignKey: "cityId",
        as: 'cityData' 
      });
      

    AddressModel.belongsTo(CityModel, {
        foreignKey: "cityId",
        as: 'cityData' 
        
    });

    return CityModel;
}
