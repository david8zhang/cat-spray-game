import { Constants } from '~/util/constants'
import Game from '../scenes/Game'
import { Cat } from './Cat'

export class Player {
  private scene: Game
  public currItem!: Phaser.Physics.Arcade.Sprite
  private currItemKey: string = 'HAND'

  public waterAmount: number = Constants.MAX_WATER_AMOUNT
  public numToys: number = Constants.MAX_TOYS
  public waterDropSprites: Phaser.GameObjects.Sprite[] = []
  public toySprites: Phaser.GameObjects.Sprite[] = []
  public aoeHighlight?: Phaser.GameObjects.Arc

  public rechargeWaterEvent!: Phaser.Time.TimerEvent
  public rechargeToysEvent!: Phaser.Time.TimerEvent

  constructor(scene: Game) {
    this.scene = scene
    this.initItem()
    this.initItemUI()
  }

  initItem() {
    const itemConfig = Constants.ITEM_SPRITE_CONFIGS[this.currItemKey]
    this.currItem = this.scene.physics.add
      .sprite(
        this.scene.input.mousePointer.x + itemConfig.x,
        this.scene.input.mousePointer.y + itemConfig.y,
        itemConfig.texture
      )
      .setScale(itemConfig.scale)
      .setDepth(10)

    this.scene.physics.world.enableBody(
      this.currItem,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    )
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
      if (!this.aoeHighlight) {
        this.aoeHighlight = this.scene.add
          .circle(mousePointer.x + itemConfig.x, mousePointer.y + itemConfig.y)
          .setFillStyle(0x0000ff, 0.5)
          .setDepth(this.currItem.depth - 1)
      } else {
        this.aoeHighlight.setPosition(
          mousePointer.x + itemConfig.x,
          mousePointer.y + itemConfig.y
        )
        this.aoeHighlight.setVisible(true)
      }
    } else {
      if (this.aoeHighlight) {
        this.aoeHighlight.setVisible(false)
      }
    }
  }

  getAffectedCats(isAOE: boolean) {
    const enemiesGroup = this.scene.spawner.enemies
    const affectedCats: Cat[] = []
    enemiesGroup.children.entries.forEach((child) => {
      const cat = child.getData('ref') as Cat
      if (isAOE && cat.isOverlappingAOE) {
        affectedCats.push(cat)
      } else if (cat.isOverlappingItem) {
        affectedCats.push(cat)
      }
    })
    return affectedCats
  }

  useItem() {
    switch (this.currItemKey) {
      case 'SPRAY_BOTTLE': {
        const affectedCats = this.getAffectedCats(false)
        let catsSprayed = 0
        affectedCats.forEach((cat) => {
          if (!cat.isSpraying) {
            cat.getSprayed()
            catsSprayed++
          }
        })
        if (catsSprayed > 0) {
          this.waterAmount--
          this.updateItemUI()
          if (this.waterAmount == 0) {
            this.switchItem('HAND')
          }
        }
        break
      }
      case 'HAND': {
        const affectedCats = this.getAffectedCats(false)
        affectedCats.forEach((cat) => {
          cat.pet()
        })
        break
      }
      case 'TOY': {
        const affectedCats = this.getAffectedCats(true)
        let catsDistracted = 0
        affectedCats.forEach((cat) => {
          if (!cat.isPlayingWithToy) {
            cat.playWithToy()
            catsDistracted++
          }
        })
        if (catsDistracted > 0) {
          this.numToys--
          this.updateItemUI()
          if (this.numToys === 0) {
            this.switchItem('HAND')
          }
        }
        break
      }
    }
  }

  createRechargeWaterEvent() {
    const config = {
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
    }
    if (!this.rechargeWaterEvent) {
      this.rechargeWaterEvent = this.scene.time.addEvent(config)
    } else {
      this.rechargeWaterEvent.reset(config)
    }
  }

  createRechargeToyEvent() {
    const config = {
      loop: true,
      delay: 1500,
      callback: () => {
        this.numToys++
        this.numToys = Math.min(this.numToys, Constants.MAX_TOYS)
        this.updateItemUI()
      },
    }
    if (!this.rechargeToysEvent) {
      this.rechargeToysEvent = this.scene.time.addEvent(config)
    } else {
      this.rechargeToysEvent.reset(config)
    }
  }

  switchItem(itemName: string) {
    if (itemName === 'SPRAY_BOTTLE' && this.waterAmount === 0) {
      return
    }
    const itemConfig = Constants.ITEM_SPRITE_CONFIGS[itemName]
    const changeItem = () => {
      this.currItemKey = itemName
      this.currItem.setScale(itemConfig.scale)
      this.currItem.setTexture(itemConfig.texture)
    }
    switch (itemName) {
      case 'SPRAY_BOTTLE': {
        if (this.waterAmount === 0) {
          return
        }
        changeItem()
        if (this.rechargeWaterEvent) this.rechargeWaterEvent.destroy()
        this.createRechargeToyEvent()
        break
      }
      case 'HAND': {
        changeItem()
        this.createRechargeWaterEvent()
        this.createRechargeToyEvent()
        break
      }
      case 'TOY': {
        if (this.numToys == 0) {
          return
        }
        changeItem()
        this.createRechargeWaterEvent()
        if (this.rechargeToysEvent) this.rechargeToysEvent.destroy()
        break
      }
    }
  }
}
