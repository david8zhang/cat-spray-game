export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    // Environment
    this.load.image('table', 'environment/table.png')
    this.load.image('salmon-plate', 'environment/salmon-plate.png')

    // Cats
    this.load.image('henny', 'cats/henny.jpeg')
    this.load.image('cat-eating', 'cats/cat-eating.jpeg')
    this.load.image('cat-pet', 'cats/cat-pet.png')
    this.load.image('cat-playing', 'cats/cat-playing.jpeg')
    this.load.image('cat-screaming', 'cats/screaming-cat.jpeg')

    // Items
    this.load.image('spray-bottle', 'items/spray-bottle.png')
    this.load.image('hand', 'items/hand.png')
    this.load.image('mouse-toy', 'items/mouse-toy.png')
    this.load.image('water-drop', 'items/water-drop.png')

    // BG
    this.load.image('game-over', 'bg/gameover.jpg')
    this.load.image('start', 'bg/start.jpg')

    // Audio
    this.load.audio('music', 'audio/cat-spray-bgm.mp3')
    this.load.audio('spray', 'audio/spray.mp3')
    this.load.audio('boom', 'audio/boom.mp3')
  }

  create() {
    this.scene.start('start')
  }
}
