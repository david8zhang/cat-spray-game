import { Constants } from '~/util/constants'
import Game from '../scenes/Game'
import { Cat } from './Cat'

export class Player {
  private scene: Game
  private currItem!: Phaser.GameObjects.Sprite
  private currItemKey: string = 'HAND'

  public waterAmount: number = Constants.MAX_WATER_AMOUNT
  public numToys: number = Constants.MAX_TOYS
  public waterDropSprites: Phaser.GameObjects.Sprite[] = []
  public toySprites: Phaser.GameObjects.Sprite[] = []
  public toyAOEHighlight?: Phaser.GameObjects.Arc

  public rechargeWaterEvent!: Phaser.Time.TimerEvent
  public rechargeToysEvent!: Phaser.Time.TimerEvent

  constructor(scene: Game) {
    this.scene = scene
    this.initItem()
    this.initItemUI()
  }

  initItem() {
    const itemConfig = Constants.ITEM_SPRITE_CONFIGS[this.currItemKey]
    this.currItem = this.scene.add
      .sprite(
        this.scene.input.mousePointer.x + itemConfig.x,
        this.scene.input.mousePointer.y + itemConfig.y,
        itemConfig.texture
      )
      .setScale(itemConfig.scale)
      .setDepth(10)

    this.rechargeWaterEvent = this.scene.time.addEvent({
      loop: true,
      delay: 1500,
      callback: () => {
        this.waterAmount++
        this.waterAmount = Math.min(
          this.waterAmount,
          Constants.MAX_WATER_AMOUNT
        )
        this.updateItemUI()
      },
    })
    this.rechargeWaterEvent.paused = true

    this.rechargeToysEvent = this.scene.time.addEvent({
      loop: true,
      delay: 1500,
      callback: () => {
        this.numToys++
        this.numToys = Math.min(this.numToys, Constants.MAX_TOYS)
        this.updateItemUI()
      },
    })
    this.rechargeToysEvent.paused = true
  }

  initItemUI() {
    let xPos = Constants.GAME_WIDTH - 300
    const yPos = 25
    for (let i = 0; i < Constants.MAX_WATER_AMOUNT; i++) {
      const sprite = this.scene.add
        .sprite(xPos, yPos, 'water-drop')
        .setScale(0.05)
      this.waterDropSprites.push(sprite)
      xPos += sprite.displayWidth
    }
    xPos += 50
    for (let i = 0; i < Constants.MAX_TOYS; i++) {
      const sprite = this.scene.add
        .sprite(xPos, yPos, 'mouse-toy')
        .setScale(0.05)
      this.toySprites.push(sprite)
      xPos += sprite.displayWidth
    }
  }

  updateItemUI() {
    this.waterDropSprites.forEach((sprite, index) => {
      if (index + 1 <= this.waterAmount) {
        sprite.clearTint()
      } else {
        sprite.setTint(0x555555)
      }
    })
    this.toySprites.forEach((sprite, index) => {
      if (index + 1 <= this.numToys) {
        sprite.clearTint()
      } else {
        sprite.setTint(0x555555)
      }
    })
  }

  update() {
    const itemConfig = Constants.ITEM_SPRITE_CONFIGS[this.currItemKey]
    this.currItem.setPosition(
      this.scene.input.mousePointer.x + itemConfig.x,
      this.scene.input.mousePointer.y + itemConfig.y
    )
    this.addAdditionalItemUI(itemConfig)
  }

  // Add highlights for AOE items and such
  addAdditionalItemUI(itemConfig: any) {
    if (this.currItemKey === 'TOY') {
      const mousePointer = this.scene.input.mousePointer
      if (!this.toyAOEHighlight) {
        this.toyAOEHighlight = this.scene.add
          .circle(mousePointer.x + itemConfig.x, mousePointer.y + itemConfig.y)
          .setFillStyle(0x0000ff, 0.5)
          .setDepth(this.currItem.depth - 1)
      } else {
        this.toyAOEHighlight.setPosition(
          mousePointer.x + itemConfig.x,
          mousePointer.y + itemConfig.y
        )
      }
    } else {
      if (this.toyAOEHighlight) {
        this.toyAOEHighlight.setVisible(false)
      }
    }
  }

  useItem(cat: Cat) {
    switch (this.currItemKey) {
      case 'SPRAY_BOTTLE': {
        cat.getSprayed(() => {
          this.waterAmount--
          this.updateItemUI()
          if (this.waterAmount == 0) {
            this.switchItem('HAND')
          }
        })
        break
      }
      case 'HAND': {
        cat.pet()
        break
      }
      case 'TOY': {
        cat.playWithToy(() => {
          this.numToys--
          this.updateItemUI()
          if (this.numToys === 0) {
            this.switchItem('HAND')
          }
        })
        break
      }
    }
  }

  switchItem(itemName: string) {
    if (itemName === 'SPRAY_BOTTLE' && this.waterAmount === 0) {
      return
    }
    const itemConfig = Constants.ITEM_SPRITE_CONFIGS[itemName]
    this.currItemKey = itemName
    switch (itemName) {
      case 'SPRAY_BOTTLE': {
        if (this.waterAmount === 0) {
          return
        }
        this.rechargeWaterEvent.paused = true
        this.rechargeToysEvent.paused = false
        break
      }
      case 'HAND': {
        this.rechargeWaterEvent.paused = false
        this.rechargeToysEvent.paused = false
        break
      }
      case 'TOY': {
        this.rechargeWaterEvent.paused = false
        this.rechargeToysEvent.paused = true
        if (!this.toyAOEHighlight) {
        }
        break
      }
    }
    this.currItem.setScale(itemConfig.scale)
    this.currItem.setTexture(itemConfig.texture)
  }
}
