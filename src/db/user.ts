import {Sequelize, DataTypes} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { USER_ROLE} from "../utils/enums";
import {sequelize} from "./index";

export class UserModel extends DatabaseModel {
    name:string
    surname: string
    nickName:string
    email: string
    password: string
    age: number
    role: USER_ROLE
}

export default (sequelize: Sequelize) => {
    UserModel.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(200)
        },
        surname: {
            type: DataTypes.STRING(200)
        },
        nickName: {
            type: DataTypes.STRING(200)
        },
        email: {
            type: DataTypes.STRING(200)
        },
        password: {
            type: DataTypes.STRING(100)
        },
        age: {
            type: DataTypes.INTEGER
        },
        role: {
            type: DataTypes.ENUM(...Object.values(USER_ROLE))
        }


    }, {
        paranoid: true,
        timestamps: true,
        sequelize,
        modelName: 'user'
    });


    return UserModel;
}
