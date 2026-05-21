'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class LookupHistory extends Model {
    static associate(models) {
      // No FK associations - this is a public lookup log table
    }
  }

  LookupHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      identification_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Mã định danh được tra cứu',
      },
      ip_address: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      device_info: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'User-Agent hoặc thông tin thiết bị',
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
      modelName: 'LookupHistory',
      tableName: 'LookupHistory',
      timestamps: true,
    }
  );

  return LookupHistory;
};
