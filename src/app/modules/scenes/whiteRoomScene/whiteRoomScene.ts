import { player } from '../../player/player'
import { LightSwitch } from './lightSwitch';
import Phaser from 'phaser';
import { PWPad } from './pwPad';
import { isCorrect } from './pwPadScene';
import { DialogScene } from '../dialogBox/dialogScene';
import { DirectionScene } from '../dialogBox/directionScene';
import { utils } from '../../utils';

export class WhiteRoomScene extends Phaser.Scene {
  private player!: player;
  private normBackground!: Phaser.GameObjects.Sprite;
  private bloodBackground!: Phaser.GameObjects.Sprite;
  private bloodMask!: Phaser.GameObjects.Sprite;
  private lightSwitch!: LightSwitch;
  private pwPad!: PWPad;
  private door!: Phaser.GameObjects.Sprite;
  private darkness!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private password!: Phaser.GameObjects.Image;
  private idCard!: Phaser.GameObjects.Image;
  private pwDark!: LightSwitch;
  private scrollX: number = 0;
  private scrollY: number = 0;
  private firstLight: boolean = true;
  private firstCorrectPW: boolean = true;
  private doorOpening: boolean = false;
  private doorEventActive: boolean = false;
  private doorOpenCount: number = 0;
  private sceneState: string = "wakeUp";
  private firstMissionState: string = "wakingUp";
  private initFadeInComplete: boolean = false;
  private dialogArray: Array<string> = [];
  private currDialogIndex: number = 0;
  private stateDelayTick: number = 0;
  private stateInitAction!: boolean;
  private lastDownTick!: number;

  constructor() {
    super({ key: "whiteRoomScene" });
  }

