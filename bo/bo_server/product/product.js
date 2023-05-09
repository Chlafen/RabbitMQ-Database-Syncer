const {DataTypes} = require('sequelize');
const sequelize = require('../db.js');

class ProductModel {
  constructor(product) {
    this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.region = product.region;
    this.product = product.product;
    this.qty = product.qty;
    this.cost = product.cost;
    this.amount = product.amount;
    this.tax = product.tax;
    this.total = product.total;
    this.update_sync = false;
    this.delete_sync = false;
    this.create_sync = true;
  }
} 

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  product: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qty: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  tax: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  update_sync: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0,
  },
  delete_sync: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0,
  },
  create_sync: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 1,
  },
}, {
  tableName: 'products',
  timestamps: false,
});

module.exports = {Product, ProductModel};