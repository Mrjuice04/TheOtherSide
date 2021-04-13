
import Phaser from 'phaser';
import { utils } from '../../utils';

interface textData {
  text: string;
  isLastDialog: boolean;
}
let gTextData: textData = { text: '', isLastDialog: false };

export class DialogScene extends Phaser.Scene {
  private text!: Phaser.GameObjects.Text;
  private nextButton!: Phaser.GameObjects.Image;
  private isLastDialog: boolean = false;
  private isFadingIn: boolean = false;
  private lastFadeInTake!: number;

  constructor() {
    super({ key: "dialogScene" });
  }

  preload() {
    this.load.image("dialogBox", "../../assets/scenes/dialogBox/dialogBox.png");
    this.load.image("next", "../../assets/scenes/dialogBox/nextButton.png");
    var config = {
      google: {
        families: ['Press Start 2P']
      },

    };
    this.load.rexWebFont(config);
  }

  create() {
    this.add.image(400, 450, "dialogBox");
    this.text = this.add.text(230, 400, "", { fontFamily: '"Press Start 2P"', fontSize: "12px" });
  }

  update() {
    this.text.setText(gTextData.text);
    this.isLastDialog = gTextData.isLastDialog;
  }

  private fadeIn() {
    let alpha = (utils.tickElapsed(this.lastFadeInTake)) / 1000
    this.text.setAlpha(alpha)
  }

  static changeText(aText: string, aLastDialog: boolean) {
    gTextData.text = aText;
    gTextData.isLastDialog = aLastDialog;
  }

}
