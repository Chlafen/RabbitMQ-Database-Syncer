// initialize a rabbitmq connection with queue name 'products'
const amqp = require('amqplib/callback_api');
const ProductController = require('../product');

const BRANCH_OFFICES_QUEUES = ['BRANCH_OFFICE_1', 'BRANCH_OFFICE_2'];

const actions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
}

class rabbitmqConsumer {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  connect() {
    amqp.connect('amqp://localhost', (err, connection) => {
      if (err) {
        // try again in 5 seconds
        console.log('[RabbitMQ] !Error while connecting to RabbitMQ, retrying in 5 seconds');
        setTimeout(() => {
          this.connect();
        }
        , 5000);
        return;
      }
      this.connection = connection;
      this.createChannel()
        .then((channel) => {
          console.log('[RabbitMQ] Channel created');
          
          
          
          BRANCH_OFFICES_QUEUES.forEach(QUEUE => {
            // declare QUEUE
            channel.assertQueue(QUEUE, {
              durable: true
            });
            console.log(`[RabbitMQ] Waiting for messages in ${QUEUE}`);

            rabbitmqConnection.consume(channel, QUEUE, (msg) => {
              const json = JSON.parse(msg.content.toString());
              const {action, product} = json;
              const sourceID = product.id;
              console.log(`[RabbitMQ] Received message from ${QUEUE}`);
              console.log(` --> Action: ${action}`);
              console.log(` --> Source ID: ${sourceID}`);
              console.log(` --> Product: `); console.log(product);

          
              switch(action){
                case actions.CREATE:
                  ProductController.create(product, QUEUE, sourceID)
                    .then(_ => {
                      console.log(`[RabbitMQ] Product created successfully`);
                      console.log(`[RabbitMQ] Acknowledging message from ${QUEUE}`);
                      try{
                        channel.ack(msg);
                      }catch(err) {
                        console.log(`[RabbitMQ] !Error while acknowledging message from ${QUEUE}: ${err}`);
                        throw err;
                      }
                    })
                    .catch(err => {
                      console.log(`[RabbitMQ] !Error while creating product: ${err}`);
                      channel.nack(msg);
                    })
                  break;
                case actions.UPDATE:
                  ProductController.update(product, QUEUE, sourceID)
                    .then(_ => {
                      console.log(`[RabbitMQ] Product updated successfully`);
                      console.log(`[RabbitMQ] Acknowledging message from ${QUEUE}`);
                      try{
                        channel.ack(msg);
                      }catch(err) {
                        console.log(`[RabbitMQ] !Error while acknowledging message from ${QUEUE}: ${err}`);
                        throw err;
                      }
                    })
                    .catch(err => {
                      console.log(`[RabbitMQ] !Error while updating product: ${err}`);
                      channel.nack(msg);
                    })
                  break;
                case actions.DELETE:
                  ProductController.delete(QUEUE, sourceID)
                    .then(_ => {
                      console.log(`[RabbitMQ] Product deleted successfully`);
                      console.log(`[RabbitMQ] Acknowledging message from ${QUEUE}`);
                      try{
                        channel.ack(msg);
                      }catch(err) {
                        console.log(`[RabbitMQ] !Error while acknowledging message from ${QUEUE}: ${err}`);
                        throw err;
                      }
                    })
                    .catch(err => {
                      console.log(`[RabbitMQ] !Error while deleting product: ${err}`);
                      channel.nack(msg);
                    })
                  break;
                default:
                  console.log(`[RabbitMQ] Action not recognized: ${action}`);
              }
            }).catch(err => {
              console.log(`[RabbitMQ] !Error while consuming from ${QUEUE}: ${err}`);
            });
        
          });
        })
        .catch(err => {
          console.log(`[RabbitMQ] !Error while creating channel: ${err}`);
        });


    });
  }

  createChannel() {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        return reject('No connection');
      }
      this.connection.createChannel((err, channel) => {
        if (err) {
          reject(err);
        } else {
          this.channel = channel;
          resolve(channel);
        }
      });
    });
  }

  async consume(channel, queue, callback) {
    channel.consume(queue, callback, {
      noAck: false,
    });
  }

  close() {
    this.connection.close();
  }
}



const rabbitmqConnection = new rabbitmqConsumer();

rabbitmqConnection.connect();



module.exports = rabbitmqConnection;