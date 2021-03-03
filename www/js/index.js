let app = {
    volume: 0.5,
    srcIndex: "",
    tracks: [
        {
        //src: 'file:///android_asset/www/media/the_miracle_of_joey_ramone.mp3',
        src: './media/the_miracle_of_joey_ramone.mp3',
        artist: 'U2',
        track: 'The Miracle (of Joey Ramone)',
        album: 'Songs of Innocence'
    },
    {
        //src: 'file:///android_asset/www/media/every_breaking_wave.mp3',
        src: './media/every_breaking_wave.mp3',
        artist: 'U2',
        track: 'Every Breaking Wave',
        album: 'Songs of Innocence'
    },
    {
        //src: 'file:///android_asset/www/media/california.mp3',
        src: './media/california.mp3',
        artist: 'U2',
        track: 'California (There is no End to Love)',
        album: 'Songs of Innocence'
    },
    {
        //src: 'file:///android_asset/www/media/entre_nos_dois.mp3',
        src: './media/entre_nos_dois.mp3',
        artist: 'Malta',
        track: 'Entre Nos Dois',
        album: 'Supernova'
    },
    {
        //src: 'file:///android_asset/www/media/memorias.mp3',
        src: './media/memorias.mp3',
        artist: 'Malta',
        track: 'Memorias (Come Wake Me Up)',
        album: 'Supernova'
    }
],
    media:null,
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
        app.addListeners();
        app.firstMusic();
    },
    firstMusic: function () {
        app.srcIndex = 0;
        let src = app.tracks[app.srcIndex].src;
        console.log(app.srcIndex);
        app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
    },
    nxtMusic: function() {
            app.srcIndex = app.srcIndex+1;
            if (app.srcIndex <= (app.tracks.length-1)) {
                console.log(app.tracks.length-1);
                let src = app.tracks[app.srcIndex].src
                console.log(app.srcIndex);
                app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
                app.play();
            } else {
                app.firstMusic();
            };
    },
    ftw: function(){
        //success creating the media object and playing, stopping, or recording
        console.log('success playing the music');
        app.nxtMusic();
    },
    wtf: function(err){
        //failure of playback of media object
        console.warn('failure');
        console.error(err);
    },
    statusChange: function(status){
        console.log('media status is now ' + app.status[status] ); 
    },
    addListeners: function(){
        document.querySelector('#play-btn').addEventListener('click', app.play);
        document.querySelector('#pause-btn').addEventListener('click', app.pause);
        document.querySelector('#up-btn').addEventListener('click', app.volumeUp);
        document.querySelector('#down-btn').addEventListener('click', app.volumeDown);
        document.querySelector('#ff-btn').addEventListener('click', app.ff);
        document.querySelector('#rew-btn').addEventListener('click', app.rew);
        document.addEventListener('pause', ()=>{
            app.media.release();
        });
        // document.addEventListener('menubutton', ()=>{
        //     console.log('clicked the menu button');
        // });
        // document.addEventListener('resume', ()=>{
        //     app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
        // })
    },
    play: function(){
        app.media.play();
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
    }
};

app.init();