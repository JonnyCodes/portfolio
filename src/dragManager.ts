import { Application, Container, FederatedPointerEvent, PointData } from "pixi.js";
import { Draggable } from "./draggable";

// TODO: Make this handle multitouch?
export class DragManager {

    
    private _stage: Container;
    private _dragLayer: Container;
    private _draggables: Draggable[];
    private _dragTarget: Draggable | null;
    private _offset: PointData | null;

    constructor(app: Application, dragLayer: Container) {

        this._stage = app.stage;
        this._stage.eventMode = "static";
        this._stage.hitArea = app.screen; // TODO: Make this resizeable!!

        this._dragLayer = dragLayer;

        this._draggables = [];
        this._dragTarget = null;
        this._offset = null;
    }

    public addDraggable(draggable: Draggable) {
        this._draggables.push(draggable);

        draggable.eventMode = "static";
        draggable.cursor = "grab";

        draggable.on("pointerdown", (event: FederatedPointerEvent) => this.onDragStart(event, draggable), this);
    }

    public addDraggables(draggables: Draggable[]) {
        draggables.forEach((draggable) => {
            this.addDraggable(draggable);
        });
    }

    public cancelDrag() {
        // Added to timeout to make this happen after the dragStart event
        window.setTimeout(() => this.onDragEnd(), 0);
    }

    private onDragStart(event: FederatedPointerEvent, draggable: Draggable) {
        this._dragTarget = draggable;
        this._dragLayer.addChild(this._dragTarget);

        this._offset = this._dragTarget.toLocal(event.global);

        this._dragTarget.cursor = "grabbing";
        this._dragTarget.on("pointerupoutside", this.onDragEnd, this);

        this._stage.on("pointermove", this.onDragMove, this);
        this._stage.on("pointerup", this.onDragEnd, this);

        this._dragTarget.emit("dragstart");
    }

    private onDragMove(event: FederatedPointerEvent) {
        if (this._dragTarget) {
            this._dragTarget.parent?.toLocal(event.global, undefined, this._dragTarget.position);

            // Offset the difference between when the pointer is and the origin
            this._dragTarget.x -= this._offset?.x || 0;
            this._dragTarget.y -= this._offset?.y || 0;
        }
    }

    private onDragEnd() {
        this._stage.off('pointermove', this.onDragMove, this);
        this._stage.off('pointerup', this.onDragEnd, this);

        if (this._dragTarget) {
            this._dragTarget.cursor = "grab";
            this._dragTarget.emit("dragend");

            this._stage.addChild(this._dragTarget);

            this._dragTarget.off("pointerupoutside", this.onDragEnd, this);
            this._dragTarget = null;
        }
    }
}