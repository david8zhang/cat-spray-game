export class Preloader extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('table', 'table.png')
    this.load.image('salmon-plate', 'salmon-plate.png')
    this.load.image('henny', 'henny.jpeg')
    this.load.image('spray-bottle', 'spray-bottle.png')
    this.load.image('cat-eating', 'cat-eating.jpeg')
    this.load.image('game-over', 'gameover.png')
    this.load.image('hand', 'hand.png')
    this.load.image('cat-pet', 'cat-pet.png')
    this.load.image('cat-screaming', 'screaming-cat.jpeg')
    this.load.image('mouse-toy', 'mouse-toy.png')
    this.load.image('water-drop', 'water-drop.png')
    this.load.image('cat-playing', 'cat-playing.jpeg')

    // Audio
    this.load.audio('music', 'cat-spray-bgm.mp3')
    this.load.audio('spray', 'spray.mp3')
    this.load.audio('boom', 'boom.mp3')
  }

  create() {
    this.scene.start('game')
  }
}
