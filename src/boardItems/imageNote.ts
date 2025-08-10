import { Sprite } from "pixi.js";
import { Note, NoteStyle } from "./note";

export class ImageNote extends Note {

    constructor(imageName: string, interactive: boolean = false, style?: Partial<NoteStyle>) {
        super("", style);

        const image = Sprite.from(imageName);
        image.anchor.set(0.5);
        this.addChild(image);

        if (interactive) {
            image.eventMode = "static";
            image.cursor = "zoom-in";
            image.on("pointerdown", () => this.emit("zoom"), this);
        }
    }
}