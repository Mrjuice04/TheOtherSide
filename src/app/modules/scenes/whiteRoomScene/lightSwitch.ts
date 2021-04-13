import { player } from "../../player/player";
import { utils } from "../../utils";

export class LightSwitch {
    private scene: Phaser.Scene;
    private player: player;
    public currSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    public dark!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    public light!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private lightsOn: boolean = false;
    private lastSwitchTick!: number;
    private isDark: boolean;
    private isOverlapped: boolean = false;
    private canSwitch: boolean = true;

    constructor(aScene: Phaser.Scene, aPlayer: player, aDark: boolean) {
        this.scene = aScene;
        this.player = aPlayer;
        this.isDark = aDark;
    }

    public create(aPosX: number, aPosY: number) {
        this.light = this.scene.physics.add.sprite(aPosX, aPosY, "lightSwitch").setScale(0.75, 0.75).setDepth(4).setFrame(2);
        this.scene.physics.add.overlap(this.light, this.player.sprite, this.overlapped, undefined, this);
    }

    private overlapped() {
        if (this.player.keyAction.isDown && (utils.tickElapsed(this.lastSwitchTick) >= 500 || this.lastSwitchTick == undefined) && this.scene.scene.isSleeping('dialogScene')) {
            this.switchLight();
        }
        if (this.light.frame.name == '0') {
            this.light.setFrame(1);
        } else if (this.light.frame.name == '2') {
            this.light.setFrame(3);
        }
        this.isOverlapped = true;
    }

    private switchLight() {
        this.lastSwitchTick = utils.getTick();
        if (this.canSwitch) {
            this.scene.sound.play("lightSwitchPress", { volume: 1 });
            this.lightsOn = !this.lightsOn;
            if (this.lightsOn) {
                this.light.setFrame(0);
            } else {
                this.light.setFrame(2);
            }
        }
    }

    public update() {
        if (!this.isOverlapped) {
            if (this.lightsOn) {
                this.light.setFrame(0);
            } else {
                this.light.setFrame(2);
            }
        }
        this.isOverlapped = false;
    }

    public enableSwitch() {
        this.canSwitch = true;
    }

    public disableSwitch() {
        this.canSwitch = false;
    }

    public isOn(): boolean {
        return this.lightsOn;
    }

}