// -------------- GLOBAL PARAMS -------------- 

var mute = getElem('.mute-bar_line');
var muteTotal = getElem('.mute-bar').offsetTop;
var muteBar = getElem('.mute-bar');
var progress = getElem('.progress-bar_line');
var progressTotal = getElem('.progress-bar').offsetWidth;
var progressBar = getElem('.progress-bar');
var playerHeader = getElem('.player-header');
var player = getElem('.player')



// ------------- ajax -------------- //

var ajax = new XMLHttpRequest();
ajax.open('GET', 'libs/music/playlist.json', false);

ajax.onreadystatechange = function() { // (3)
    if (ajax.readyState != 4) return;

    const TEMPLATE = getElem('.playlist_template');
    const UL = getElem('.player-content_list');
    let ajaxAnswer = JSON.parse(ajax.responseText);
    let ajaxAnswerItem = ajaxAnswer.playlist;


    ajaxAnswerItem.forEach((item, i=0) => {

        const CLONE_TEMPLATE = TEMPLATE.content.cloneNode(true);
        CLONE_TEMPLATE.querySelector('.player-content_item').setAttribute('audiourl', item.file);
        CLONE_TEMPLATE.querySelector('.player-content_item').setAttribute('audiourl', item.file);
        CLONE_TEMPLATE.querySelector('.player-content_item').setAttribute('author', item.author);
        CLONE_TEMPLATE.querySelector('.player-content_item').setAttribute('track', item.track);
        CLONE_TEMPLATE.querySelector('.player-content_item').setAttribute('image', item.image);
        CLONE_TEMPLATE.querySelector('.player-content_playlist-song-name').innerText += item.track;

        UL.appendChild(CLONE_TEMPLATE);

    });

    getElem('.player-content_item').classList.add('active');
    getElem('.active .mini-play-button').style.visibility= 'visible';
};




ajax.send();
audio();
durationSongs();
leftColoumn();


//  --------- GLOBAL EVENTS ---------------

getElem('.player').addEventListener('click', onClick);



// ----------- functions -------------


function onClick(event) {


    const TARGET = event.target;
    switch (true) {
        case TARGET.parentElement == getElem('.pause'):
        playMod();
        return;
        case TARGET.parentElement == getElem('.play'):
        pauseMod();
        return;
        case TARGET == TARGET.closest('.player-content_item') || TARGET.parentElement == TARGET.closest('.player-content_item'):
        pauseMod();

        onLiClick(TARGET);
        audio();
        playMod();
        leftColoumn();
        return;
        case TARGET.parentElement == getElem('.button_next'):
        playNext();
        return;
        case TARGET.parentElement == getElem('.button_prev'):
        playPrev();
        return;
        case TARGET.parentElement == getElem('.button_mute'):
        audioItem.muted ? audioItem.muted=false : audioItem.muted=true;
        getElem('.button_mute').classList.toggle('checked');
        return;
        case TARGET.parentElement == getElem('.button_random'):
        getElem('.button_random').classList.toggle('checked');
        return;
        case TARGET.parentElement == getElem('.button_circle'):
        getElem('.button_circle').classList.toggle('checked');
        return;  
    }
}

function onLiClick (TARGET) {

    getElem('.active').classList.remove('active');
    TARGET.closest('.player-content_item').classList.add('active');

}
function playMod() {
    event.preventDefault();

    getElem('.button_play').classList.remove('pause');
    getElem('.button_play').classList.add('checked');
    getElem('.button_play').classList.add('play');
    getElem('.active .mini-play-button').style.visibility= 'visible';

    audioItem.play();    

}

function pauseMod() {
    event.preventDefault();
    getElem('.active .mini-play-button').style.visibility= 'hidden';
    getElem('.button_play').classList.remove('checked');
    getElem('.button_play').classList.remove('play');
    getElem('.button_play').classList.add('pause');

    audioItem.pause();

}

