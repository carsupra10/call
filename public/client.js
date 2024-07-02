const socket = io();
let localStream;
let peers = new Map(); // Map to store SimplePeer instances for each peer

const startButton = document.getElementById('startButton');
const remoteAudiosContainer = document.getElementById('remoteAudios');
let isMicOn = false;

startButton.addEventListener('click', async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    startButton.disabled = true;

    const peer = new SimplePeer({ initiator: true, stream: localStream });

    peer.on('signal', (data) => {
      socket.emit('signal', data);
    });

    peer.on('stream', (stream) => {
      const remoteAudio = document.createElement('audio');
      remoteAudio.srcObject = stream;
      remoteAudio.autoplay = true;
      remoteAudiosContainer.appendChild(remoteAudio);
    });

    socket.on('signal', (signal) => {
      peer.signal(signal);
    });

    socket.on('disconnect', () => {
      peer.destroy(); // Clean up when server disconnects
      peers.forEach(p => p.destroy());
      peers.clear();
    });

    peers.set('self', peer); // Store self peer

  } catch (err) {
    console.error('Error accessing media devices: ', err);
  }
});

// Toggle mic control
const toggleMicButton = document.getElementById('toggleMicButton');
toggleMicButton.addEventListener('click', () => {
  if (localStream) {
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    isMicOn = !isMicOn;
    toggleMicButton.innerHTML = isMicOn ? '<i class="bi bi-mic"></i> Mute Mic' : '<i class="bi bi-mic-mute"></i> Unmute Mic';
  }
});
