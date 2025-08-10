import { BitmapText, Graphics } from "pixi.js";
import { Draggable } from "../draggable";
import { NoteStyle } from "./note";
import { randomIntBetween } from "../utils";

export class CheckList extends Draggable {

    private _shadow: Graphics;
    private _styles: NoteStyle;

    constructor(text: string[], style?: Partial<NoteStyle>) {
        super();

        this._styles = {
            width: 70,
            height: 100,
            angle: 0,
            color: 0xFBEEE8,
            font: "round_6x6",
            fontColor: 0x3e3e3e,
            fontSize: 10,
            ...style
        };

        this._shadow = new Graphics();
        this.addChild(this._shadow);

        const background = new Graphics();
        background.roundRect(-Math.ceil(this._styles.width / 2), 0, this._styles.width, this._styles.height, 5);
        background.fill(this._styles.color);
        this.addChild(background);

        for ( let i = 0; i < Math.max(text.length, 6); i++) {
            const box = new Graphics();
            box.setStrokeStyle({ width: 2, color: 0x3e3e3e });
            box.rect(-5, -5, 10, 10);
            box.stroke();
            box.position.set(10 + (-this._styles.width / 2), 10 + (16 * i))
            this.addChild(box);

            if (text[i]) {
                const [checkText, lineText] = text[i].split(" ");
                const check = new BitmapText({
                    text: checkText,
                    style: {
                        fontFamily: "thick_8x8",
                        fontSize: this._styles.fontSize,
                        fill: 0xff0000,
                    }
                });
                check.position.set(box.x - randomIntBetween(2, 4), box.y - randomIntBetween(4, 6))
                this.addChild(check);

                const line = new BitmapText({
                    text: lineText,
                    style: {
                        fontFamily: this._styles.font,
                        fontSize: this._styles.fontSize,
                        fill: this._styles.fontColor,
                    }
                });
                line.position.set(box.x + 10, box.y - randomIntBetween(-1, 2))
                this.addChild(line);
            }
        }
    }

    protected onDragStart(): void {
        this._shadow.roundRect(4 + -Math.ceil(this._styles.width / 2), 4, this._styles.width, this._styles.height, 5);
        this._shadow.fill({ color: 0x000000, alpha: 0.33 });
        this._shadow.angle = this._styles.angle
    }

    protected onDragEnd(): void {
        this._shadow.clear();
    }
}