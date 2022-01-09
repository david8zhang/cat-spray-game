import Game from '~/scenes/Game'
import { Constants } from '~/util/constants'

export class Score {
  private scene: Game

  private score = 0
  private scoreText: Phaser.GameObjects.Text

  constructor(scene: Game) {
    this.scene = scene

    this.scoreText = this.scene.add.text(16, 10, 'Score: 0', {
      fontSize: '25px',
      fontFamily: Constants.FONT_NAME,
      color: 'black',
    })
  }

  increaseScore(points: number): void {
    this.score += points
    this.scoreText.setText('Score: ' + this.score)
  }

  public getScore(): number {
    return this.score
  }
}
