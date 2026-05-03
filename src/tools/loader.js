import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { browse } from "./function.js";

const glbLoader = new GLTFLoader();

export async function loadWorld(path) {
    const glb = await glbLoader.loadAsync(path);
    const visuals = [];
    const colliders = [];
    const areas = [];

    for(const mesh of glb.scene.children) {
        const name = mesh.name;
        if(name.includes('area')) {
            areas.push(mesh);
        } else if(name.includes('collider')) {
            colliders.push(mesh);
        } else {
            visuals.push(mesh);
        }
    }

    return { visuals, colliders, areas };
}

export async function loadEntity(path) {
    const glb = await glbLoader.loadAsync(path);
    const mesh = glb.scene.children[0];
    browse(mesh, m=>m.castShadow = true);
    mesh.clips = glb.animations;
    
    return mesh;
}
