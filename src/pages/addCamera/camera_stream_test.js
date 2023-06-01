const WebSocket = require('websocket').client;

const cameraIP = '192.168.1.110:8080'; // Replace with the appropriate camera IP address
const streamCameraURL = `ws://127.0.0.1:8000/live-camera-reid/stream_camera/${cameraIP}`; // Adjust the URL if necessary

const client = new WebSocket();

client.on('connect', (connection) => {
  console.log('Connected to camera stream');

  connection.on('message', (message) => {
    if (message.type === 'binary') {
      // Process and display the received camera frame
      console.log('Received a camera frame:', message.binaryData.length, 'bytes');
    }
  });

  connection.on('close', () => {
    console.log('Camera stream connection closed');
  });
});

client.on('connectFailed', (error) => {
  console.log('Connection to camera stream failed:', error.toString());
});

client.connect(streamCameraURL);
