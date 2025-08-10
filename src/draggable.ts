import { Container } from "pixi.js";

export class Draggable extends Container {

    constructor() {
        super();

        this.on("dragstart", () => this.onDragStart());
        this.on("dragend", () => this.onDragEnd());
    }

    protected onDragStart() {
    }
    
    protected onDragEnd() {
    }
}
