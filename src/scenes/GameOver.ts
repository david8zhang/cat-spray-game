import Phaser from 'phaser'
import { button } from '~/ui/Button'
import { text } from '~/ui/Text'
import { Constants } from '~/util/constants'

export default class GameOver extends Phaser.Scene {
  private score = 0

  constructor() {
    super('gameover')
  }

  init(data): void {
    this.score = data.score
  }

  create(): void {
    document
      .getElementById('phaser')
      ?.setAttribute('style', 'cursor: auto;background: #1b1d20;')
    this.cameras.main.fadeIn(2000, 1, 1, 1)

    const bg = this.add.image(
      Constants.GAME_WIDTH / 2,
      Constants.GAME_HEIGHT / 2,
      'game-over'
    )
    let scaleX = this.cameras.main.width / bg.width
    let scaleY = this.cameras.main.height / bg.height
    bg.setScale(scaleX, scaleY)

    const domElementsContainer = this.add.container(0, 0)

    const gameOverText = text('GAME OVER', {
      fontSize: '60px',
      color: 'red',
      fontWeight: 'bolder',
      '-webkit-text-stroke-width': '1px',
      '-webkit-text-stroke-color': 'black',
    }) as HTMLElement

    const gameOverTextDom = this.add
      .dom(this.scale.width / 2, this.scale.height / 6, gameOverText)
      .setOrigin(0.5)

    const restartButton = button('Play Again', {
      fontSize: '20px',
      fontFamily: Constants.FONT_NAME,
      color: 'black',
      width: 150,
      height: 40,
    }) as HTMLElement

    const restartButtonDom = this.add
      .dom(this.scale.width / 2, this.scale.height / 2 + 30, restartButton)
      .setOrigin(0.5)
      .addListener('click')
      .on('click', () => {
        const gameScene = this.scene.get('game')
        gameScene.registry.destroy()
        gameScene.scene.restart()
        gameScene.sound.removeAll()
        this.scene.start('game')
      })

    const scoreText = text(`Your score: ${this.score}`, {
      fontSize: '30px',
      color: 'red',
      fontWeight: 'bolder',
      '-webkit-text-stroke-width': '1px',
      '-webkit-text-stroke-color': 'black',
    }) as HTMLElement
    const scoreTextDom = this.add
      .dom(this.scale.width / 2, this.scale.height / 5 + 64, scoreText)
      .setOrigin(0.5)

    domElementsContainer.add(gameOverTextDom)
    domElementsContainer.add(scoreTextDom)
    domElementsContainer.add(restartButtonDom)
    domElementsContainer.setAlpha(0)
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: domElementsContainer,
        alpha: { value: 1, duration: 1000 },
      })
    })
  }
}
