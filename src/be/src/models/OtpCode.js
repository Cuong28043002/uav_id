'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OtpCode extends Model {
    static associate(models) {
      OtpCode.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  OtpCode.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      otp_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('register', 'forgot_password'),
        allowNull: false,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: 'OtpCode',
      tableName: 'OtpCodes',
      timestamps: true,
    }
  );

  return OtpCode;
};
