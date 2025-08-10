import { BitmapText, Graphics, Sprite } from "pixi.js";
import { Draggable } from "../draggable";

export class Polaroid extends Draggable {

    protected _text: BitmapText;

    private _shadow: Graphics;

    constructor(text: string = "", imageName?: string, textAngle = 0, ) {
        super();

        this._shadow = new Graphics();
        this.addChild(this._shadow);

        const background = new Graphics();
        background.rect(-36, -43, 72, 86);
        background.fill(0xecffff);
        this.addChild(background);
        this.cursor = "grab";

        const imageBackground = new Graphics();
        imageBackground.rect(-31, -31, 62, 62);
        imageBackground.fill(0x3e3e3e);
        imageBackground.y = -7;
        this.addChild(imageBackground);

        if (imageName) {
            const image = Sprite.from(imageName);
            image.anchor.set(0.5);
            image.position.set(
                imageBackground.x,
                imageBackground.y
            );
            this.addChild(image);
        }

        this._text = new BitmapText({
            text,
            style: {
                fontFamily: "square_6x6",
                fontSize: 10,
                fill: 0x1877ec,
                align: "center",
            }
        });
        this._text.angle = textAngle;
        this._text.position.set(
            -Math.floor(this._text.width / 2),
            (background.height / 2) - (this._text.height + 3)
        );
        this.addChild(this._text);

        this._text.eventMode = "static";
        this._text.cursor = "zoom-in";
        this._text.on("pointerdown", () => this.emit("zoom"), this);
    }

    protected onDragStart(): void {
        this._shadow.rect(4 + -Math.ceil(this.width / 2), 4 + -Math.ceil(this.height / 2), this.width, this.height);
        this._shadow.fill({ color: 0x000000, alpha: 0.33 });
    }

    protected onDragEnd(): void {
        this._shadow.clear();
    }
}