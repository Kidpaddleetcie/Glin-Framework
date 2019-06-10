// id="drag"  => Pour rendre bougeable avec le click;
let micro = document.querySelector(".micro_drag");

dragElement(micro);

function dragElement(elmnt) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        elmnt.style.zIndex = 3;
        elmnt.style.position = "absolute";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.style.zIndex = 2;
    }
}

let values;
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(function(stream) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
        javascriptNode.onaudioprocess = function() {
            array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            values = 0;

            length = array.length;
            for (let i = 0; i < length; i++) {
                values += (array[i]);
            }

            average = values / length;


            if (average < 60) {
                micro.style.transform = "scale(" + (Math.round(average) / 100 + 1) + "," + (Math.round(average) / 100 + 1) + ")"
                micro.style.position = "absolute";
                micro.style.padding = average / 5 + "px";
            } else {
                micro.style.transform = "scale(" + (Math.round(average) / 100 + 1) + "," + (Math.round(average) / 100 + 1) + ")"
                micro.style.position = "absolute";
                micro.style.padding = average / 10 + "px";
            }
        }
    })
    .catch(function(err) {});