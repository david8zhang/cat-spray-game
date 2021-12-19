import Game from '~/scenes/Game'
import { Utils } from '~/util/utils'

export class Cat {
  private scene: Game
  public sprite: Phaser.GameObjects.Sprite
  public eatingEvent: Phaser.Time.TimerEvent | undefined

  constructor(scene: Game, x: number, y: number) {
    this.scene = scene
    this.sprite = this.scene.add
      .sprite(x, y, 'henny')
      .setScale(0.1)
      .setDepth(-1)
      .setInteractive()

    this.sprite.on('pointerup', () => {
      // this.scene.sound.play('spray')
      this.sprite.destroy()
    })

    this.scene.time.delayedCall(1000, () => {
      this.getOnTable()
    })
  }

  destroy() {
    this.sprite.destroy()
    if (this.eatingEvent) {
      this.eatingEvent.destroy()
    }
  }

  getOnTable() {
    if (this.sprite && this.sprite.active) {
      this.scene.tweens.add({
        targets: [this.sprite],
        y: `-=50`,
        duration: 100,
      })
      this.scene.time.delayedCall(1000, () => {
        this.eatFood()
      })
    }
  }

  eatFood() {
    if (this.sprite && this.sprite.active) {
      const foodSprite = this.scene.foodPlate.foodSprite
      const isLeft = this.sprite.x - foodSprite.x < 0
      this.sprite.setTexture('cat-eating')
      this.sprite.setDepth(foodSprite.depth + 1)
      this.sprite.setScale(0.2)
      this.sprite.scaleX *= isLeft ? 1 : -1
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

      const eatingEvent = this.scene.time.addEvent({
        loop: true,
        delay: 500,
        callback: () => {
          this.scene.foodPlate.loseHealth(10)
        },
      })
    }
  }
}
