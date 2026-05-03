import { Object3D } from "three";
import { createRigidBodyFixed } from "../tools/function";
import Area from "./area";

export default class World extends Object3D {
    areas = [];

    constructor(meshes, colliders, areas, physic) {
        super();

        this.initPhysic(colliders, physic);
        this.initVisual(meshes);
        this.initAreas(areas);
    }

    initPhysic(colliders, physic) {
        for(const mesh of colliders) {
            createRigidBodyFixed(mesh, physic);
        }
    }

    initVisual(meshes) {
        for(const mesh of meshes) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            this.add(mesh);
        }
    }

    initAreas(areas) {
        for(const area of areas) {
            this.areas.push(new Area(area));
        }
    }
}
