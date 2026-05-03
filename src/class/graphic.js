import { PCFSoftShadowMap, WebGLRenderer, Timer } from "three";

export default class Graphic extends WebGLRenderer {
    scene = null;
    clock = new Timer();
    camera = null;
    cbUpdate = null;
    cbLoop = null;
    maxDelta = 1 / 30;

    constructor(scene, camera) {
        const canvas = document.querySelector('canvas');
        super({canvas});

        this.scene = scene;
        this.camera = camera;

        this.cbLoop = this.loop.bind(this);
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;
        
        this.loop();
    }

    loop() {
        this.clock.update();
        const delta = Math.min(this.clock.getDelta(), this.maxDelta);

        if(this.cbUpdate) this.cbUpdate(delta);

        this.render(this.scene, this.camera);
        requestAnimationFrame(this.cbLoop);
    }

    onUpdate(callback) {
        this.cbUpdate = callback;
    }
}
