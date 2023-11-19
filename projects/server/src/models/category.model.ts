import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Category } from '@/interfaces/category.interface';

export class CategoryModel extends Model<Category> implements Category {
    public id: number;
    public name:string;
    public imageUrl:string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof CategoryModel {
    CategoryModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING(45),
            },
            imageUrl: {
                allowNull: false,
                type: DataTypes.STRING(45),
            },
        },
        {
            tableName: 'categories',
            sequelize,
        },
    );


    return CategoryModel;
}
