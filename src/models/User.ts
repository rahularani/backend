import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database.js'

export class User extends Model {
  declare id: number
  declare email: string
  declare password: string
  declare role: string
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'donor', 'volunteer'),
      defaultValue: 'donor'
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  }
)
