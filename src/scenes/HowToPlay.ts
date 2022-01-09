import { button } from '~/ui/Button'
import { text } from '~/ui/Text'
import { Constants } from '~/util/constants'

export default class HowToPlay extends Phaser.Scene {
  public domElementsContainer!: Phaser.GameObjects.Container
  public tutorialText!: HTMLElement
  public tutorialTextDOM!: Phaser.GameObjects.DOMElement
  public currStep = 0
  public totalSteps = 4
  public objectsToCleanUp: Phaser.GameObjects.GameObject[] = []

  constructor() {
    super('tutorial')
  }

  create() {
    this.cameras.main.setBackgroundColor(Constants.BG_COLOR)
    const titleScreenText = text('How to Play', {
      fontSize: '40px',
      color: 'white',
      '-webkit-text-stroke-width': '2px',
      '-webkit-text-stroke-color': 'black',
    }) as HTMLElement

    const titleScreenDom = this.add
      .dom(this.scale.width / 2, 0, titleScreenText)
      .setOrigin(0.5)

    const startButton = button('Next', {
      fontSize: '20px',
      color: 'black',
      fontFamily: Constants.FONT_NAME,
      width: 150,
      height: 40,
    }) as HTMLElement

    const startButtonDom = this.add
      .dom(this.scale.width / 2, this.scale.height - 50, startButton)
      .setOrigin(0.5)
      .addListener('click')
      .on('click', () => {
        this.goToNextStep()
      })

    this.tutorialText = text('', {
      fontSize: '20px',
      color: 'black',
    }) as HTMLElement

    this.tutorialTextDOM = this.add
      .dom(this.scale.width / 2, 75, this.tutorialText)
      .setOrigin(0.5)

    this.domElementsContainer = this.add.container(0, 0)
    this.domElementsContainer.add(titleScreenDom)
    this.domElementsContainer.add(startButtonDom)
    this.domElementsContainer.add(this.tutorialTextDOM)

    this.showTutorialStep()
  }

  goToNextStep() {
    this.currStep++
    this.objectsToCleanUp.forEach((sprite) => {
      sprite.destroy()
    })
    if (this.currStep == this.totalSteps) {
      this.scene.start('game')
    } else {
      this.showTutorialStep()
    }
  }

  showTutorialStep() {
    switch (this.currStep) {
      case 0:
        this.showClickCatStep()
        break
      case 1:
        this.showSprayBottleStep()
        break
      case 2:
        this.showToyStep()
        break
      case 3:
        this.showMeterStep()
        break
      default:
        break
    }
  }

  updateTutorialText(text: string) {
    this.tutorialText.innerText = text
    this.tutorialTextDOM.updateSize()
  }

  showClickCatStep() {
    this.updateTutorialText(
      'Pet the cats before they get to your dinner! Click on the cats to pet them'
    )

    const catSprite = this.add
      .sprite(this.scale.width / 2, this.scale.height / 2, 'henny')
      .setScale(0.1)

    const handSprite = this.add
      .sprite(this.scale.width / 2 - 10, this.scale.height / 2 - 50, 'hand')
      .setScale(0.15)

    const tableSprite = this.add
      .sprite(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2 + 45, 'table')
      .setScale(6, 4)

    const foodSprite = this.add
      .sprite(
        Constants.GAME_WIDTH / 2,
        Constants.GAME_HEIGHT / 2 + 110,
        'salmon-plate'
      )
      .setScale(0.2)

    this.objectsToCleanUp.push(handSprite)
  }

  showSprayBottleStep() {
    this.updateTutorialText(
      'Press "W" to switch to the spray bottle, which makes cats go away with 1 click'
    )

    const sprayBottle = this.add
      .sprite(
        this.scale.width / 2 + 50,
        this.scale.height / 2 + 40,
        'spray-bottle'
      )
      .setScale(0.1)
    this.objectsToCleanUp.push(sprayBottle)
  }

  showToyStep() {
    this.updateTutorialText(
      'Press "E" to switch to the mouse toy, which distracts cats for a few seconds within a given area'
    )
    const toy = this.add
      .sprite(
        this.scale.width / 2 + 50,
        this.scale.height / 2 + 40,
        'mouse-toy'
      )
      .setScale(0.15)
      .setDepth(5)

    const aoeHighlight = this.add
      .circle(toy.x, toy.y)
      .setFillStyle(0x0000ff, 0.5)
      .setDepth(toy.depth - 1)

    this.objectsToCleanUp.push(toy)
    this.objectsToCleanUp.push(aoeHighlight)
  }

  showMeterStep() {
    this.updateTutorialText(
      'The spray bottle and toys are limited and have a cooldown, so keep an eye on them!'
    )

    let xPos = Constants.GAME_WIDTH - 300
    const yPos = 160
    for (let i = 0; i < Constants.MAX_WATER_AMOUNT; i++) {
      const sprite = this.add.sprite(xPos, yPos, 'water-drop').setScale(0.05)
      this.objectsToCleanUp.push(sprite)
      xPos += sprite.displayWidth
    }
    xPos += 50
    for (let i = 0; i < Constants.MAX_TOYS; i++) {
      const sprite = this.add.sprite(xPos, yPos, 'mouse-toy').setScale(0.05)
      this.objectsToCleanUp.push(sprite)
      xPos += sprite.displayWidth
    }
    const rectangle = this.add
      .rectangle(Constants.GAME_WIDTH - 325, yPos + 25, 230, 50, 0xffffff, 0)
      .setOrigin(0, 1)
      .setStrokeStyle(5, 0xff0000)
    this.objectsToCleanUp.push(rectangle)
  }
}
