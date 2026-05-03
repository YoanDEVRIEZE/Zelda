import RAPIER from "@dimforge/rapier3d-compat";

export default async function createWorld() {
    await RAPIER.init();
    return new RAPIER.World({ x: 0, y: -9.81, z: 0 });
}