  preload() {
    this.load.spritesheet("whiteRoomBg", "../../assets/scenes/whiteRoomScene/whiteRoomSceneBg.png", { frameWidth: 1200, frameHeight: 1000 });
    this.load.spritesheet("bloodBg", "../../assets/scenes/whiteRoomScene/bloodScene.png", { frameWidth: 1200, frameHeight: 1000 });
    this.load.spritesheet("frontwall", "../../assets/scenes/whiteRoomScene/frontwall.png", { frameWidth: 1200, frameHeight: 1000 });
    this.load.spritesheet("bloodMask", "../../assets/scenes/whiteRoomScene/bloodMask.png", { frameWidth: 1200, frameHeight: 1000 });
    this.load.spritesheet("lightSwitch", "../../assets/scenes/whiteRoomScene/lightSwitch.png", { frameWidth: 64, frameHeight: 80 });
    this.load.spritesheet("darkness", "../../assets/scenes/whiteRoomScene/darkness.png", { frameWidth: 2000, frameHeight: 2000 });
    this.load.spritesheet("password", "../../assets/scenes/whiteRoomScene/password.png", { frameWidth: 1200, frameHeight: 1000 });
    this.load.spritesheet("lightSwitchDark", "../../assets/scenes/whiteRoomScene/lightSwitchDark.png", { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet("door", "../../assets/scenes/whiteRoomScene/door.png", { frameWidth: 124, frameHeight: 84 });
    this.load.image("idCard", "../../../assets/scenes/whiteRoomScene/idCard.png");
    player.loadSprite(this);

    this.load.audio("lightSwitchPress", "../../assets/scenes/whiteRoomScene/audio/feet_08.wav");
    this.load.audio("bloodAppear", "../../assets/scenes/whiteRoomScene/audio/CC-Deep_002.wav");
  }

  create() {
    this.cameras.main.fadeIn(5000)
    this.normBackground = this.add.sprite(400, 300, "whiteRoomBg");
    this.bloodBackground = this.add.sprite(400, 300, "bloodBg").setVisible(false);
    this.bloodMask = this.add.sprite(400, 300, "bloodMask").setDepth(11).setVisible(false);
    this.player = new player(this);
    this.player.create(400, 250);
    this.player.sprite.anims.play("sleep");
    this.player.disableMovement();
    this.createWalls();
    this.lightSwitch = new LightSwitch(this, this.player, false)
    this.lightSwitch.create(210, -11);
    this.pwPad = new PWPad(this, this.player);
    this.pwPad.create(130, -11);
    this.password = this.add.image(400, 300, "password");
    this.password.setVisible(false);
    this.darkness = this.physics.add.sprite(400, 300, "darkness").setDepth(3);
    this.darkness.setVisible(false);
    this.door = this.add.sprite(400, -16, "door").setDepth(2);
    this.createAnims();
    this.scene.launch('dialogScene');
    this.scene.sleep('dialogScene');
    this.scene.launch('directionScene');
    this.scene.sleep('directionScene');
    this.cameras.main.on('camerafadeincomplete', () => {
      if (!this.initFadeInComplete) {
        this.initFadeInComplete = true;
      }
    })


    this.events.on("resume", () => {
      if (isCorrect() && this.firstCorrectPW) {
        this.normBackground.setVisible(false);
        this.bloodBackground.setVisible(true);
        this.bloodMask.setVisible(true);
        this.sound.play("bloodAppear", { volume: 0.7 });
        this.firstCorrectPW = false;
        setTimeout(() => {
          this.door.anims.play("doorOpen", true);
          this.doorOpening = true;
        }, 1000);
        this.scene.wake("dialogScene");
        DialogScene.changeText("Ouch... My Head", true);
      }
    });

  }

  update() {
    this.player.update();
    this.checkScroll();
    this.checkLights();
    this.checkDoorEvent();
    if (this.doorEventActive) {
      this.doorEvent();
    }
    this.stateMachine();
    this.lightSwitch.update()
  }

  private createAnims() {
    this.anims.create({ key: "doorOpen", frames: this.anims.generateFrameNumbers("door", { start: 0, end: 4 }), frameRate: 10 });
    // this.anims.generateFrameNames("doorStuck", {frame: 4})
  }
  private checkScroll() {
    let pos = this.player.sprite.getCenter();

    if (pos.x < 600 && pos.x > 200) {
      this.scrollX = pos.x - 400;
      this.cameras.main.setScroll(this.scrollX, this.scrollY);
    }

    if (pos.y < 500 && pos.y > 100) {
      this.scrollY = pos.y - 300;
      this.cameras.main.setScroll(this.scrollX, this.scrollY);
    }

  }

  private createWalls() {
    let wall1 = this.add.rectangle(-200, 500, 30, 1000);
    let wall2 = this.add.rectangle(1000, 500, 30, 1000);
    let wall3 = this.add.rectangle(600, -50, 1600, 100);
    let wall4 = this.add.rectangle(600, 800, 1600, 30);


    this.physics.add.existing(wall1, true);
    this.physics.add.existing(wall2, true);
    this.physics.add.existing(wall3, true);
    this.physics.add.existing(wall4, true);

    this.physics.add.collider(wall1, this.player.sprite);
    this.physics.add.collider(wall2, this.player.sprite);
    this.physics.add.collider(wall3, this.player.sprite);
    this.physics.add.collider(wall4, this.player.sprite);
  }

  private checkDoorEvent() {
    if (this.doorOpening && !this.door.anims.isPlaying) {
      this.doorOpening = false;
      this.doorEventActive = true;
      this.player.keyAction.on("down", () => {
        console.log("hit")
        this.doorOpenCount++;
      })

    }
  }

  private doorEvent() {
    if (this.doorOpenCount % 5 == 0) {
      let frame = 4 + this.doorOpenCount / 5
      this.door.setFrame(frame);
    }
    if (this.doorOpenCount > 55) {
      this.player.keyAction.removeListener("down");
      this.doorEventActive = false;
    }
  }

  private checkLights() {
    if (this.lightSwitch.isOn() && this.darkness.visible) {
      this.firstLight = false;
      this.darkness.setVisible(false);
      this.password.setVisible(false);
    } else if (!this.lightSwitch.isOn() && !this.darkness.visible) {
      this.darkness.setVisible(true);
      if (!this.firstLight) {
        this.password.setVisible(true);
      }
    }
    if (this.darkness.visible) {
      let pos = this.player.sprite.getCenter();
      this.darkness.setPosition(pos.x, pos.y);
    }
  }

  private launchDialogScene(aTextArray: Array<string>) {
    this.scene.wake('dialogScene');
    this.dialogArray = aTextArray;
    DialogScene.changeText(this.dialogArray[this.currDialogIndex], false);
    this.currDialogIndex++;
    this.player.keyAction.on("down", () => {
      DialogScene.changeText(this.dialogArray[this.currDialogIndex], false);
      this.currDialogIndex++;
    });
  }


  private stateMachine() {
    switch (this.sceneState) {
      case "wakeUp":
        this.firstMissionMachine();
        if (this.firstMissionState == "end") {
          this.sceneState = "findLightSwitch";
        }
        break;
      case "findLightSwitch":
        break;
      default:
        this.sceneState = "error";
        break;
    }
  }

  private firstMissionMachine() {
    switch (this.firstMissionState) {
      case "wakingUp":
        if (this.initFadeInComplete) {
          setTimeout(() => {
            this.player.sprite.anims.play("wakeUp", true)
          }, 500);
          this.initFadeInComplete = false;
        }
        if (this.player.sprite.frame.name == "4") {
          this.player.createMark("question", 1800);
        }
        if (this.player.sprite.frame.name == "6") {
          if (this.stateDelayTick == 0) {
            this.stateDelayTick = utils.getTick();
          }
          if (utils.tickElapsed(this.stateDelayTick) >= 1000) {
            this.stateDelayTick = 0;
            this.stateInitAction = true
            this.firstMissionState = "dialog1";
          }
        }

        break;

      case "dialog1":
        if (this.stateInitAction) {
          let textarray = ["What… what happened?", "Why can’t I remember anything?", "Who am I? What is this place?"];
          this.launchDialogScene(textarray);
          this.stateInitAction = false;
        }
        if (this.currDialogIndex > this.dialogArray.length) {
          this.scene.sleep('dialogScene');
          this.currDialogIndex = 0;
          this.firstMissionState = "pickUpCard";
          this.stateInitAction = true;
          this.player.keyAction.removeListener("down");
          return;
        }

        break;

      case "dialogEnd":
        console.log("end");
        break;

      case "pickUpCard":
        if (this.stateInitAction) {
          let pos = this.player.sprite.getBottomCenter();
          this.idCard = this.add.image(pos.x, pos.y + 10, "idCard");
          this.stateInitAction = false;
          setTimeout(() => {
            this.player.createMark("exclamation", 600);
          }, 500)
          setTimeout(() => {
            this.player.sprite.anims.play("pickItem", true);
          }, 1000)
        }
        if (this.player.sprite.frame.name == "9") {
          if (this.stateDelayTick == 0) {
            this.idCard.destroy();
            this.stateDelayTick = utils.getTick();
          }
          if (utils.tickElapsed(this.stateDelayTick) >= 1000) {
            this.stateDelayTick = 0;
            this.stateInitAction = true
            this.firstMissionState = "dialog2";
          }
        }
        break;

      case "dialog2":
        if (this.stateInitAction) {
          let textarray = ["This looks like a card.", "It’s too dark in here. I can’t read what’s \n\non it. I need to turn on the lights.", "That glowing thing there should be the \n\nlight switch."];
          this.launchDialogScene(textarray);
          this.stateInitAction = false;
        }
        if (this.currDialogIndex == 3){
          this.player.sprite.anims.play("idleUp");
        }

        if (this.currDialogIndex > this.dialogArray.length) {
          this.scene.sleep('dialogScene');
          this.currDialogIndex = 0;
          this.firstMissionState = "findLightSwitch";
          this.stateInitAction = true;
          this.player.keyAction.removeListener("down");
          return;
        }
        break;

      case "findLightSwitch":
        if (this.stateInitAction) {
          this.player.enableMovement();
          this.scene.launch("directionScene");
          DirectionScene.changeText("- Use W A S D to move around -");
          this.stateInitAction = false;
          setTimeout(() => {
            DirectionScene.changeText("- Use SPACE to interact with highlighted items -");
          }, 3250)
        }
        if (this.lightSwitch.isOn()) {
          if (this.stateDelayTick == 0) {
            this.idCard.destroy();
            this.stateDelayTick = utils.getTick();
          }
          if (utils.tickElapsed(this.stateDelayTick) >= 400) {
            this.stateDelayTick = 0;
            this.stateInitAction = true
            this.firstMissionState = "dialog3";
          }
        }
        break;

      case "dialog3":
        if (this.stateInitAction) {
          let textarray = ["What... Where am I?", "I need to find a way to get out of here."];
          this.launchDialogScene(textarray);
          this.player.disableMovement();
          this.lightSwitch.disableSwitch();
          this.stateInitAction = false;
        }
        if (this.currDialogIndex > this.dialogArray.length) {
          this.player.enableMovement();
          setTimeout(() => {
            this.lightSwitch.enableSwitch();
          }, 300)
          this.scene.sleep('dialogScene');
          this.currDialogIndex = 0;
          this.firstMissionState = "end";
          this.stateInitAction = true;
          this.player.keyAction.removeListener("down");
          return;
        }
        break;

      default:
        this.sceneState = "error";
        break;
    }
  }
}