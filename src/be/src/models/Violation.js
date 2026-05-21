'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Violation extends Model {
    static associate(models) {
      Violation.belongsTo(models.Drone, { foreignKey: 'drone_id', as: 'drone' });
      Violation.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  Violation.init(
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      violation_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Loại vi phạm: bay vào vùng cấm, bay đêm không phép...',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      evidence_images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Danh sách ảnh bằng chứng vi phạm',
      },
      fine_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Mức phạt (VND)',
      },
      status: {
        type: DataTypes.ENUM('unpaid', 'paid'),
        allowNull: false,
        defaultValue: 'unpaid',
      },
      date_recorded: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
      modelName: 'Violation',
      tableName: 'Violations',
      timestamps: true,
    }
  );

  return Violation;
};
