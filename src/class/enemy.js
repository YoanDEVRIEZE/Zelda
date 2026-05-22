import { Object3D, Vector3 } from "three";
import { createRigidBodyEntity, range } from "../tools/function";
import Animator from "./animator";
import Sound from "./sound";

const SPEED = 1.8;
const IDLE = 'idle';
const RUN = 'base';
const ATTACK = 'attack';
const HIT = 'hit';

const ATTACK_RANGE = 1.2;
const CHASE_RANGE = 8;
const HIT_RECOVERY = 0.45;

const ATTACK_SOUND = '/sound/attack_mob.wav';
const HIT_SOUND = '/sound/hit_mob.wav';

const tempVector = new Vector3();

export default class Enemy extends Object3D {
    rigidBody = null;
    collider = null;
    animator = null;
    sound = new Sound();
    health = 3;
    alive = true;
    pendingHit = false;
    hitCooldown = 0;

    constructor(mesh, physic, position = new Vector3(2, 4, -2)) {
        super();

        this.initVisual(mesh);
        this.initPhysic(physic, position);
        this.initAnimations(mesh);
        this.initSounds();
        this.syncAnimSound();
    }

    initVisual(mesh) {
        this.add(mesh);
    }

    initAnimations(mesh) {
        const animator = new Animator(mesh);
        animator.load(IDLE, 2);
        animator.load(RUN, 1.2);
        animator.load(ATTACK, 0.55, true);
        animator.load(HIT, 0.4, true);

        this.animator = animator;
    }

    initSounds() {
        this.sound.load(ATTACK_SOUND);
        this.sound.load(HIT_SOUND);
    }

    initPhysic(physic, position) {
        const { rigidBody, collider } = createRigidBodyEntity(position, physic);

        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    update(dt, player) {
        if (!this.alive) return;

        this.hitCooldown = Math.max(0, this.hitCooldown - dt);
        this.updatePhysic(player);
        this.updateVisual(dt);
        this.updateAnimation(dt, player);
        this.tryHitPlayer(player);
    }

    updatePhysic(player) {
        if (this.hitCooldown > 0 || this.isBusy()) {
            const y = this.rigidBody.linvel().y;
            this.rigidBody.setLinvel({ x: 0, y, z: 0 }, true);
            return;
        }

        const distance = this.distanceTo(player);
        const y = this.rigidBody.linvel().y;

        if (distance > ATTACK_RANGE && distance < CHASE_RANGE) {
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

    updateVisual(dt) {
        this.position.copy(this.rigidBody.translation());
        const velocity = this.rigidBody.linvel();

        if (Math.abs(velocity.x) || Math.abs(velocity.z)) {
            const targetAngle = Math.atan2(-velocity.z, velocity.x) + Math.PI / 2;
            this.rotation.y += range(targetAngle, this.rotation.y) * dt * 8;
        }
    }

    updateAnimation(dt, player) {
        if (this.hitCooldown > 0) {
            this.animator.play(HIT);
        } else if (this.animator.isPlaying(ATTACK)) {
            this.animator.play(ATTACK);
        } else {
            const distance = this.distanceTo(player);
            const velocity = this.rigidBody.linvel();
            const moving = Math.abs(velocity.x) || Math.abs(velocity.z);

            if (distance <= ATTACK_RANGE) {
                this.animator.play(ATTACK);
            } else if (moving) {
                this.animator.play(RUN);
            } else {
                this.animator.play(IDLE);
            }
        }

        this.animator.update(dt);
    }

    syncAnimSound() {
        this.animator.on(ATTACK, 'half', () => {
            this.pendingHit = true;
            this.sound.play(ATTACK_SOUND);
        });
        this.animator.on(HIT, 'start', () => {
            this.sound.play(HIT_SOUND);
        });
    }

    tryHitPlayer(player) {
        if (!this.pendingHit || !this.alive) return;

        this.pendingHit = false;
        if (this.distanceTo(player) <= ATTACK_RANGE + 0.25) {
            player.takeHit(this.position);
        }
    }

    takeHit(from) {
        if (!this.alive || this.hitCooldown > 0) return false;

        this.health -= 1;
        this.hitCooldown = HIT_RECOVERY;
        this.pendingHit = false;

        tempVector.subVectors(this.position, from);
        tempVector.y = 0;
        if (tempVector.lengthSq() > 0) {
            tempVector.normalize().multiplyScalar(2.2);
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

    isBusy() {
        return this.animator.isPlaying(ATTACK);
    }
}
