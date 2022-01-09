import { button } from '~/ui/Button'
import { text } from '~/ui/Text'
import { Constants } from '~/util/constants'

export default class StartMenu extends Phaser.Scene {
  constructor() {
    super('start')
  }

  create(): void {
    const domElementsContainer = this.add.container(0, 0)
    this.cameras.main.setBackgroundColor(Constants.BG_COLOR)
    const titleScreenText = text('Cat Attack', {
      fontSize: '80px',
      fontFamily: 'Adelia',
      color: 'white',
      fontWeight: 'bolder',
      '-webkit-text-stroke-width': '2px',
      '-webkit-text-stroke-color': 'black',
    }) as HTMLElement

    const titleScreenDom = this.add
      .dom(this.scale.width / 2 - 120, this.scale.height / 6, titleScreenText)
      .setOrigin(0.5)

    const startButton = button('Start', {
      fontSize: '20px',
      color: 'black',
      fontFamily: Constants.FONT_NAME,
      width: 150,
      height: 40,
    }) as HTMLElement

    const startButtonDom = this.add
      .dom(this.scale.width / 2, this.scale.height / 2, startButton)
      .setOrigin(0.5)
      .addListener('click')
      .on('click', () => {
        this.scene.start('game')
      })

    const howToPlay = button('How to Play', {
      fontSize: '20px',
      color: 'black',
      fontFamily: Constants.FONT_NAME,
      width: 150,
      height: 40,
    }) as HTMLElement

    const howToPlayDom = this.add
      .dom(this.scale.width / 2, this.scale.height / 2 + 50, howToPlay)
      .setOrigin(0.5)
      .addListener('click')
      .on('click', () => {
        this.scene.start('tutorial')
      })

    domElementsContainer.add(titleScreenDom)
    domElementsContainer.add(startButtonDom)
    domElementsContainer.add(howToPlayDom)
  }
}
