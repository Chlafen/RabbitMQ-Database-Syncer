const {Product, ProductModel} = require('./product.js');
const {Op} = require('sequelize');

const ProductController = function (){
  this.create = async function (product, sourceName, sourceID){
    product.source_office = sourceName;
    product.id_from_source = sourceID;

    const newProduct = new ProductModel(product);
    const productCreated = await Product.create(newProduct).catch(err => {
      console.log(err);
      return null;
    });

    return productCreated;
  };
  
  this.readAll = async function (){
    const products = await Product.findAll();
    return products;
  };

  this.update = async function (product, sourceName, sourceID){
    product.source_office = sourceName;
    product.id_from_source = sourceID;
    
    const updatedProduct = await Product.update(product, {
      where: {source_office: sourceName, id_from_source: sourceID}
    }); 

    return updatedProduct;
  };

  this.delete = async function (sourceName, sourceID){
    const deletedProduct = await Product.destroy({
      where: {source_office: sourceName, id_from_source: sourceID}
    });

    return deletedProduct;
  }


}

module.exports = new ProductController();