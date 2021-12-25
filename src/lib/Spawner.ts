import Game from '~/scenes/Game'
import { Constants } from '~/util/constants'
import { Utils } from '~/util/utils'
import { Cat } from './Cat'

export class Spawner {
  private scene: Game
  public enemies: Phaser.GameObjects.Group
  private maxEnemiesOnScreen = 5
  private spawnEvent: Phaser.Time.TimerEvent
  public spawnInterval = {
    start: 500,
    end: 2500,
  }

  constructor(scene: Game) {
    this.scene = scene
    this.enemies = scene.add.group({ classType: Cat })
    this.spawnEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.onEvent()
      },
    })
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.adjustSpawnBasedOnScore()
      },
      loop: true,
    })
  }

  onEvent() {
    if (this.enemies.children.entries.length < this.maxEnemiesOnScreen) {
      this.spawnEnemy()
    }
    this.spawnEvent.reset({
      delay: Phaser.Math.Between(
        this.spawnInterval.start,
        this.spawnInterval.end
      ),
      callback: () => {
        this.onEvent()
      },
      repeat: 1,
    })
  }

  adjustSpawnBasedOnScore() {
    // Adjust time range and spawn rate based on current score
    const currScore = this.scene.score.getScore()
    const endTimeRange =
      Constants.INITIAL_SPAWN_INTERVAL.end - Math.floor(currScore / 10) * 200
    this.spawnInterval.end = Math.max(500, endTimeRange)
    this.maxEnemiesOnScreen =
      Constants.INITIAL_MAX_ENEMIES_ON_SCREEN + Math.floor(currScore / 10)
  }

  spawnEnemy() {
    // this.scene.sound.play('boom')
    const randX = Utils.getRandomNum(150, Constants.GAME_WIDTH - 150)
    const cat = new Cat(this.scene, randX, this.scene.tableSprite.y + 50)
    this.scene.tweens.add({
      targets: [cat.sprite],
      y: `-=50`,
      duration: 100,
    })
    this.enemies.add(cat.sprite)
  }

  update() {
    this.enemies.children.entries.forEach((entry) => {
      const cat = entry.getData('ref') as Cat
      cat.update()
    })
  }
}
