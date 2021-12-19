import { Constants } from '~/util/constants'
import Game from '../scenes/Game'
import { Cat } from './Cat'

export class Player {
  private scene: Game
  private currItem!: Phaser.GameObjects.Sprite
  private currItemKey: string = 'HAND'

  constructor(scene: Game) {
    this.scene = scene
    this.initItem()
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
      .setDepth(1)
  }

  update() {
    const itemConfig = Constants.ITEM_SPRITE_CONFIGS[this.currItemKey]
    this.currItem.setPosition(
      this.scene.input.mousePointer.x + itemConfig.x,
      this.scene.input.mousePointer.y + itemConfig.y
    )
  }

  useItem(cat: Cat) {
    switch (this.currItemKey) {
      case 'SPRAY_BOTTLE': {
        cat.getSprayed()
        break
      }
      case 'HAND': {
        cat.pet()
        break
      }
    }
  }

  switchItem(itemName: string) {
    const itemConfig = Constants.ITEM_SPRITE_CONFIGS[itemName]
    this.currItemKey = itemName
    this.currItem.setScale(itemConfig.scale)
    this.currItem.setTexture(itemConfig.texture)
  }
}
