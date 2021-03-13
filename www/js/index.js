let app = {
    //global variables that will be used on the app
    volume: 0.5,
    currIndex: "",
    musicSelected: false,
    media:null,
    trackPage: document.querySelector("#track_info"),
    tracks: [
        {
        src: 'file:///android_asset/www/media/Paradise_City.mp3',
        //src: './media/Paradise_City.mp3',
        img: './img/guns.jpeg',
        artist: 'Guns n Roses',
        track: 'Paradise City',
        album: 'Appetite for Destruction',
        length: 408.26800
    },
    {
        src: 'file:///android_asset/www/media/Welcome_to_the_jungle.mp3',
        //src: './media/Welcome_to_the_jungle.mp3',
        img: './img/guns.jpeg',
        artist: 'Guns n Roses',
        track: 'Welcome to the Jungle',
        album: 'Appetite for Destruction',
        length: 273.8680
    },
    {
        src: 'file:///android_asset/www/media/worst_day_ever.mp3',
        //src: './media/worst_day_ever.mp3',
        img: './img/simple_plan.jpg',
        artist: 'Simple Plan',
        track: 'The Worst Day Ever',
        album: 'Simple Plan',
        length: 207.2030
    },
    {
        src: 'file:///android_asset/www/media/addicted.mp3',
        //src: './media/addicted.mp3',
        img: './img/simple_plan.jpg',
        artist: 'Simple Plan',
        track: 'Addicted',
        album: 'No Pads, no Helmets... Just Balls',
        length: 236.800
    },
    {
        src: 'file:///android_asset/www/media/god_must_hate_me.mp3',
        //src: './media/god_must_hate_me.mp3',
        img: './img/simple_plan.jpg',
        artist: 'Simple Plan',
        track: 'God Must Hate Me',
        album: 'No Pads, no Helmets... Just Balls',
        length: 164.5980
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
    init: () => {
        document.addEventListener('deviceready', app.ready, false);
    },
    ready: () => {
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
            let song = document.createElement('span');
            let artist = document.createElement('span');
            //inserting the content inside the elements
            img.src = el.img;
            img.classList.add("album_picture");
            song.textContent = el.track + " - " + el.artist;
            //saving the index for each music on the DOM
            musicDiv.setAttribute("index", app.tracks.indexOf(el));
            musicDiv.classList.add("music_card");
            //adding the attribute for navigation
            musicDiv.setAttribute("data-target", "media_player");
            //appending elements on the list
            musicDiv.append(img);
            musicDiv.append(song);
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
    musicStart: (ev) => {
        //getting the tracks source
        let src = app.tracks[app.currIndex].src;
        app.media = new Media(src, app.success, app.failure, app.statusChange);
        console.log(app.media);
        //cleaning the page with old music info;
        app.trackPage.innerHTML = "";
        //automatically playing the music
        app.media.play();
        //showing the pause button automatically, once the music starts
        document.querySelector("#pause-btn").classList.add('active-btn');
        document.querySelector('#play-btn').classList.remove('active-btn');
        //showing and updating the name of the song
        app.musicName();
        //activating the timer
        app.timer();
        //activating and updating music duration
        app.musicDuration();
        //resetting the global variable if another music was not selected
        app.musicSelected = false;
    },
    musicName: () => {
        //creating the elements on the page
        let musicDiv = document.createElement('div');
        let music = document.createElement('h2');
        let artist = document.createElement('h3');
        let albumPic = document.createElement('img');
        //inserting the data inside the elements
        albumPic.src = app.tracks[app.currIndex].img;
        albumPic.classList.add("background_img");
        music.textContent = app.tracks[app.currIndex].track;
        artist.textContent = app.tracks[app.currIndex].artist;
        //wrapping the content inside the div
        musicDiv.classList.add('musicName');
        //appending the elements on the page;
        musicDiv.append(music);
        musicDiv.append(artist);
        musicDiv.append(albumPic);
        app.trackPage.append(musicDiv);
    },
    timer: () => {
        //creating elements on the page
        let timerPara = document.createElement('p');
        timerPara.classList.add("timer");
        app.trackPage.append(timerPara);
        //initializing the timer
        setInterval(() => app.media.getCurrentPosition((pos => {
            if (pos > -1 ) {
                let time = app.timeConverter(pos)
                timerPara.innerHTML = "Current position is: " + time;
            }
        })), 1000)
    },
    timeConverter:(time) => {
        //function to convert time into mm:ss standard
        let parsedTime = parseInt(time);
        let minutes = Math.floor(time/60);
        let seconds = Math.floor(time - minutes * 60);
        return minutes+":" + seconds.toString().padStart(2, '0');
    },
    musicDuration: () => { 
        //creating the elements in case it does not exist.
        let duration = app.timeConverter(app.tracks[app.currIndex].length);
        let musicLength = document.createElement('p');
        musicLength.classList.add('music_length');
        musicLength.innerHTML = "Total Duration: " + duration;
        app.trackPage.append(musicLength);
    },
    success: () => {
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
    statusChange: (status) => {
        console.log('media status is now ' + app.status[status] );
    },
    addListeners: () => {
        //adding an event listener for each music div on the list
        document.querySelectorAll(".music_card").forEach((el)=> {
            el.addEventListener('click', app.handlePlay);
        })
        document.querySelector('#back-home').addEventListener('click', app.nav);
        document.querySelector('#play-btn').addEventListener('click', (ev) => {
            ev.target.classList.toggle('active-btn');
            document.querySelector('#pause-btn').classList.add('active-btn');
            app.play();
        });
        document.querySelector('#toMediaBtn').addEventListener('click', app.nav)
        document.querySelector('#pause-btn').addEventListener('click', (ev) => {
            ev.target.classList.toggle('active-btn');
            document.querySelector('#play-btn').classList.add('active-btn');
            app.pause();
        })
        document.querySelector('#up-btn').addEventListener('click', app.volumeUp);
        document.querySelector('#down-btn').addEventListener('click', app.volumeDown);
        document.querySelector('#ff-btn').addEventListener('click', app.ff);
        document.querySelector('#rew-btn').addEventListener('click', app.rew);
        /*document.addEventListener('pause', ()=>{
            app.media.release();
        });*/
    },
    play: () => {
            app.media.play();
    },
    pause: () => {
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