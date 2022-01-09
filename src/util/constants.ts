export class Constants {
  public static BG_COLOR = '#f2de8c'
  public static FONT_NAME = 'Sweet-Saturday'
  public static GAME_WIDTH = 800
  public static GAME_HEIGHT = 600
  public static SPRITE_SCALE = 2
  public static MAX_WATER_AMOUNT = 3
  public static MAX_TOYS = 2

  public static INITIAL_SPAWN_INTERVAL = {
    start: 500,
    end: 2500,
  }

  public static INITIAL_MAX_ENEMIES_ON_SCREEN = 5

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
  public static isBrowser(browserType): boolean {
    console.log(navigator.userAgent)
    return (
      navigator.userAgent.toLowerCase().indexOf(browserType.toLowerCase()) != -1
    )
  }
}
