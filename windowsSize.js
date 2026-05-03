import { WebGLRenderer } from 'three';

const canvas = document.querySelector('canvas');
const renderer = new WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});