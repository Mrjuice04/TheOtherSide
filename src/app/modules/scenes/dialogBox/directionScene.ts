
import Phaser from 'phaser';
import { utils } from '../../utils';

interface textData {
  text: string;
  isLastDialog: boolean;
}

let gTextData: textData = { text: '', isLastDialog: false };
let gText: string

export class DirectionScene extends Phaser.Scene {
  private text!: Phaser.GameObjects.Text;
  private textString!: string;
  private nextButton!: Phaser.GameObjects.Image;
  private isLastDialog: boolean = false;
  private isFadingIn: boolean = false;
  private lastFadeInTick!: number;
  private isFadingOut: boolean = false;
  private lastFadeOutTick!: number;

  constructor() {
    super({ key: "directionScene" });
  }

  preload() {
    var config = {
      google: {
        families: ['Press Start 2P']
      },
    };
    this.load.rexWebFont(config);
  }

  create() {
    this.text = this.add.text(400, 150, "", { fontFamily: '"Press Start 2P"', fontSize: "12px" }).setOrigin(0.5, 0);
    this.lastFadeInTick = utils.getTick();
  }

  update() {
    if (this.textString !== gText){
      this.textString = gText;
      this.isFadingIn = true;
      this.lastFadeInTick = utils.getTick();
      this.text.setText(this.textString);
    }
    if (this.isFadingIn) {
      this.fadeIn();
      if (utils.tickElapsed(this.lastFadeInTick) > 1000) {
        this.isFadingIn = false;
        setTimeout(() => { 
          this.isFadingOut = true;
          this.lastFadeOutTick = utils.getTick();
        }, 1000)
      }
    }
    if (this.isFadingOut) {
      this.fadeOut();
      if (utils.tickElapsed(this.lastFadeOutTick) > 1000) {
        this.isFadingOut = false;
      }
    }
  }

  private fadeIn() {
    let alpha = (utils.tickElapsed(this.lastFadeInTick)) / 1000
    this.text.setAlpha(alpha)
  }

  private fadeOut() {
    let alpha = (1000 - utils.tickElapsed(this.lastFadeOutTick)) / 1000
    this.text.setAlpha(alpha)
  }

  static changeText(aText: string) {
    gText = aText;
  }
}
