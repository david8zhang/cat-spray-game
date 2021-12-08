import Phaser from 'phaser'
import { Spawner } from '~/lib/Spawner'
import { Constants } from '~/util/constants'
import { Player } from './Player'

export default class Game extends Phaser.Scene {
  public tableSprite!: Phaser.GameObjects.Sprite
  public player!: Player
  public spawner!: Spawner
  constructor() {
    super('game')
  }

  create() {
    this.sound.play('music', { loop: true })
    this.player = new Player(this)
    this.spawner = new Spawner(this)
    this.cameras.main.setBackgroundColor('#f2de8c')
    this.tableSprite = this.add
      .sprite(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2 + 45, 'table')
      .setScale(6, 4)
    this.add
      .sprite(
        Constants.GAME_WIDTH / 2,
        Constants.GAME_HEIGHT / 2 + 100,
        'salmon-plate'
      )
      .setScale(0.25)
  }

  update() {
    this.player.update()
  }
}
