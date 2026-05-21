'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
      User.hasMany(models.Drone, { foreignKey: 'owner_id', as: 'drones' });
      User.hasMany(models.FlightPermit, { foreignKey: 'user_id', as: 'flightPermits' });
      User.hasMany(models.Violation, { foreignKey: 'user_id', as: 'violations' });
      User.hasMany(models.Inspection, { foreignKey: 'inspector_id', as: 'inspections' });
      User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
      User.hasMany(models.OtpCode, { foreignKey: 'user_id', as: 'otpCodes' });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Roles', key: 'id' },
      },
      full_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      cccd_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      avatar_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Ảnh đại diện người dùng',
      },
      status: {
        type: DataTypes.ENUM('active', 'banned'),
        allowNull: false,
        defaultValue: 'active',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'createdAt',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updatedAt',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    }
  );

  return User;
};
