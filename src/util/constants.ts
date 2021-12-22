export class Constants {
  public static GAME_WIDTH = 800
  public static GAME_HEIGHT = 600
  public static SPRITE_SCALE = 2
  public static MAX_WATER_AMOUNT = 3
  public static MAX_TOYS = 5

  public static ITEM_SPRITE_CONFIGS = {
    SPRAY_BOTTLE: {
      x: 10,
      y: 50,
      scale: 0.1,
      texture: 'spray-bottle',
    },
    HAND: {
      x: 0,
      y: 0,
      scale: 0.15,
      texture: 'hand',
    },
    TOY: {
      x: 0,
      y: 0,
      scale: 0.15,
      texture: 'mouse-toy',
    },
  }
}
