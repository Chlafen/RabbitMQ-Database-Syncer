<h1>RabbitMQ Database Syncer </h1>

  <h2>Description</h2>
<p>This is a RabbitMQ database syncer that uses Express for the backend and ReactJS for the frontend. The purpose of this application is to synchronize 
  data between a central database and many (two) branch databases using RabbitMQ as a message broker.
</p>
<h2>Tech</h2>
<p>Epress and ReactJS</p>
<h2>Installation</h2>
<ol>
  <li>Clone the repository to your local machine.</li>
  <li>Navigate to the root directory of the project in your terminal.</li>
  <li>Run <code>npm install</code> inside '/', '/ho' and '/bo' to install the required dependencies.</li>
  <li>To start the application, run <code>npm start</code>. or <code>node main.js</code></li>
</ol>
<h2>Configuration</h2>
<p>To configure the application, open the <code>main.js</code> file and change the port numbers as desired.</p>
<h2>Usage</h2>
<p>To use the application, start it with <code>npm start</code>. Once it's running, navigate to <code>localhost:CLIENT_PORT</code> in your web browser. From there, you can enter the necessary information to synchronize your databases.</p>
