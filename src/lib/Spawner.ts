import Game from '~/scenes/Game'
import { Constants } from '~/util/constants'
import { Utils } from '~/util/utils'
import { Cat } from './Cat'

export class Spawner {
  private scene: Game
  private enemies: Phaser.GameObjects.Group
  private maxEnemiesOnScreen = 5
  private spawnEvent: Phaser.Time.TimerEvent

  constructor(scene: Game) {
    this.scene = scene
    this.enemies = scene.add.group({ classType: Cat })
    this.spawnEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.onEvent()
      },
    })
  }

  onEvent() {
    if (this.enemies.children.entries.length < this.maxEnemiesOnScreen) {
      this.spawnEnemy()
    }
    this.spawnEvent.reset({
      delay: Phaser.Math.Between(500, 2000),
      callback: () => {
        this.onEvent()
      },
      repeat: 1,
    })
  }

  spawnEnemy() {
    const randX = Utils.getRandomNum(100, Constants.GAME_WIDTH - 100)
    const cat = new Cat(this.scene, randX, this.scene.tableSprite.y + 50)
    this.scene.tweens.add({
      targets: [cat.sprite],
      y: `-=100`,
      duration: 100,
    })
    this.enemies.add(cat.sprite)
  }
}