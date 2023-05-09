const amqp = require('amqplib/callback_api');
const ProductController = require('../product');
const BRANCH_OFFICES_QUEUES = ['BRANCH_OFFICE_1', 'BRANCH_OFFICE_2'];

const QUEUE = BRANCH_OFFICES_QUEUES[process.argv[3].split('=')[1]];

class rabbitmq {
  // declare class properties: connection, channel, queueName
  constructor(queueName) {
    this.queueName = queueName;
    this.timeout = 2000;
  }

  connect() {
    console.log("[RabbitMQ] Connecting to RabbitMQ...");
    // connect to rabbitmq
    amqp.connect('amqp://localhost', (err0, connection) => {
      if (!err0) {
        connection.createConfirmChannel((err, channel) => {
          if (err) {
            console.log("[RabbitMQ] Error while creating channel!");
          }
          // create a queue
          console.log("[RabbitMQ] Creating queue: " + this.queueName);
          channel.assertQueue(this.queueName, {
            durable: true
          });
          // when the rabbitmq connection is closed, reconnect
          connection.on("close", (err) => {
            console.log("[RabbitMQ] Connection closed!");
            this.connect();
          });

          console.log("[RabbitMQ] Connected to RabbitMQ!");
          // set class properties
          this.connection = connection;
          this.channel = channel;
          this.timeout = 2000;
        });
      }else{
        console.log("[RabbitMQ] Failed to connect, Retrying to connect to RabbitMQ in: " + this.timeout + "ms");
        setTimeout(() => {
          this.connect();
          this.timeout += 500;
          this.timeout = this.timeout > 10000 ? 10000 : this.timeout;
        }
        , this.timeout);
      }
    });
  }

  send(json) {
    if(!this.channel) {
      throw new Error("[RabbitMQ] Channel not initialized!");
    } 

    const msg = JSON.stringify(json);
    this.channel.sendToQueue(this.queueName, Buffer.from(msg), {}, (err, ok) => {
        if (err) {
          console.log("[RabbitMQ] NACK: %s", json);
          return;
        }
        console.log("[RabbitMQ] ACK: %s", json);
        // update product sync status
        ProductController.sync(json.product.id, json.action);
      });

    return new Promise((resolve, reject) => {
      this.channel.waitForConfirms((err) => {
        if(err) {
          console.log("[RabbitMQ] Error while waiting for confirmations: ", err);
          reject(err);
        }
        resolve();
      });
    });
  }

  close() {
    // close connection
    this.connection.close();
  }
}



const rabbitmqConnection = new rabbitmq(QUEUE);

module.exports = rabbitmqConnection;