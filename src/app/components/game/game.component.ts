import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WhiteRoomScene } from '../../modules/scenes/whiteRoomScene/whiteRoomScene'
import Phaser from 'phaser';
import { PWPadScene } from 'src/app/modules/scenes/whiteRoomScene/pwPadScene';
import { DialogScene } from 'src/app/modules/scenes/dialogBox/dialogScene';
// import { WebFontLoaderPlugin } from 'phaser3-webfont-loader';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin';
import { DirectionScene } from 'src/app/modules/scenes/dialogBox/directionScene';


declare global {
  interface Window {
    onGameOver: () => void;
    onFirstBossClear: () => void;
    onGameOverParent: any;
    onFirstBossClearParent: any;
  }
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Output() gameOver: EventEmitter<void> = new EventEmitter();
  @Output() firstBossClear: EventEmitter<void> = new EventEmitter();

  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;


  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 600,
      width: 800,
      scene: [WhiteRoomScene, PWPadScene, DialogScene, DirectionScene],
      parent: 'game-container',
      physics: {
        default: 'arcade',
        // arcade: {
        //   gravity: { y: 300 },
        // }
      },
      plugins: {
        scene: [{
          key: 'rexUI',
          plugin: RexUIPlugin,
          mapping: 'rexUI'
        },
        ],
        global: [
          {
            key: 'rexWebFontLoader',
            plugin: WebFontLoaderPlugin,
            start: true
          },
        ],
      }
    }
  };


  ngOnInit() {
    window.onGameOverParent = this;
    window.onGameOver = () => {
      window.onGameOverParent.gameOver.emit();
    }

    window.onFirstBossClearParent = this;
    window.onFirstBossClear = () => {
      window.onFirstBossClearParent.firstBossClear.emit();
    }

    this.phaserGame = new Phaser.Game(this.config);
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy()");
    if (this.phaserGame != undefined) {
      this.phaserGame.destroy(true);
    }
  }
}

// class MainScene extends Phaser.Scene {

//   constructor() {
//     super({ key: 'main' });
//   }

//   preload() {
//     this.scene.start("default");
//   }

//   create() {

//   }

//   update() {

//   }
// }
