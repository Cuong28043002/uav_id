'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Registration extends Model {
    static associate(models) {
      Registration.belongsTo(models.Drone, { foreignKey: 'drone_id', as: 'drone' });
    }
  }

  Registration.init(
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
      identification_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
        comment: 'Mã định danh / biển số UAV',
      },
      qr_code_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'revoked'),
        allowNull: false,
        defaultValue: 'pending',
      },
      issue_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      admin_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      documents: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Hồ sơ / giấy tờ đính kèm (URL ảnh)',
      },
      signature: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Chữ ký điện tử của cán bộ phê duyệt (Base64)',
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
      modelName: 'Registration',
      tableName: 'Registrations',
      timestamps: true,
    }
  );

  return Registration;
};
