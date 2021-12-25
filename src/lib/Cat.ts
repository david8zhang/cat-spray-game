import Game from '~/scenes/Game'
import { Utils } from '~/util/utils'

export class Cat {
  private scene: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  public eatingEvent: Phaser.Time.TimerEvent | undefined
  public petCount: number = 0
  public currState: string = 'UNDER_TABLE'
  public stateTransitionEvent: Phaser.Time.TimerEvent
  public stateSpriteMapping = {
    UNDER_TABLE: 'henny',
    ON_TABLE: 'henny',
    EATING: 'cat-eating',
  }
  public hasBeenPet: boolean = false
  public isPlayingWithToy: boolean = false
  public isSpraying: boolean = false
  public static REQUIRED_PET_COUNT = 3

  public isOverlappingItem: boolean = false
  public isOverlappingAOE: boolean = false

  constructor(scene: Game, x: number, y: number) {
    this.scene = scene
    this.sprite = this.scene.physics.add
      .sprite(x, y, 'henny')
      .setScale(0.1)
      .setDepth(-1)
      .setInteractive()
      .setData('ref', this)

    this.scene.physics.world.enableBody(
      this.sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    )

    this.stateTransitionEvent = this.scene.time.delayedCall(1000, () => {
      this.getOnTable()
    })
  }

  destroy() {
    this.sprite.destroy()
    if (this.stateTransitionEvent) {
      this.stateTransitionEvent.remove(false)
      this.stateTransitionEvent.destroy()
    }
    this.scene.score.increaseScore(1)
  }

  pet() {
    if (this.isSpraying) {
      return
    }
    this.petCount++
    if (this.petCount == Cat.REQUIRED_PET_COUNT) {
      this.hasBeenPet = true
      this.sprite.clearTint()
      this.sprite.setTexture('cat-pet')
      this.sprite.setScale(0.25)
      this.resetBody()
      this.stateTransitionEvent.paused = true
      this.scene.time.delayedCall(500, () => {
        this.destroy()
      })
    } else {
      const tints = [0xa4fba6, 0x30cb00]
      this.sprite.setTint(tints[this.petCount - 1])
    }
  }

  getSprayed(onSprayCallback?: Function) {
    if (!this.isSpraying && !this.hasBeenPet) {
      this.isSpraying = true
      this.stateTransitionEvent.paused = true
      this.sprite.setTexture('cat-screaming')
      this.sprite.setScale(0.2)
      this.resetBody()
      if (onSprayCallback) onSprayCallback()
      this.scene.time.delayedCall(500, () => {
        this.destroy()
      })
    }
  }

  getOnTable() {
    if (this.sprite && this.sprite.active) {
      this.currState = 'ON_TABLE'
      this.scene.tweens.add({
        targets: [this.sprite],
        y: `-=50`,
        duration: 100,
      })
      this.stateTransitionEvent = this.scene.time.delayedCall(1000, () => {
        this.eatFood()
      })
    }
  }

  playWithToy(callback?: Function) {
    if (!this.isPlayingWithToy && !this.isSpraying && !this.hasBeenPet) {
      this.isPlayingWithToy = true
      this.stateTransitionEvent.paused = true
      this.sprite.setTexture('cat-playing')
      const oldScale = this.sprite.scale
      this.sprite.setScale(0.2)
      this.resetBody()
      if (callback) callback()
      this.scene.time.delayedCall(1500, () => {
        this.isPlayingWithToy = false
        if (this.sprite && this.sprite.active) {
          this.sprite.setScale(oldScale)
          this.sprite.setTexture(this.stateSpriteMapping[this.currState])
          this.stateTransitionEvent.paused = false
        }
      })
    }
  }

  resetBody() {
    this.sprite.body.setSize(this.sprite.width, this.sprite.height)
    this.sprite.body.setOffset(0, 0)
  }

  eatFood() {
    if (this.sprite && this.sprite.active) {
      this.currState = 'EATING'
      const foodSprite = this.scene.foodPlate.foodSprite
      const isLeft = this.sprite.x - foodSprite.x < 0
      this.sprite.setTexture('cat-eating')
      this.sprite.setDepth(foodSprite.depth + 1)
      this.sprite.setScale(0.2)
      this.sprite.flipX = !isLeft
      this.resetBody()

      const leftInterval = {
        start: foodSprite.x - 150,
        end: foodSprite.x - 50,
      }
      const rightInterval = {
        start: foodSprite.x + foodSprite.displayWidth / 2,
        end: foodSprite.x + foodSprite.displayWidth / 2 + 50,
      }
      let interval = isLeft ? leftInterval : rightInterval
      const randYPos = Utils.getRandomNum(foodSprite.y - 50, foodSprite.y + 25)
      const randXPos = Utils.getRandomNum(interval.start, interval.end)
      this.sprite.setPosition(randXPos, randYPos)

      this.stateTransitionEvent = this.scene.time.addEvent({
        loop: true,
        delay: 500,
        callback: () => {
          this.scene.foodPlate.loseHealth(1)
        },
      })
    }
  }

  update() {
    this.isOverlappingItem = this.scene.physics.overlap(
      this.sprite,
      this.scene.player.currItem
    )
    const aoeHighlight = this.scene.player.aoeHighlight
    if (aoeHighlight) {
      const isOverlappingAOE =
        this.scene.physics.overlapCirc(
          aoeHighlight.x,
          aoeHighlight.y,
          aoeHighlight.radius
        ).length > 1
      this.isOverlappingAOE = isOverlappingAOE
    }
  }
}
