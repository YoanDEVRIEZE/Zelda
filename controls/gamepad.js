import  { floor, angle } from '../src/tools/function.js';

const ATTACK = 0;
const JUMP = 1;
const LOCK = 7;
const X = 0;
const Z = 1;
const KEY_UP = ['KeyW', 'KeyZ', 'ArrowUp'];
const KEY_DOWN = ['KeyS', 'ArrowDown'];
const KEY_LEFT = ['KeyA', 'KeyQ', 'ArrowLeft'];
const KEY_RIGHT = ['KeyD', 'ArrowRight'];
const KEY_ATTACK = ['Space'];
const KEY_JUMP = ['KeyE'];
const KEY_LOCK = ['ShiftLeft', 'ShiftRight', 'KeyC'];

export default class Gamepad {
    keys = new Set();
    mouse = {
        attack: false,
        lock: false,
    };

    constructor() {
        addEventListener('keydown', this.onKeyDown);
        addEventListener('keyup', this.onKeyUp);
        addEventListener('mousedown', this.onMouseDown);
        addEventListener('mouseup', this.onMouseUp);
        addEventListener('contextmenu', this.onContextMenu);
        addEventListener('blur', this.onBlur);
    }

    get gamepad () {
        return navigator.getGamepads().find(g => g && g.connected);
    }

    get x() {
        const axis = this.gamepad ? floor(this.gamepad.axes[X]) : 0;
        if(axis) return axis;

        return this.keyboardX;
    }

    get z() {
        const axis = this.gamepad ? floor(this.gamepad.axes[Z]) : 0;
        if(axis) return axis;

        return this.keyboardZ;
    }

    get attack() {
        const pressed = this.gamepad?.buttons[ATTACK]?.pressed;
        return Boolean(pressed || this.mouse.attack || this.hasAny(KEY_ATTACK));
    }

    get jump() {
        const pressed = this.gamepad?.buttons[JUMP]?.pressed;
        return Boolean(pressed || this.hasAny(KEY_JUMP));
    }
    
    get lock() {
        const pressed = this.gamepad?.buttons[LOCK]?.pressed;
        return Boolean(pressed || this.mouse.lock || this.hasAny(KEY_LOCK));
    }

    get angle() {
        return angle(this.x, this.z);
    }

    get moving() {
        return Math.abs(this.x) || Math.abs(this.z);
    }

    get keyboardX() {
        return this.axis(KEY_LEFT, KEY_RIGHT);
    }

    get keyboardZ() {
        return this.axis(KEY_UP, KEY_DOWN);
    }

    axis(negative, positive) {
        return this.valueOf(positive) - this.valueOf(negative);
    }

    valueOf(keys) {
        return this.hasAny(keys) ? 1 : 0;
    }

    hasAny(keys) {
        return keys.some(key => this.keys.has(key));
    }

    onKeyDown = ({ code }) => {
        this.keys.add(code);
    }

    onKeyUp = ({ code }) => {
        this.keys.delete(code);
    }

    onMouseDown = ({ button }) => {
        if(button === 0) this.mouse.attack = true;
        if(button === 2) this.mouse.lock = true;
    }

    onMouseUp = ({ button }) => {
        if(button === 0) this.mouse.attack = false;
        if(button === 2) this.mouse.lock = false;
    }

    onContextMenu = (event) => {
        event.preventDefault();
    }

    onBlur = () => {
        this.keys.clear();
        this.mouse.attack = false;
        this.mouse.lock = false;
    }
}
