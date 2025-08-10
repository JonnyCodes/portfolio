import { BitmapText, Graphics } from "pixi.js";
import { Draggable } from "../draggable";
import { randomIntBetween } from "../utils";

export interface NoteStyle {
    width: number,
    height: number,
    angle: number,
    color: number
    font: "square_6x6" | "round_6x6" | "thick_8x8" | "minogram_6x10",
    fontSize: number,
    fontColor: number,
}

export class Note extends Draggable {

    protected _text: BitmapText;
    protected _styles: NoteStyle;

    private _shadow: Graphics;

    constructor(text: string = "", style?: Partial<NoteStyle>) {
        super();

        this._styles = {
            width: 48,
            height: 48,
            angle: 0,
            color: 0xFFFF99,
            font: "square_6x6",
            fontColor: 0x3e3e3e,
            fontSize: 10,
            ...style
        };

        this._shadow = new Graphics();
        this.addChild(this._shadow);

        const background = new Graphics();
        background.rect(-Math.ceil(this._styles.width / 2), -Math.ceil(this._styles.height / 2), this._styles.width, this._styles.height);
        background.fill(this._styles.color);
        background.angle = this._styles.angle
        this.addChild(background);

        this.drawTape();

        this._text = new BitmapText({
            text,
            style: {
                fontFamily: this._styles.font,
                fontSize: this._styles.fontSize,
                fill: this._styles.fontColor,
                align: "center",
                wordWrap: true,
            }
        });
        this._text.position.set(
            -Math.floor(this._text.width / 2),
            -Math.floor(this._text.height / 2),
        );
        this.addChild(this._text);
    }

    private drawTape() {
        const tape = new Graphics();
            tape.rect(-10, -3, 20, 6);
            tape.fill({color: 0xd6e7e6, alpha: 0.5});

            switch(randomIntBetween(0, 2)) {
                case 0: {
                    tape.position.set(5 + (-this._styles.width / 2), 3 + (-this._styles.height / 2));
                    tape.angle = randomIntBetween(-60, 40);
                    break;
                }
    
                case 1: {
                    tape.position.set((this._styles.width / 2), 0);
                    tape.angle = randomIntBetween(-60, 40);
                    break;
                }
    
                case 2: {
                    tape.position.set(0, -this._styles.height / 2);
                    tape.angle = randomIntBetween(-90, 90);
                    break;
                }
            }
            this.addChild(tape);
    }

    protected onDragStart(): void {
        this._shadow.rect(4 + -Math.ceil(this._styles.width / 2), 4 + -Math.ceil(this._styles.height / 2), this._styles.width, this._styles.height);
        this._shadow.fill({ color: 0x000000, alpha: 0.33 });
        this._shadow.angle = this._styles.angle
    }

    protected onDragEnd(): void {
        this._shadow.clear();
    }
}