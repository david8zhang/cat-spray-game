import Phaser from 'phaser'
import { Food } from '~/lib/Food'
import { InputController } from '~/lib/InputController'
import { Score } from '~/lib/Score'
import { Spawner } from '~/lib/Spawner'
import { Constants } from '~/util/constants'
import { Player } from '../lib/Player'

export default class Game extends Phaser.Scene {
  public tableSprite!: Phaser.GameObjects.Sprite
  public player!: Player
  public spawner!: Spawner
  public foodPlate!: Food
  public inputController!: InputController
  public score!: Score

  constructor() {
    super('game')
  }

  create() {
    document
      .getElementById('phaser')
      ?.setAttribute('style', 'cursor: none;background: #caba79;')

    // this.sound.play('music', { loop: true })
    this.player = new Player(this)
    this.spawner = new Spawner(this)
    this.score = new Score(this)
    this.cameras.main.setBackgroundColor(Constants.BG_COLOR)
    this.tableSprite = this.add
      .sprite(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2 + 45, 'table')
      .setScale(6, 4)
    this.foodPlate = new Food(this)
    this.inputController = new InputController(this)
  }

  update() {
    this.player.update()
    this.spawner.update()
  }
}
