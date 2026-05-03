import { AmbientLight, DirectionalLight, Object3D } from "three";

const SUN_INTENSITY = 2;
const SUN_POSITION = [5, 7, 5];
const SUN_SPREAD = 0.35;
const SHADOW_SIZE = 18;
const SHADOW_FAR = 32;
const SUN_SAMPLES = [
    [0, 0, 0, 0.5],
    [SUN_SPREAD, 0, 0, 0.125],
    [-SUN_SPREAD, 0, 0, 0.125],
    [0, SUN_SPREAD, 0, 0.125],
    [0, -SUN_SPREAD, 0, 0.125],
]

export default class Light extends Object3D {
    constructor() {
        super();

        this.ambient = new AmbientLight(0xffffff, 0.5);
        
        this.add(this.ambient);

        this.suns = SUN_SAMPLES.map(([x, y, z, weight], index) => {
            const sun = new DirectionalLight(0xffffff, SUN_INTENSITY * weight);
            sun.position.set(
                SUN_POSITION[0] + x,
                SUN_POSITION[1] + y,
                SUN_POSITION[2] + z
            );

            if(index === 0) {
                sun.castShadow = true;
                sun.shadow.mapSize.set(2048, 2048);
                sun.shadow.bias = -0.0002;
                sun.shadow.normalBias = 0.025;
                sun.shadow.camera.left = -SHADOW_SIZE;
                sun.shadow.camera.right = SHADOW_SIZE;
                sun.shadow.camera.top = SHADOW_SIZE;
                sun.shadow.camera.bottom = -SHADOW_SIZE;
                sun.shadow.camera.near = 1;
                sun.shadow.camera.far = SHADOW_FAR;
                sun.shadow.radius = 2;
                sun.target.position.set(0, -2, 0);
                this.add(sun.target);
            }

            this.add(sun);
            return sun;
        });
    }

    update(player) {
        this.position.copy(player.position);
    }
}
