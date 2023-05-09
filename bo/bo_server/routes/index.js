const express = require("express");
const rabbitmqConnection = require('../rabbitmq');
const router = express.Router();

const ProductController = require('../product');

const actions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
}

try{
  rabbitmqConnection.connect()
}catch(err) {
  console.log("[RabbitMQ] Error while connecting to RabbitMQ");
}

router.get('/', (req, res, _) => {
  // return all products
  ProductController.readAll()
  .then(products => {
    res.json(products);
  }
  )
});

router.get('/sync', (req, res, _) => getSync(res));

const getSync = function(res=null){
  let error = false;
  console.log("[RabbitMQ] Sending sync request to RabbitMQ");
  ProductController.readUnsynced()
    .then(unsyncedProducts => {
        // foreach unsynced product, send a message to the rabbitmq queue
        unsyncedProducts.forEach( unsynced => {
            const message = {
                product: unsynced,
                action: ''
            }
            if(unsynced.delete_sync == 1) {
                message.action = actions.DELETE;
            }else if(unsynced.create_sync == 1) {
                message.action = actions.CREATE;
            }else if(unsynced.update_sync == 1) {
                message.action = actions.UPDATE;
            }
            try{
                rabbitmqConnection.send(message)
            }catch(err) {
              if(!error && res != null){
                res.status(500).send("Error while sending message to RabbitMQ, please try again!");
                console.log("[RabbitMQ] Error while sending message to RabbitMQ");
                error = true;
                return;
              }
            }
        });
        if(!error && res != null) 
          res.send("Sync request for " + unsyncedProducts.length + " products sent succesfully!");
    })
};

setInterval(() => {
  getSync();
}, 15000);


router.get('/:id', (req, res, _) => {
  // return product by id
  // Access-Control-Allow-Origin: *
  ProductController.readById(req.params.id)
  .then(product => {
    res.json(product);

  })

});

router.post('/', (req, res, _) => {
  // create product
  console.log(req.body);
  ProductController.create(req.body)
  .then(product => {
    // send a message to the rabbitmq queue
    const message = {
      product: product,
      action: actions.CREATE
    }
    try{
      rabbitmqConnection.send(message);
    }catch(err) {
      console.log("[RabbitMQ] Error while sending message to RabbitMQ");
    }
    res.json(product);
  });
});

router.put('/:id', (req, res, _) => {
  // update product
  req.body.id = req.params.id;
  ProductController.update(req.body)
  .then(product => {
    res.json(product);
  })
});

router.delete('/:id', (req, res, _) => {
  // delete product
  ProductController.delete(req.params.id)
  .then(product => {
    res.json(product);
  })
});



module.exports = router;