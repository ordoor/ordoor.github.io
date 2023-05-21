let greetings = ['Greetings.', 'Howdy!', 'Hello!', 'Hi!', 'Welcome!']
document.querySelector('#greeting') ? document.querySelector('#greeting').innerHTML = greetings[(Math.floor(Math.random() * greetings.length))] : null
document.querySelector('#audio-play')?.addEventListener('mousedown', function (e) {
    this.classList.add('clicked')
    console.log(e, this)
    if (this.classList.contains('playing')) {
        document.querySelector('.audio-div > audio.playing').pause()
        document.querySelector('.audio-div > audio.playing').currentTime = 0
        this.classList.remove('playing')
        document.querySelector('.audio-div > audio.playing').classList.remove('playing')
        document.querySelector('#audio-title').innerHTML = 'Not playing'
    } else {
        playingAudio = document.querySelectorAll('.audio-div > audio')[Math.floor(Math.random() * document.querySelectorAll('.audio-div > audio').length)]
        playingAudio.play()
        playingAudio.classList.add('playing')
        this.classList.add('playing')
        document.querySelector('#audio-title').innerHTML = 'Now Playing:' + playingAudio.innerHTML
    }
})
document.querySelector('#audio-play')?.addEventListener('mouseup', function (e) {
    this.classList.remove('clicked')
    console.log(e, this)
})
document.querySelector('.audio-div > input')?.addEventListener('change', function (e) {
    let audioinp = this
    document.querySelectorAll('.audio-div > audio').forEach(function (audioele) {
        audioele.volume = audioinp.value / 100
    })
})
document.querySelectorAll('.audio-div > audio')?.forEach(function (audioele) {
    audioele.volume = document.querySelector('.audio-div > input').value / 100
})
if(location.pathname !== '/audio_player/'){ sessionStorage.setItem('FUN', Math.floor(Math.random() * 100)) }
document.FUNtrigger = function(value) {
    sessionStorage.setItem('FUN', value)
    FUNtrigger()
}
function FUNtrigger() {
    if ([12, 66].find(x=>{return sessionStorage.FUN == x})) {
        document.querySelector('#secret')?.classList.remove('hidden')
    }
}
FUNtrigger()
// get site info
var site_data
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    site_data = JSON.parse(this.responseText);
    window['site_data'] = site_data
  }
};
xhttp.open("GET", "https://weirdscifi.ratiosemper.com/neocities.php?sitename=ordoor", true);
xhttp.send();