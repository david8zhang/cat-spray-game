import Game from '~/scenes/Game'
import { Constants } from '~/util/constants'
import { Healthbar } from './Healthbar'

export class Food {
  public static FOOD_HEALTH = 100
  public healthBar: Healthbar
  public foodSprite: Phaser.GameObjects.Sprite
  public scene: Game

  constructor(scene: Game) {
    this.scene = scene
    this.foodSprite = this.scene.add
      .sprite(
        Constants.GAME_WIDTH / 2,
        Constants.GAME_HEIGHT / 2 + 110,
        'salmon-plate'
      )
      .setScale(0.2)
    this.healthBar = new Healthbar(scene, {
      position: {
        x: this.foodSprite.x,
        y: this.foodSprite.y + 40,
      },
      length: 200,
      width: 10,
      maxHealth: Food.FOOD_HEALTH,
    })
    this.healthBar.setOnLoseAllHealthHandler(() => {
      this.scene.cameras.main.fadeOut(2000, 0, 0, 0)
      this.scene.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.scene.start('gameover', {
            score: this.scene.score.getScore(),
          })
        }
      )
    })
  }

  public loseHealth(amount: number) {
    this.healthBar.decreaseHealth(amount)
  }
}
