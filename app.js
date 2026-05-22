import { Scene } from 'three';
import Camera from './src/class/camera.js';
import Light from './src/class/light.js';
import Graphic from './src/class/graphic.js';
import { loadWorld, loadEntity } from './src/tools/loader.js';
import World from './src/class/world.js';
import Player from './src/class/player.js';
import Physic from './src/class/physic.js';
import Enemy from './src/class/enemy.js';
import Boss from './src/class/boss.js';

const assetWorld = await loadWorld('./glb/world2.glb');
const assetEntity = await loadEntity('./glb/character.glb');
const assetEnemy = await loadEntity('./glb/mob2.glb');
const assetBoss = await loadEntity('./glb/bowser.glb');

const scene = new Scene();
const camera = new Camera();
const physic = await Physic();
const world = new World(assetWorld.visuals, assetWorld.colliders, assetWorld.areas, physic);
const light = new Light();
const player = new Player(assetEntity, physic);
const enemy = new Enemy(assetEnemy, physic);
const boss = new Boss(assetBoss, physic);

scene.add(world);
scene.add(light);
scene.add(player);
scene.add(enemy);
scene.add(boss);

const graphic = new Graphic(scene, camera);

graphic.onUpdate((dt) => {
    physic.step();
    player.update(dt, world.areas, [enemy, boss]);
    enemy.update(dt, player);
    boss.update(dt, player);
    camera.update(player);
    light.update(player);
});
