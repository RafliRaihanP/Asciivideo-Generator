const canvas = document.getElementById('canvas');
const densityInput = document.getElementById('densityInput');
const localVideoSource = document.getElementById('localVideoSource');
const loadDefaultButton = document.getElementById('loadDefaultButton');
const useWebcamButton = document.getElementById('useWebcamButton');
const canvasWidthInput = document.getElementById('canvasWidth');
const canvasHeightInput = document.getElementById('canvasHeight');
const playButton = document.getElementById('playButton');
const resetButton = document.getElementById('resetButton');
const reverseButton = document.getElementById('reverseButton');
const grayscaleMethodSelect = document.getElementById('grayscaleMethod'); 
const ctx = canvas.getContext('2d');
let playing = false;
let webcamStream = null;
let density = "Ñ@#W$9876543210?!abc;:+=-,_. ";
// localVideo.src = 'final.mp4';
// localVideo.load();

densityInput.addEventListener('input', () => {
    density = densityInput.value;
});

canvasWidthInput.addEventListener('input', () => {
    canvas.width = parseInt(canvasWidthInput.value) || 100;
});

canvasHeightInput.addEventListener('input', () => {
    canvas.height = parseInt(canvasHeightInput.value) || 25;
});

loadDefaultButton.addEventListener('click', () => loadVideo('final.mp4'));

localVideoSource.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadVideo(url);
    }
});

useWebcamButton.addEventListener('click', async () => {
    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
    }
    webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
    localVideo.srcObject = webcamStream;
    localVideo.play();
    renderASCII(localVideo);
});

grayscaleMethodSelect.addEventListener('change', (event) => {
    grayscaleMethod = event.target.value;
});

reverseButton.addEventListener('click', () => {
    densityInput.value = densityInput.value.split('').reverse().join(''); 
    density = densityInput.value; 
});

playButton.addEventListener('click', toggleVid);
function toggleVid() {
    if (playing) {
        localVideo.pause();
        playButton.textContent = 'Play';
    } else {
        localVideo.play();
        playButton.textContent = 'Pause';
        renderASCII(localVideo);
    }
    playing = !playing;
}

function loadVideo(src) {
    localVideo.src = src;
    localVideo.load();
    localVideo.play();
    renderASCII(localVideo);
}

function renderASCII(videoElement) {
    videoElement.addEventListener('play', function() {
        function drawFrame() {
            if (videoElement.paused || videoElement.ended) return;
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let asciiImage = "";
            for (let j = 0; j < canvas.height; j++) {
                for (let i = 0; i < canvas.width; i++) {
                    const pixelIndex = (i + j * canvas.width) * 4;
                    r = imageData.data[pixelIndex];
                    g = imageData.data[pixelIndex + 1];
                    b = imageData.data[pixelIndex + 2];
                    
                    let avg;
                    switch(grayscaleMethod) {
                        case 'average':
                            avg = (r + g + b) / 3; 
                            break;
                        case 'luminance':
                            avg = r * 0.2126 + g * 0.7152 + b * 0.0722; 
                            break;
                        case 'weighted':
                            avg = r * 0.299 + g * 0.587 + b * 0.114; 
                            break;
                        case 'max':
                            avg = Math.max(r, g, b); 
                            break;
                        case 'min':
                            avg = Math.min(r, g, b); 
                            break;
                        default:
                            avg = (r + g + b) / 3; 
                    }

                    const charIndex = Math.floor(avg / 255 * (density.length - 1));
                    const c = density.charAt(charIndex);
                    asciiImage += c === " " ? "&nbsp;" : c;
                }
                asciiImage += "<br/>";
            }
            asciiDiv.innerHTML = asciiImage;
            requestAnimationFrame(drawFrame);
        }
        drawFrame();
    }, false);
}

resetButton.addEventListener('click', () => {
    location.reload();
});
