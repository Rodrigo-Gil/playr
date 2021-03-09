let app = {
    //global variables that will be used on the app
    volume: 0.5,
    currIndex: "",
    currStatus: "",
    musicSelected: false,
    media:null,
    trackPage: document.querySelector("#track_info"),
    tracks: [
        {
        //src: 'file:///android_asset/www/media/the_miracle_of_joey_ramone.mp3',
        src: './media/the_miracle_of_joey_ramone.mp3',
        img: './img/u2_songs.jpeg',
        artist: 'U2',
        track: 'The Miracle (of Joey Ramone)',
        album: 'Songs of Innocence',
        length: 255.4253
    },
    {
        //src: 'file:///android_asset/www/media/every_breaking_wave.mp3',
        src: './media/every_breaking_wave.mp3',
        img: './img/u2_songs.jpeg',
        artist: 'U2',
        track: 'Every Breaking Wave',
        album: 'Songs of Innocence',
        length: 252.2122
    },
    {
        //src: 'file:///android_asset/www/media/california.mp3',
        src: './media/california.mp3',
        img: './img/u2_songs.jpeg',
        artist: 'U2',
        track: 'California (There is no End to Love)',
        album: 'Songs of Innocence',
        length: 239.9085
    },
    {
        //src: 'file:///android_asset/www/media/entre_nos_dois.mp3',
        src: './media/entre_nos_dois.mp3',
        img: './img/malta_supernova.jpeg',
        artist: 'Malta',
        track: 'Entre Nos Dois',
        album: 'Supernova',
        length: 205.296327
    },
    {
        //src: 'file:///android_asset/www/media/memorias.mp3',
        src: './media/memorias.mp3',
        img: './img/malta_supernova.jpeg',
        artist: 'Malta',
        track: 'Memorias (Come Wake Me Up)',
        album: 'Supernova',
        length: 230.739592
    }
],
    status:{
        '0':'MEDIA_NONE',
        '1':'MEDIA_STARTING',
        '2':'MEDIA_RUNNING',
        '3':'MEDIA_PAUSED',
        '4':'MEDIA_STOPPED'
    },
    err:{
        '1':'MEDIA_ERR_ABORTED',
        '2':'MEDIA_ERR_NETWORK',
        '3':'MEDIA_ERR_DECODE',
        '4':'MEDIA_ERR_NONE_SUPPORTED'
    },
    init: function() {
        document.addEventListener('deviceready', app.ready, false);
    },
    ready: function() {
        app.listBuild();
        app.addListeners();
    },
    listBuild: () => {
        //looping over the tracks array to build the list on the home page
        let list = document.querySelector("#music_list");
        app.tracks.forEach((el) => {
            //creating each element on the page
            let musicDiv = document.createElement('div');
            let img = document.createElement('img');
            let song = document.createElement('p');
            let artist = document.createElement('p');
            //inserting the content inside the elements
            img.src = el.img;
            img.classList.add("album_picture");
            song.textContent = el.track;
            artist.textContent = el.artist;
            //saving the index for each music on the DOM
            musicDiv.setAttribute("index", app.tracks.indexOf(el));
            musicDiv.classList.add("music_card");
            //adding the attribute for navigation
            musicDiv.setAttribute("data-target", "media_player");
            //appending elements on the list
            musicDiv.append(img);
            musicDiv.append(song);
            musicDiv.append(artist);
            //appending the list on the page
            list.append(musicDiv);
        });
    },
    handlePlay: (ev) => {
        //this function is responsible for handling the music app
        //setting true if the music was selected by the user
        app.musicSelected = true;
        //getting the index of the clicked music
        let index = parseInt(ev.target.closest('div').getAttribute('index'));
        console.log("the current index is: " + index);
        app.currIndex = index
        //activating navigation
        document.querySelector(".page.active").classList.remove("active");
        document.querySelector("#media_player").classList.add("active");
        //activating the button on the homePage to return to the current media.
        document.querySelector("#toMediaBtn").classList.add("active");
        //checking if the another music is playing
        if (app.media!= null) {
            app.media.stop();
        } else {
            app.musicStart();
        }
    },
    musicStart: function (ev) {
        //getting the tracks source
        let src = app.tracks[app.currIndex].src;
        app.media = new Media(src, app.success, app.failure, app.statusChange);
        console.log(app.media);
        //cleaning the page with old music info;
        app.trackPage.innerHTML = "";
        //automatically playing the music
        app.play();
        //showing and updating the name of the song
        app.musicName();
        //activating and updating music duration
        app.musicDuration();
        //activating the timer
        app.timer();
        //resetting the global variable if another music was not selected
        app.musicSelected = false;
    },
    musicName: () => {
        //creating the elements on the page
        let musicDiv = document.createElement('div');
        let music = document.createElement('h2');
        let artist = document.createElement('h3')
        //inserting the data inside the elements
        music.textContent = app.tracks[app.currIndex].track;
        artist.textContent = app.tracks[app.currIndex].artist;
        //wrapping the content inside the div
        musicDiv.classList.add('musicName');
        //appending the elements on the page;
        musicDiv.append(music);
        musicDiv.append(artist);
        app.trackPage.append(musicDiv);
    },
    timer: () => {
        //creating elements on the page
        let timerPara = document.createElement('p');
        timerPara.classList.add("timer");
        app.trackPage.append(timerPara);
        console.log("timer-started");
        //initializing the timer
        let timer = setInterval(() => app.media.getCurrentPosition((pos => {
            if (pos < app.media.getDuration() && app.status['2']) {
                //creating elements on the page
                console.log("Current position is: " + pos);
                timerPara.innerHTML = "Current position is: " + pos;
            } else {
                clearInterval(timer);
            }
        })), 1000)
    },
    musicDuration: () => {
        //creating the elements in case it does not exist.
        let musicLength = document.createElement('p');
        musicLength.classList.add('music_length');
        musicLength.innerHTML = "Total Duration: " + app.tracks[app.currIndex].length;
        app.trackPage.append(musicLength);
    },
    success: function(){
        //moving to the next song automatically once one song finishes.
        if (app.musicSelected == false && app.currIndex < (app.tracks.length - 1)) {
            console.log("song finished")
            app.currIndex = app.currIndex + 1;
            console.log(app.currIndex)
            app.musicStart();
        } else {
            //release memory on the device
            app.media.release();
            //start another music
            app.musicStart();
        }
        },
    failure: function(err){
        //failure of playback of media object
        console.warn('failure');
        console.error(err);
    },
    statusChange: function(status){
        //app.currStatus = status;
        console.log('media status is now ' + app.status[status] );
    },
    addListeners: function(){
        //adding an event listener for each music div on the list
        document.querySelectorAll(".music_card").forEach((el)=> {
            el.addEventListener('click', app.handlePlay);
        })
        document.querySelector('#back-home').addEventListener('click', app.nav);
        document.querySelector('#play-btn').addEventListener('click', app.play);
        document.querySelector('#toMediaBtn').addEventListener('click', app.nav)
        document.querySelector('#pause-btn').addEventListener('click', app.pause);
        document.querySelector('#up-btn').addEventListener('click', app.volumeUp);
        document.querySelector('#down-btn').addEventListener('click', app.volumeDown);
        document.querySelector('#ff-btn').addEventListener('click', app.ff);
        document.querySelector('#rew-btn').addEventListener('click', app.rew);
        /*document.addEventListener('pause', ()=>{
            app.media.release();
        });*/
    },
    play: function(){
        app.media.play();
        if (app.currStatus = 'MEDIA_STARTING') {
            console.log(app.tracks[app.currIndex].track + " - " + app.tracks[app.currIndex].artist);
        }
    },
    pause: function(){
        app.media.pause();
    },
    volumeUp: function(){
        vol = parseFloat(app.volume);
        console.log('current volume', vol);
        vol += 0.1;
        if(vol > 1){
            vol = 1.0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        app.volume = vol;
    },
    volumeDown: function(){
        vol = app.volume;
        console.log('current volume', vol);
        vol -= 0.1;
        if(vol < 0){
            vol = 0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        app.volume = vol;
    },
    ff: function(){
        app.media.getCurrentPosition((pos)=>{
            let dur = app.media.getDuration();
            console.log('current position', pos);
            console.log('duration', dur);
            pos += 10;
            if(pos < dur){
                app.media.seekTo( pos * 1000 );
            }
        });
    },
    rew: function(){
        app.media.getCurrentPosition((pos)=>{
            pos -= 10;
            if( pos > 0){
                app.media.seekTo( pos * 1000 );
            }else{
                app.media.seekTo(0);
            }
        });
    },
    nav: (ev) => {
        let btn = ev.target;
        console.log(btn);
        let target = btn.getAttribute("data-target");
        console.log("Navigate to", target);
        document.querySelector(".page.active").classList.remove("active");
        document.getElementById(target).classList.add("active");
    }
};
//initializing the application
app.init();