import io from 'socket.io-client';
import MediaStreamRecorder from 'msr';

const socket = io('ws://localhost:3000');

const startButton = document.getElementById('start-streaming');
const stopButton = document.getElementById('stop-streaming');
const currentStatusField = document.getElementById('current-status');

function setStatusText(text) {
    currentStatusField.innerText = text;
}

let mediaRecorder;
startButton.onclick = () => {
    setStatusText('Requesting access to audio');
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        setStatusText('Access to audio granted');
        mediaRecorder = new MediaStreamRecorder(stream)
        mediaRecorder.mimeType = 'audio/wav';

        let chunks = [];
        mediaRecorder.ondataavailable = function(e) {
            console.log('available');
            chunks.push(e.data);
            if (chunks.length >= 5) {
                sendData(chunks);
                chunks = [];
            }
        };

        mediaRecorder.start(500);
        setStatusText('Active – recording');
    });
};

stopButton.onclick = () => {
    mediaRecorder.stop();
    setStatusText('Inactive');
}
function sendData(buffer) {
    console.log('** sending data');
    const blob = new Blob(buffer, { 'type' : 'audio/wav' });
    socket.emit('audiodata', blob);
}
