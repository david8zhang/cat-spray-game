import Game from '~/scenes/Game'

export class Cat {
  private scene: Game
  public sprite: Phaser.GameObjects.Sprite
  constructor(scene: Game, x: number, y: number) {
    this.scene = scene
    this.sprite = this.scene.add
      .sprite(x, y, 'henny')
      .setScale(0.15)
      .setDepth(-1)
      .setInteractive()

    this.sprite.on('pointerup', () => {
      this.scene.sound.play('spray')
      this.sprite.destroy()
    })
  }
}
