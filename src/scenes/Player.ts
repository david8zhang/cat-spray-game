import Game from './Game'

export class Player {
  private scene: Game
  private sprayBottleSprite: Phaser.GameObjects.Sprite
  constructor(scene: Game) {
    this.scene = scene
    this.sprayBottleSprite = this.scene.add
      .sprite(
        this.scene.input.mousePointer.x + 10,
        this.scene.input.mousePointer.y + 50,
        'spray-bottle'
      )
      .setScale(0.1)
      .setDepth(1)
  }

  update() {
    this.sprayBottleSprite.setPosition(
      this.scene.input.mousePointer.x + 10,
      this.scene.input.mousePointer.y + 50
    )
  }
}
