import { Graphics, Sprite } from "pixi.js";
import { randomColor, randomIntBetween } from "../utils";
import { Draggable } from "../draggable";

export class Pin extends Draggable {

    private _head?: Sprite;
    private _pin?: Graphics;
    private _shadow?: Graphics;

    constructor() {
        super();

        const height = randomIntBetween(3, 6);
        
        this._shadow = new Graphics();

        this._head = Sprite.from("pin_head");
        this._head.tint = randomColor();
        this._head.anchor.set(0.5);

        this._pin = new Graphics();
        this.drawPin(height);
        this._pin!.x = -1;
        this._pin!.y = (this._head!.height / 2) - 1;

        this.addChild(this._shadow);
        this.addChild(this._pin);
        this.addChild(this._head);
    }

    private drawPin(height = 7) {
        this._pin!.clear();
        this._pin!.rect(0, 0, 2, height);
        this._pin!.fill(0xcccccc);

        this._shadow!.clear();
        this._shadow!.ellipse(0, 0, 6, 3);
        this._shadow!.fill({
            color: 0x000000,
            alpha: 0.33
        });
        this._shadow!.position.set(0, height + 3);
    }

    protected onDragStart() {
        this.drawPin();

        this._head!.y -= 8;
        this._pin!.y -= 8;
        this._shadow?.scale.set(1.3);
    }

    protected onDragEnd() {
        const height = randomIntBetween(3, 6);

        this._head!.y += 8;
        this._pin!.y += 8;
        this._shadow?.scale.set(1);

        this.drawPin(height);
    }
}