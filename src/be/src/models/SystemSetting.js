'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SystemSetting extends Model {
    static associate(models) {
      // No associations - global config table
    }
  }

  SystemSetting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      key_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      key_value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      modelName: 'SystemSetting',
      tableName: 'SystemSettings',
      timestamps: true,
    }
  );

  return SystemSetting;
};
