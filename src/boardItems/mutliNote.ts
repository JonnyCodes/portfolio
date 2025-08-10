import { BitmapText } from "pixi.js";
import { Note, NoteStyle } from "./note";

export interface MutliNoteStyle extends NoteStyle {
    subFont: "square_6x6" | "round_6x6" | "thick_8x8" | "minogram_6x10",
    subFontSize: number,
    subFontColor: number,
}

export class MultiNote extends Note {

    private _subTexts: BitmapText[];
    
    constructor(title: string, lines: string[], style?: Partial<MutliNoteStyle>) {
        super(title, {
            font: "minogram_6x10",
            width: 64,
            height: 64,
            fontColor: 0x1877ec,
            ...style
        });

        this._subTexts = [];

        this._text.y = 5 + -Math.ceil(this._styles.height  / 2);
        this._text.eventMode = "static";
        this._text.cursor = "zoom-in";
        this._text.on("pointerdown", () => this.emit("zoom"), this);

        const textStyles: Partial<MutliNoteStyle> = {
            subFont: style?.font ?? "round_6x6",
            subFontSize: style?.fontSize ?? 10,
            subFontColor: style?.fontColor ?? 0x3e3e3e,
            ...style,
        };
        
        const startY = this._text.y + this._text.height + 5;

        const subText = new BitmapText({
            text: lines[0],
            style: {
                fontFamily: textStyles.subFont,
                fontSize: textStyles.subFontSize,
                fill: textStyles.subFontColor,
                align: "center",
            }
        });
        subText.position.set(
            -Math.floor(subText.width / 2),
            startY,
        );
        this._subTexts.push(subText);
        this.addChild(subText);

        for (let i = 1; i < lines.length; i++) {
            const prevText = this._subTexts[i - 1];

            const subText = new BitmapText({
                text: lines[i],
                style: {
                    fontFamily: textStyles.subFont,
                    fontSize: textStyles.subFontSize,
                    fill: textStyles.subFontColor,
                    align: "center",
                }
            });
            subText.position.set(
                -Math.floor(subText.width / 2),
                startY + (prevText.y + prevText.height + 10),
            );
            this._subTexts.push(subText);
            this.addChild(subText);
        }
    }
}