const {Product, ProductModel} = require('./product.js');
const {Op} = require('sequelize');

const ProductController = function (){
  this.create = async function (product){
    const newProduct = new ProductModel(product);
    const productCreated = await Product.create(newProduct).catch(err => {
      console.log(err);
      return null;
    });
    return productCreated;
  };
  
  this.update = async function (product){
    const updatedProduct = await Product.update(product, {
      where: {id: product.id}
    }); 
    await this.setUpdatedSync(product.id);
    
    return updatedProduct;
  };

  this.delete = async function (id){
    this.setDeletedSync(id);
  };

  this.readById = async function (id){
    const product = await Product.findByPk(id);
    return product;
  };

  this.readAll = async function (){
    const products = await Product.findAll();
    return products;
  };

  this.setUpdatedSync = async function (id){
    const product = await Product.findByPk(id);
    product.update_sync = true;
    await product.save();
    return product;
  };

  this.setUpdatedSyncFalse = async function (id){
    const product = await Product.findByPk(id);
    product.update_sync = false;
    await product.save();
    return product;
  };

  this.setDeletedSync = async function (id){
    const product = await Product.findByPk(id);
    product.delete_sync = true;
    await product.save();
    return product;
  };

  this.setDeletedSyncFalse = async function (id){
    const product = await Product.findByPk(id);
    product.delete_sync = false;
    await product.save();
    return product;
  }

  this.setCreatedSyncedFalse = async function (id){
    const product = await Product.findByPk(id);
    product.create_sync = false;
    await product.save();
    return product;
  };

  this.readUnsynced = async function (){
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          {create_sync: 1},
          {update_sync: 1},
          {delete_sync: 1},
        ]
      }
    });
    return products;
  };

  this.sync = async function (productID, action){
    if(action === 'CREATE')
    {
      console.log("CREATE");
      return this.setCreatedSyncedFalse(productID);
    }else if(action === 'UPDATE')
    {
      console.log("UPDATE");
      return this.setUpdatedSyncFalse(productID);
    }else if(action === 'DELETE')
    {
      console.log("DELETE");
      await Product.destroy({
        where: {
          id: productID
        }
      });
      return "Product deleted!"
    }
    return null;
  }
}

module.exports = new ProductController();