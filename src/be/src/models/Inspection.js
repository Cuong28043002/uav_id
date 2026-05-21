'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Inspection extends Model {
    static associate(models) {
      Inspection.belongsTo(models.Drone, { foreignKey: 'drone_id', as: 'drone' });
      Inspection.belongsTo(models.User, { foreignKey: 'inspector_id', as: 'inspector' });
    }
  }

  Inspection.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      drone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Drones', key: 'id' },
      },
      inspector_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        comment: 'Người kiểm tra (Role: police)',
      },
      inspection_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      result: {
        type: DataTypes.ENUM('pass', 'fail'),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      inspection_images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Danh sách ảnh biên bản kiểm tra',
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
      modelName: 'Inspection',
      tableName: 'Inspections',
      timestamps: true,
    }
  );

  return Inspection;
};
