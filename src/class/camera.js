import { PerspectiveCamera } from "three";

export default class Camera extends PerspectiveCamera {
    constructor() {
        super(62, innerWidth / innerHeight);
        this.position.set(0, 4, 2.9);
        this.lookAt(0, 1.1, 0);
    }

    update(player) {
        this.position.copy(player.position);
        this.position.y += 4;
        this.position.z += 2.9;
        this.lookAt(player.position.x, player.position.y + 1.1, player.position.z);
    }
}
