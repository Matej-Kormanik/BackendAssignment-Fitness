import {DataTypes, Sequelize,} from 'sequelize'
import {DatabaseModel} from '../types/db'
import {ExerciseModel} from './exercise'
import {UserModel} from "./user";

export class UserExerciseModel extends DatabaseModel {
    id: number
    completed: boolean
    duration: number
    exercise: ExerciseModel
    user: UserModel
}

export default (sequelize: Sequelize) => {
    UserExerciseModel.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        duration: {
            type: DataTypes.INTEGER
        }
    }, {
        paranoid: true,
        timestamps: true,
        sequelize,
        modelName: 'user_exercise'
    })

    UserExerciseModel.associate = (models) => {
        (UserExerciseModel as any).belongsTo(models.Exercise, {
            foreignKey: {
                name: 'exerciseID',
                allowNull: false
            },
        })
        (UserExerciseModel as any).belongsTo(models.User, {
            foreignKey: {
                name: 'userID',
                allowNull: false
            },
        })
    }

    return UserExerciseModel
}
