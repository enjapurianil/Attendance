import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  id = (val: string) => document.getElementById(val);
  ul = this.id('ul');
  stream!: any;
  recorder!: any;
  counter = 1;
  chunks!: any;
  media!: any;


  gUMbtn() {
    let mv = this.id('mediaVideo'),
      mediaOptions = {
        video: {
          tag: 'video',
          type: 'video/webm',
          ext: '.mp4',
          gUM: { video: true, audio: true }
        },
        audio: {
          tag: 'audio',
          type: 'audio/ogg',
          ext: '.ogg',
          gUM: { audio: true }
        }
      };
//this.media = mv.checked ? mediaOptions.video : mediaOptions.audio;
    navigator.mediaDevices.getUserMedia(mediaOptions.audio.gUM).then(_stream => {
      this.stream = _stream;
      // this.id('gUMArea').style.display = 'none';
      // this.id('btns').style.display = 'inherit';
      // this.start.removeAttribute('disabled');
      this.recorder = new MediaRecorder(this.stream);
      this.recorder.ondataavailable = (e:any) => {
        this.chunks.push(e.data);
      };
      console.log('got media successfully');
    })
  }
  
  start() {
   // this.start.disabled = true;
   // stop.removeAttribute('disabled');
    this.chunks = [];
    this.recorder.start();
  }
  
  
  stop() {
   // stop.disabled = true;
    this.recorder.stop();
   // this.start.removeAttribute('disabled');
  }
  
   makeLink() {
  let blob = new Blob(this.chunks, { type: 'audio/ogg' })
    , url = URL.createObjectURL(blob)
    , li = document.createElement('li')
    , mt = document.createElement(this.media.tag)
    , hf = document.createElement('a')
    ;
  mt.controls = true;
  mt.src = url;
  hf.href = url;
 // hf.download = `${counter++}${media.ext}`;
  hf.innerHTML = `donwload ${hf.download}`;
  li.appendChild(mt);
  li.appendChild(hf);
 // ul.appendChild(li);
}
}
