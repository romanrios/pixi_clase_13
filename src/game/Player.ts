import { AnimatedSprite, Graphics, ObservablePoint, Rectangle, Texture } from "pixi.js";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { Keyboard } from "../utils/Keyboard";
import { IHitbox } from "./IHitbox";

export class Player extends PhysicsContainer implements IHitbox {


    private static readonly GRAVITY = 600;
    private static readonly MOVE_SPEED = 350;
    private static readonly SCALE = 1.5;

    public canJump = true;


    private robotAnimated: AnimatedSprite;

   private hitbox: Graphics;

    constructor() {
        super();


        // Animated Sprite
        this.robotAnimated = new AnimatedSprite(
            [
                Texture.from("RobotWalk0"),
                Texture.from("RobotWalk1"),
                Texture.from("RobotWalk2"),
                Texture.from("RobotWalk3"),
                Texture.from("RobotWalk4"),
                Texture.from("RobotWalk5"),
                Texture.from("RobotWalk6"),
                Texture.from("RobotWalk7")
            ],
            false
        );
        this.robotAnimated.play();
        this.robotAnimated.animationSpeed = 0.2;
        this.robotAnimated.scale.set(Player.SCALE);
        this.robotAnimated.anchor.set(0.5, 1);

        const auxZero = new Graphics();
        auxZero.beginFill(0xFF00FF);
        auxZero.drawCircle(0, 0, 10);
        auxZero.endFill();

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF,0.3);
        this.hitbox.drawRect(0,-140,90,140);
        this.hitbox.endFill;
        this.hitbox.pivot.x = this.hitbox.width/2;          


        this.addChild(this.robotAnimated);
        this.addChild(auxZero);
        this.addChild(this.hitbox);

        this.acceleration.y = Player.GRAVITY;

        Keyboard.down.on("ArrowUp", this.jump, this)

    }

    // la contraparte de agregar eventos al teclado, debemos apagarlos
    public override destroy(options: any){
        super.destroy(options);
        Keyboard.down.off("ArrowUp",this.jump)
    }

    public override update(deltaMS: number) {
        super.update(deltaMS / 1000);
        this.robotAnimated.update(deltaMS / (1000 / 60))

        if (Keyboard.state.get("ArrowRight")) {
            this.speed.x = Player.MOVE_SPEED;
            this.robotAnimated.scale.x = Player.SCALE
        } else if (Keyboard.state.get("ArrowLeft")) {
            this.speed.x = -Player.MOVE_SPEED;
            this.robotAnimated.scale.x = -Player.SCALE;
        } else {
            this.speed.x = 0;
        }

        // if (Keyboard.state.get("ArrowUp")) {
        //     this.jump();
        // }
    }


    private jump() {
        if (this.canJump) {
            this.canJump = false;
            this.speed.y = -600;
        }
    }

    public getHitbox(): Rectangle
    {
        return this.hitbox.getBounds()
    }

    public separate(overlap: Rectangle, platform: ObservablePoint<any>) {
        if (overlap.width < overlap.height) {
            if (this.x > platform.x) {
                this.x += overlap.width;
            } else if (this.x < platform.x) {
                this.x -= overlap.width;
            }
        }
        else {
            if (this.y > platform.y) {
                this.y -= overlap.height;
                this.speed.y = 0;
                this.canJump = true;
            } else if (this.y < platform.y) {
                this.y += overlap.height;
            }
        }
    }


}