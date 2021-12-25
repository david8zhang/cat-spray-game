import Game from '~/scenes/Game'

export class InputController {
  private scene: Game
  constructor(scene: Game) {
    this.scene = scene
    this.listenKeyPresses()
    this.listenMouseClick()
  }

  listenMouseClick() {
    this.scene.input.on('pointerup', () => {
      this.scene.player.useItem()
    })
  }

  listenKeyPresses() {
    this.scene.input.keyboard.on('keydown', (keyCode: any) => {
      switch (keyCode.code) {
        case 'KeyQ': {
          this.scene.player.switchItem('HAND')
          break
        }
        case 'KeyW': {
          this.scene.player.switchItem('SPRAY_BOTTLE')
          break
        }
        case 'KeyE': {
          this.scene.player.switchItem('TOY')
          break
        }
      }
    })
  }
}
