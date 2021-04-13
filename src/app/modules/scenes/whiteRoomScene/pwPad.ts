import { player } from "../../player/player";
import { utils } from "../../utils";


export class PWPad {
    private scene: Phaser.Scene;
    private player: player;
    public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private using: boolean = false;
    private lastInputTick!: number;
    private firstLaunch: boolean = true;


    constructor(aScene: Phaser.Scene, aPlayer: player) {
        this.scene = aScene;
        this.player = aPlayer;
    }

    public create(aPosX: number, aPosY: number) {
        this.sprite = this.scene.physics.add.sprite(aPosX, aPosY, "lightSwitch").setScale(0.5, 0.5);
        this.scene.physics.add.overlap(this.sprite, this.player.sprite, this.overlapped, undefined, this)
    }

    private overlapped() {
        if (!this.using && this.player.keyAction.isDown && (utils.tickElapsed(this.lastInputTick) >= 500 || this.lastInputTick == undefined)) {
            console.log("used");
            this.using = true;
            if (this.firstLaunch) {
                this.scene.scene.launch('whiteRoomPWPad');
                this.firstLaunch = false;
            } else {
                this.scene.scene.wake('whiteRoomPWPad')
            }
            this.scene.scene.pause();
        } else if (this.using && this.scene.scene.isSleeping('whiteRoomPWPad')) {
            this.using = false;
        }
    }

    
    public isUsing(): boolean {
        return this.using;
    }

}