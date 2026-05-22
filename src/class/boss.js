import { Object3D, Vector3 } from "three";
import { createRigidBodyEntity, range } from "../tools/function";
import Sound from "./sound";

const SCALE = 0.08;
const SPEED = 1.2;
const CHASE_RANGE = 12;
const ATTACK_RANGE = 2.25;
const ATTACK_WINDUP = 0.9;
const ATTACK_HIT_TIME = 0.45;
const ATTACK_COOLDOWN = 1.4;
const HIT_RECOVERY = 0.55;
const COLLIDER_RADIUS = 0.8;

const ATTACK_SOUND = '/sound/attack_mob.wav';
const HIT_SOUND = '/sound/hit_mob.wav';

const tempVector = new Vector3();

export default class Boss extends Object3D {
    rigidBody = null;
    collider = null;
    mesh = null;
    sound = new Sound();
    health = 8;
    alive = true;
    attackTimer = 0;
    attackCooldown = 0;
    hitCooldown = 0;
    pendingHit = false;
    time = 0;

    constructor(mesh, physic, position = new Vector3(-5, 4, -5)) {
        super();

        this.initVisual(mesh);
        this.initPhysic(physic, position);
        this.initSounds();
    }

    initVisual(mesh) {
        mesh.scale.setScalar(SCALE);
        mesh.position.y = 0.15;
        this.mesh = mesh;
        this.add(mesh);
    }

    initPhysic(physic, position) {
        const { rigidBody, collider } = createRigidBodyEntity(position, physic, COLLIDER_RADIUS);

        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    initSounds() {
        this.sound.load(ATTACK_SOUND);
        this.sound.load(HIT_SOUND);
    }

    update(dt, player) {
        if (!this.alive) return;

        this.time += dt;
        this.hitCooldown = Math.max(0, this.hitCooldown - dt);
        this.attackCooldown = Math.max(0, this.attackCooldown - dt);

        if (this.attackTimer > 0) {
            const previous = this.attackTimer;
            this.attackTimer = Math.max(0, this.attackTimer - dt);
            if (previous > ATTACK_HIT_TIME && this.attackTimer <= ATTACK_HIT_TIME) {
                this.pendingHit = true;
                this.sound.play(ATTACK_SOUND);
            }
            if (this.attackTimer === 0) {
                this.attackCooldown = ATTACK_COOLDOWN;
            }
        }

        this.updatePhysic(player);
        this.updateVisual(dt, player);
        this.tryHitPlayer(player);
    }

    updatePhysic(player) {
        if (this.hitCooldown > 0 || this.attackTimer > 0) {
            const y = this.rigidBody.linvel().y;
            this.rigidBody.setLinvel({ x: 0, y, z: 0 }, true);
            return;
        }

        const distance = this.distanceTo(player);
        const y = this.rigidBody.linvel().y;

        if (distance <= ATTACK_RANGE && this.attackCooldown === 0) {
            this.attackTimer = ATTACK_WINDUP;
            this.pendingHit = false;
            this.rigidBody.setLinvel({ x: 0, y, z: 0 }, true);
            return;
        }

        if (distance < CHASE_RANGE) {
            tempVector.subVectors(player.position, this.position);
            tempVector.y = 0;
            tempVector.normalize();

            this.rigidBody.setLinvel({
                x: tempVector.x * SPEED,
                y,
                z: tempVector.z * SPEED,
            }, true);
            return;
        }

        this.rigidBody.setLinvel({ x: 0, y, z: 0 }, true);
    }

    updateVisual(dt, player) {
        this.position.copy(this.rigidBody.translation());

        tempVector.subVectors(player.position, this.position);
        tempVector.y = 0;
        if (tempVector.lengthSq() > 0.0001) {
            const targetAngle = Math.atan2(-tempVector.z, tempVector.x) + Math.PI / 2;
            this.rotation.y += range(targetAngle, this.rotation.y) * dt * 4.5;
        }

        const moving = Math.abs(this.rigidBody.linvel().x) > 0.01 || Math.abs(this.rigidBody.linvel().z) > 0.01;
        const bob = moving ? Math.sin(this.time * 7) * 0.05 : Math.sin(this.time * 3) * 0.025;
        const attackProgress = this.attackTimer > 0 ? 1 - this.attackTimer / ATTACK_WINDUP : 0;
        const hitPush = this.hitCooldown > 0 ? this.hitCooldown / HIT_RECOVERY : 0;

        this.mesh.position.y = 0.15 + bob + attackProgress * 0.12;
        this.mesh.rotation.x = attackProgress * 0.45 - hitPush * 0.2;
        this.mesh.scale.set(
            SCALE * (1 + hitPush * 0.08),
            SCALE * (1 - attackProgress * 0.08 + hitPush * 0.08),
            SCALE * (1 + attackProgress * 0.15),
        );
    }

    tryHitPlayer(player) {
        if (!this.pendingHit || !this.alive) return;

        this.pendingHit = false;
        if (this.distanceTo(player) <= ATTACK_RANGE + 0.35) {
            player.takeHit(this.position);
        }
    }

    takeHit(from) {
        if (!this.alive || this.hitCooldown > 0) return false;

        this.health -= 1;
        this.hitCooldown = HIT_RECOVERY;
        this.pendingHit = false;
        this.attackTimer = 0;
        this.attackCooldown = 0.3;
        this.sound.play(HIT_SOUND);

        tempVector.subVectors(this.position, from);
        tempVector.y = 0;
        if (tempVector.lengthSq() > 0) {
            tempVector.normalize().multiplyScalar(2);
            this.rigidBody.setLinvel({
                x: tempVector.x,
                y: this.rigidBody.linvel().y,
                z: tempVector.z,
            }, true);
        }

        if (this.health <= 0) {
            this.alive = false;
            this.visible = false;
            this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
            this.rigidBody.sleep();
        }

        return true;
    }

    distanceTo(player) {
        return this.position.distanceTo(player.position);
    }
}
