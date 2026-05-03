import { getSrc } from '../tools/function';

export default class Sound {
    tracks = new Map();
    audioContext = null;

    load(key) {
        const srcs = getSrc(key);
        const track = [];

        for (const src of srcs) {
            const audio = new Audio(src);
            track.preload = 'auto';
            track.push(audio);
        }

        this.tracks.set(key, track);
    }

    play(key) {
        const track = this.tracks.get(key);
        const index = Math.floor(Math.random() * track.length);
        if (!track) return;
        this.unlockAudio();
        track[index].currentTime = 0;
        track[index].play().catch(() => {});
    }

    unlockAudio() {
        if (!this.audioContext) {
            const Context = window.AudioContext || window.webkitAudioContext;
            if (!Context) return;

            this.audioContext = new Context();
        }

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(() => {});
        }
    }
}
