export class player {
    private scene: Phaser.Scene;
    public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private keyUp!: Phaser.Input.Keyboard.Key;
    private keyLeft!: Phaser.Input.Keyboard.Key;
    private keyDown!: Phaser.Input.Keyboard.Key;
    private keyRight!: Phaser.Input.Keyboard.Key;
    public keyAction!: Phaser.Input.Keyboard.Key;
    private keyPosition!: Phaser.Input.Keyboard.Key;


    private walkDownAnim!: Phaser.Animations.Animation | false;
    private walkUpAnim!: Phaser.Animations.Animation | false;
    private walkLeftAnim!: Phaser.Animations.Animation | false;
    private walkRightAnim!: Phaser.Animations.Animation | false;

    private canMove: boolean = true;

    private exclamationMark!: Phaser.GameObjects.Sprite;
    private questionMark!: Phaser.GameObjects.Sprite;
    private bothMark!: Phaser.GameObjects.Sprite;

    constructor(aScene: Phaser.Scene) {
        this.scene = aScene;
        this.createKeys();
        this.createAnims()
    }

    static loadSprite(aScene: Phaser.Scene) {
        aScene.load.spritesheet("player", "../../../assets/player/player.png", { frameWidth: 20, frameHeight: 30 });
        aScene.load.spritesheet("playerWakeUp", "../../../assets/player/playerWakeUp.png", { frameWidth: 30, frameHeight: 30 });
        aScene.load.spritesheet("playerPickItem", "../../../assets/player/playerPickItem.png", { frameWidth: 20, frameHeight: 30 });
        aScene.load.spritesheet("exclamationMark", "../../../assets/player/signs/exclamationMark.png", { frameWidth: 40, frameHeight: 30 });
        aScene.load.spritesheet("questionMark", "../../../assets/player/signs/questionMark.png", { frameWidth: 40, frameHeight: 30 });
        aScene.load.spritesheet("bothMark", "../../../assets/player/signs/bothMark.png", { frameWidth: 40, frameHeight: 30 });
    }

    private createKeys() {
        this.keyUp = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyDown = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyAction = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyPosition = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.keyAction.setEmitOnRepeat(false);
    }

    private createAnims() {
        this.walkDownAnim = this.scene.anims.create({ key: "walkDown", frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 2 }), frameRate: 10, repeat: -1, });
        this.walkLeftAnim = this.scene.anims.create({ key: "walkLeft", frames: this.scene.anims.generateFrameNumbers("player", { start: 3, end: 5 }), frameRate: 10, repeat: -1, });
        this.walkRightAnim = this.scene.anims.create({ key: "walkRight", frames: this.scene.anims.generateFrameNumbers("player", { start: 6, end: 8 }), frameRate: 10, repeat: -1, });
        this.walkUpAnim = this.scene.anims.create({ key: "walkUp", frames: this.scene.anims.generateFrameNumbers("player", { start: 9, end: 11 }), frameRate: 10, repeat: -1, });
        this.scene.anims.create({ key: "idleDown", frames: [{ key: "player", frame: 2 }] });
        this.scene.anims.create({ key: "idleLeft", frames: [{ key: "player", frame: 4 }] });
        this.scene.anims.create({ key: "idleRight", frames: [{ key: "player", frame: 7 }] });
        this.scene.anims.create({ key: "idleUp", frames: [{ key: "player", frame: 10 }] });

        this.scene.anims.create({ key: "sleep", frames: [{ key: "playerWakeUp", frame: 0 }] });
        this.scene.anims.create({ key: "wakeUp", frames: this.scene.anims.generateFrameNumbers("playerWakeUp", { start: 0, end: 6 }), frameRate: 3, }); 
        this.scene.anims.create({ key: "pickItem", frames: this.scene.anims.generateFrameNumbers("playerPickItem", { start: 0, end: 9 }), frameRate: 8, }); 

        this.exclamationMark = this.scene.add.sprite(0, 0, "exclamationMark").setDepth(11).setVisible(false);
        this.questionMark = this.scene.add.sprite(0, 0, "questionMark").setDepth(11).setVisible(false);
        this.bothMark = this.scene.add.sprite(0, 0, "bothMark").setDepth(11).setVisible(false);
    }

    public create(aPosX: number, aPosY: number) {
        this.sprite = this.scene.physics.add.sprite(aPosX, aPosY, "player").setDepth(10);
    }

    private walk() {
        if (!this.keyDown.isDown && !this.keyLeft.isDown && !this.keyRight.isDown && this.keyUp.isDown) {
            this.sprite.anims.play("walkUp", true);
            this.sprite.setVelocity(0, -100);
        } else if (!this.keyUp.isDown && !this.keyLeft.isDown && !this.keyRight.isDown && this.keyDown.isDown) {
            this.sprite.anims.play("walkDown", true);
            this.sprite.setVelocity(0, 100);
        } else if (!this.keyDown.isDown && !this.keyUp.isDown && !this.keyRight.isDown && this.keyLeft.isDown) {
            this.sprite.anims.play("walkLeft", true);
            this.sprite.setVelocity(-100, 0);
        } else if (!this.keyDown.isDown && !this.keyLeft.isDown && !this.keyUp.isDown && this.keyRight.isDown) {
            this.sprite.anims.play("walkRight", true);
            this.sprite.setVelocity(100, 0);
        } else if (!this.keyDown.isDown && !this.keyLeft.isDown && !this.keyRight.isDown && !this.keyUp.isDown) {
            if (this.sprite.anims.currentAnim == this.walkUpAnim) {
                this.sprite.anims.play("idleUp");
            } else if (this.sprite.anims.currentAnim == this.walkDownAnim) {
                this.sprite.anims.play("idleDown");
            } else if (this.sprite.anims.currentAnim == this.walkLeftAnim) {
                this.sprite.anims.play("idleLeft");
            } else if (this.sprite.anims.currentAnim == this.walkRightAnim) {
                this.sprite.anims.play("idleRight");
            }
            this.sprite.setVelocity(0);
        }
    }

    public update() {
        if (this.canMove) {
            this.walk();
        }
        if (this.keyPosition.isDown) {
            console.log(this.scene.cameras.main.scrollX + " and " + this.scene.cameras.main.scrollY + " position is: " + this.sprite.getCenter().x + " and " + this.sprite.getCenter().y);
        }
    }

    public createMark(aMark: string, aDuration: number) {
        let pos = this.sprite.getTopCenter();
        if (aMark == "question"){
            this.questionMark.setPosition(pos.x, pos.y - 20);
            this.questionMark.setVisible(true);
            setTimeout(() =>{
                this.questionMark.destroy();
            }, aDuration)
        } else if (aMark == "exclamation"){
            this.exclamationMark.setPosition(pos.x, pos.y - 20);
            this.exclamationMark.setVisible(true);
            setTimeout(() =>{
                this.exclamationMark.destroy();
            }, aDuration)
        } else if (aMark == "both"){
            this.bothMark.setPosition(pos.x, pos.y - 20);
            this.bothMark.setVisible(true);
            setTimeout(() =>{
                this.bothMark.destroy();
            }, aDuration)
        }
    }

    public disableMovement() {
        this.sprite.setVelocity(0);
        this.canMove = false;
    }

    public enableMovement() {
        this.canMove = true;
    }
}