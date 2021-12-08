export class Preloader extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('table', 'table.png')
    this.load.image('salmon-plate', 'salmon-plate.png')
    this.load.image('henny', 'henny.jpeg')
    this.load.image('spray-bottle', 'spray-bottle.png')
    this.load.audio('music', 'bgm.mp3')
    this.load.audio('spray', 'spray.mp3')
  }

  create() {
    this.scene.start('game')
  }
}
