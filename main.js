const { spawn } = require('child_process');


// open a terminal and run: cd ho/ho_server && npm start port=4001
console.log("Executing ho_server 1");
spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', 'cd ho/ho_server && npm start port=8000'], {
    detached: true,
}).unref();



// open a terminal and run as admin: cd bo/bo_server && npm start port=4002
console.log("Executing bo_server 1");
spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', 'cd bo/bo_server && npm start port=8001 queue=0'], {
    detached: true,
}).unref();



// open a terminal and run: cd bo/bo_server && npm start port=4003
console.log("Executing bo_server 2");
spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', 'cd bo/bo_server && npm start port=8002 queue=1'], {
    detached: true,
}).unref();



