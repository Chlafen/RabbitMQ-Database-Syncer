const express = require("express");
const rabbitmqConnection = require('../rabbitmq');
const router = express.Router();

const ProductController = require('../product');



const BRANCH_OFFICES_QUEUES = ['BRANCH_OFFICE_1', 'BRANCH_OFFICE_2'];
 


router.get('/', (req, res, _) => {
  // return all products
  ProductController.readAll()
    .then(products => {
      res.json(products);
    })
});

module.exports = router;