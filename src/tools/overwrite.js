import { Mesh, AnimationMixer, AnimationClip, LoopOnce } from 'three'

Mesh.prototype.isRootName = function isRootName(name) {
    return this.name.includes(name)
}

const mesh = new Mesh()
const mixer = new AnimationMixer()
const anime = new AnimationClip('empty', 1, [])
const animationAction = mixer.clipAction(anime, mesh)
const actionPrototype = animationAction.constructor.prototype

actionPrototype.halfPass = false

const nativePlay = actionPrototype.play

actionPrototype.play = function play() {
    const shouldDispatchStart = !this.isRunning()
    const result = nativePlay.call(this)

    if (shouldDispatchStart) {
        this._mixer.dispatchEvent({
            type: 'start',
            action: this
        })
    }

    return result
}

actionPrototype._updateTime = function _updateTime(
    deltaTime
) {
    const duration = this._clip.duration
    const loop = this.loop

    let time = this.time + deltaTime
    let loopCount = this._loopCount

    const pingPong = false

    if (deltaTime === 0) {
        if (loopCount === -1) return time

        return pingPong && (loopCount & 1) === 1 ? duration - time : time
    }

    if (
        (deltaTime > 0 && time >= duration / 2) ||
        (deltaTime < 0 && time <= duration / 2)
    ) {
        if (this.halfPass === false) {
            this.halfPass = true
            this._mixer.dispatchEvent({
                type: 'half',
                action: this,
                loopDelta: Math.floor(time / duration)
            })
        }
    } else {
        this.halfPass = false
    }

    if (loop === LoopOnce) {
        if (loopCount === -1) {
            this._loopCount = 0
            this._setEndings(true, true, false)
        }

        handle_stop: {
            if (time >= duration) {
                time = duration
            } else if (time < 0) {
                time = 0
            } else {
                this.time = time

                break handle_stop
            }

            if (this.clampWhenFinished) this.paused = true
            else this.enabled = false

            this.time = time

            this._mixer.dispatchEvent({
                type: 'finished',
                action: this,
                direction: deltaTime < 0 ? -1 : 1
            })
        }
    } else {
        if (loopCount === -1) {
            if (deltaTime >= 0) {
                loopCount = 0

                this._setEndings(true, this.repetitions === 0, pingPong)
            } else {
                this._setEndings(this.repetitions === 0, true, pingPong)
            }
        }

        if (time >= duration || time < 0) {
            const loopDelta = Math.floor(time / duration)
            time -= duration * loopDelta

            loopCount += Math.abs(loopDelta)

            const pending = this.repetitions - loopCount

            if (pending <= 0) {
                if (this.clampWhenFinished) this.paused = true
                else this.enabled = false

                time = deltaTime > 0 ? duration : 0

                this.time = time

                this._mixer.dispatchEvent({
                    type: 'finished',
                    action: this,
                    direction: deltaTime > 0 ? 1 : -1
                })
            } else {
                if (pending === 1) {
                    const atStart = deltaTime < 0
                    this._setEndings(atStart, !atStart, pingPong)
                } else {
                    this._setEndings(false, false, pingPong)
                }

                this._loopCount = loopCount

                this.time = time

                this._mixer.dispatchEvent({
                    type: 'loop',
                    action: this,
                    loopDelta: loopDelta
                })
            }
        } else {
            this.time = time
        }

        if (pingPong && (loopCount & 1) === 1) {
            return duration - time
        }
    }

    return time
}