function playNext(TARGET) {
    let nextElem = getElem('.active').nextElementSibling;
    let allItems = document.querySelectorAll('.player-content_item');
    let randomItems = Math.floor(Math.random()*allItems.length);

    pauseMod();
    switch (true) {
        case !(getElem('.button_random').classList.contains('checked')) && !(getElem('.button_circle').classList.contains('checked')):
        if (nextElem == null) {
            getElem('.active').classList.remove('active');
            document.querySelectorAll('.player-content_item')[0].classList.add('active');
        } else {

            nextElem.classList.add('active');
            document.querySelectorAll('.active')[0].classList.remove('active');
        }
        audio();
        playMod();
        leftColoumn();
        return;

        case getElem('.button_random').classList.contains('checked'):
        getElem('.active').classList.remove('active');
        document.querySelectorAll('.player-content_item')[randomItems].classList.add('active');
        audio();
        playMod();
        leftColoumn();
        return;
        case getElem('.button_circle').classList.contains('checked'):
        audio();
        playMod();
        return;
    }



}

function playPrev(TARGET) {
    let prevElem = getElem('.active').previousElementSibling;
    let targetItem = document.querySelectorAll('.player-content_item');

    pauseMod();

    if (prevElem == null) {
        getElem('.active').classList.remove('active');
        targetItem[targetItem.length - 1].classList.add('active');
    } else {

        prevElem.classList.add('active');
        document.querySelectorAll('.active')[1].classList.remove('active');
    }

    audio();
    playMod();
    leftColoumn();

}



//update progress using timeupdate event




function rateLine(){ 
   audioItem.addEventListener('timeupdate', function songDuration() {
    var progressRatio = audioItem.currentTime / audioItem.duration;
    progress.style.width = (progressRatio * progressTotal) + "px";
});

   progressBar.addEventListener('click', function(ev) {
    var ratio = ev.offsetX / progressTotal;
    audioItem.currentTime = ratio * audioItem.duration;
});
   getElem('.mute-bar').addEventListener('click', function(ev) {
    var ratioVolume = ev.offsetY/100;
    audioItem.volume = ratioVolume;
    mute.style.top = ev.offsetY + "px";
});


};

function getElem(elem) {
    return typeof elem === 'string' ? document.querySelector(elem) : elem;
}


function leftColoumn() {
    getElem('.player-content_Songs-name').innerText = getElem('.active').getAttribute('track');
    getElem('.player-content_author').innerText = getElem('.active').getAttribute('author');
    if (getElem('.active').getAttribute('image') == 'null') {
        getElem('.player-content_track-album').setAttribute('src', "img/placeholder.png");
        return;
    } else {
        getElem('.player-content_track-album').setAttribute('src', "img/" + getElem('.active').getAttribute('image'));
        return;
    }
    
}



function prettifyTime(time) {
    var sec_num = parseInt(time, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    return minutes + ':' + seconds;
}

function audio() {

    audioItem = new Audio('libs/music/music_files/' + getElem('.active').getAttribute('audiourl'));
    rateLine();
    audioItem.addEventListener("ended", function(){
        playNext();
    });
    return;
}

function durationSongs() {
    let durationBlock = document.querySelectorAll('.player-content_playlist-song-rate');
    let songsArr = document.querySelectorAll('.player-content_item');
    songsArr.forEach((item, i=0) => {
        var song = new Audio('libs/music/music_files/' + songsArr[i].getAttribute('audiourl'));
        song.addEventListener("loadedmetadata", function() {
            var durationSongs = song.duration;
            item.setAttribute('rate', durationSongs);
            durationBlock[i].innerText = prettifyTime(item.getAttribute('rate'));
        })

    })
}


// ------- Drag and Drop ---------------

playerHeader.onmousedown = function(e) {
  var coords = getCoords(playerHeader);
  var shiftX = e.pageX - coords.left;
  var shiftY = e.pageY - coords.top;

  player.style.position = 'absolute';
  moveAt(e);

  function moveAt(e) {
    player.style.left = e.pageX - shiftX + 'px';
    player.style.top = e.pageY - shiftY + 'px';
}

document.onmousemove = function(e) {
    moveAt(e);
}

playerHeader.onmouseup = function() {
    document.onmousemove = null;
    playerHeader.onmouseup = null;
}
playerHeader.ondragstart = function() {
  return false;
}
function getCoords(elem) {   // кроме IE8-
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
}

}
}