const socket = io('/');
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

let peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3030',
});

let myVideoStream;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
}).then((stream) => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);
  peer.on('call', call => {
    
    call.answer(stream)
    const video =document.createElement('video')
    call.on('stream',userVideoStream=>{
      addVideoStream(video,userVideoStream)
    })
  });
});

socket.on('user-connected', (userId) => {
  connectToNewUser(userId, myVideoStream); // Pass myVideoStream as an argument
});

const connectToNewUser = (userId, stream) => { // Add 'stream' as a parameter here
  console.log('New user connected:', userId);
  const call = peer.call(userId, stream); // Use the 'stream' parameter here
 
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
 
  call.on('close', () => {
    video.remove();
  });
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
