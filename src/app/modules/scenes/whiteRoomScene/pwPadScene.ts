let gIsCorrect: boolean = false;
export function isCorrect(){
    return gIsCorrect;
}

export class PWPadScene extends Phaser.Scene {
    private password: Array<integer> = [1, 3, 0, 3, 0, 9];
    private playerInput: Array<integer> = [];
    private gLight!: Phaser.GameObjects.Image;
    private rLight!: Phaser.GameObjects.Image;
    private isCorrect!: boolean;

    constructor() {
        super({ key: 'whiteRoomPWPad' });
    }

    preload() {
        console.log("preload");
        this.load.spritesheet("pwPad", "../../assets/scenes/whiteRoomScene/pwPad.png", { frameWidth: 800, frameHeight: 600 });
        for (let i = 0; i < 10; i++) {
            this.load.spritesheet("number" + i, "../../assets/scenes/whiteRoomScene/pwPadKeys/number" + i + ".png", { frameWidth: 50, frameHeight: 55 });
        }
        this.load.spritesheet("enter", "../../assets/scenes/whiteRoomScene/pwPadKeys/enter.png", { frameWidth: 50, frameHeight: 55 });
        this.load.spritesheet("clear", "../../assets/scenes/whiteRoomScene/pwPadKeys/clear.png", { frameWidth: 50, frameHeight: 55 });
        this.load.spritesheet("return", "../../assets/scenes/whiteRoomScene/return.png", { frameWidth: 150, frameHeight: 35 });
        this.load.spritesheet("pwLight", "../../assets/scenes/whiteRoomScene/pwLight.png", { frameWidth: 225, frameHeight: 45 });
        this.load.spritesheet("pwGLight", "../../assets/scenes/whiteRoomScene/pwGreenLight.png", { frameWidth: 225, frameHeight: 45 });
        this.load.spritesheet("pwRLight", "../../assets/scenes/whiteRoomScene/pwRedLight.png", { frameWidth: 225, frameHeight: 45 });

        this.load.audio("padPress", "../../assets/scenes/whiteRoomScene/audio/menu_008.wav");

    }

    create() {
        let pad = this.add.sprite(400, 300, 'pwPad');
        for (let i = 1; i < 10; i++) {
            i -= 0.1
            let posX = 255 + 50 * (i - Math.floor(i / 3) * 3) + 25 * (i - Math.floor(i / 3) * 3);
            let posY = 180 + 55 * Math.floor(i / 3) + 25 * Math.floor(i / 3);
            i = Math.round(i);
            let key = this.add.sprite(posX, posY, 'number' + i).setInteractive();
            key.on('pointerdown', () => {
                console.log(i);
                this.playerInput.push(i);
                key.setFrame(1);
                this.sound.play("padPress", { volume: 0.2 });
                setTimeout(() => {
                    key.setFrame(0);
                }, 500)
            })
        }
        let key = this.add.sprite(397.5, 420, 'number0').setInteractive();
        key.on('pointerdown', () => {
            console.log(0);
            this.playerInput.push(0);
            key.setFrame(1);
            this.sound.play("padPress", { volume: 0.2 });
            setTimeout(() => {
                key.setFrame(0);
            }, 500)
        })
        let clear = this.add.sprite(322.5, 420, 'clear').setInteractive();
        clear.on('pointerdown', () => {
            this.playerInput.splice(0, this.playerInput.length);
            clear.setFrame(1);
            this.sound.play("padPress", { volume: 0.2 });
            setTimeout(() => {
                clear.setFrame(0);
            }, 500)
            this.rLight.setVisible(true);
            setTimeout(() => {
                this.rLight.setVisible(false);
            }, 500)
        })
        let enter = this.add.sprite(472.5, 420, 'enter').setInteractive();
        enter.on('pointerdown', () => {
            enter.setFrame(1);
            this.sound.play("padPress", { volume: 0.2 });
            setTimeout(() => {
                enter.setFrame(0);
            }, 500)
            let correctPW = true;
            if (this.playerInput.length == 6) {
                for (let i = 0; i < 6; i++) {
                    if (this.password[i] !== this.playerInput[i]) {
                        correctPW = false;                        
                        break;
                    }
                }
            } else {
                correctPW = false;
            }
            if (correctPW) {
                console.log("password is correct");
                this.gLight.setVisible(true);
                setTimeout(() => {
                    this.gLight.setVisible(false);
                }, 500)
                setTimeout(() => {
                    this.scene.resume("whiteRoomScene");
                    this.scene.sleep("whiteRoomPWPad");
                }, 1000)
            } else {
                console.log("passowrd is wrong");
                this.rLight.setVisible(true);
                setTimeout(() => {
                    this.rLight.setVisible(false);
                }, 500)
            }
            gIsCorrect= correctPW;
            this.playerInput.splice(0, this.playerInput.length);
        });
        let exit = this.add.sprite(625, 300, 'return').setInteractive();
        exit.on('pointerover', () => {
            exit.setFrame(1);
        });
        exit.on('pointerout', () => {
            exit.setFrame(0);
        });
        exit.on('pointerdown', () => {
            this.playerInput.splice(0, this.playerInput.length);
            this.scene.resume("whiteRoomScene");
            this.scene.sleep("whiteRoomPWPad");
        })
        this.add.image(400, 120, "pwLight");
        this.gLight = this.add.image(400, 120, "pwGLight").setVisible(false);
        this.rLight = this.add.image(400, 120, "pwRLight").setVisible(false);
    }

    update() {

    }

}