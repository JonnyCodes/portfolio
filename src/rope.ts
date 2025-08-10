import { Graphics, ObservablePoint, Point } from "pixi.js";
import { distBetween } from "./utils"

const gravity = 0.5;
const friction = 0.99;
const radius = 5;

class RopeNode {
    public get pinned(): boolean {
        return this._pinned;
    }

    public position: Point;

    private _oldPosition: Point;
    private _pinned: boolean;
    private _velocity: Point;

    constructor(pos: Point, pinned = false) {
        this.position = pos;
        this._oldPosition = new Point(this.position.x, this.position.y);
        this._pinned = pinned;
        
        this._velocity = new Point(0);
    }

    public update() {
        if (this._pinned) return;

        this._velocity.set(
            (this.position.x - this._oldPosition.x) * friction,
            (this.position.y - this._oldPosition.y) * friction
        );

        this._oldPosition.copyFrom(this.position);
        this.position.x += this._velocity.x;
        this.position.y += this._velocity.y + gravity;
    }

    // NOT SURE WHAT THIS IS DOING!!
    public constrain() {
        this.position.set(
            Math.max(radius, this.position.x),
            Math.max(radius, this.position.y),
        );
    }
}

class RopeConstraint {
    private _nodeA: RopeNode;
    private _nodeB: RopeNode;
    private _maxDistance: number;

    constructor(nodeA: RopeNode, nodeB: RopeNode, maxDistance: number) {
        this._nodeA = nodeA;
        this._nodeB = nodeB;
        this._maxDistance = maxDistance;
    }

    public resolve() {
        const dx = this._nodeB.position.x - this._nodeA.position.x;
        const dy = this._nodeB.position.y - this._nodeA.position.y;
        const dist = Math.hypot(dx, dy);
        const diff = this._maxDistance - dist;
        const percent = diff / dist / 2;

        const offsetX = dx * percent;
        const offsetY = dy * percent;

        if (!this._nodeA.pinned) {
            this._nodeA.position.x -= offsetX;
            this._nodeA.position.y -= offsetY;
        }

        if (!this._nodeB.pinned) {
            this._nodeB.position.x += offsetX;
            this._nodeB.position.y += offsetY;
        }
    }
}

export class Rope {

    private static SEGMENT_LENGTH = 10;

    public get graphics(): Graphics {
        return this._graphics;
    }

    private _pinA: Point;
    private _pinB: Point;
    private _graphics: Graphics;
    private _ropeNodes: RopeNode[];
    private _ropeConstrains: RopeConstraint[];
    
    constructor(objA: {position: ObservablePoint}, objB: {position: ObservablePoint}) {
        this._pinA = objA.position;
        this._pinB = objB.position;
        this._ropeNodes = [];
        this._ropeConstrains = [];

        const distX = this._pinB.x - this._pinA.x;
        const distY = this._pinB.y - this._pinA.y;
        const dist = Math.max(distBetween(this._pinA, this._pinB), Rope.SEGMENT_LENGTH * 5);

        const unitX = distX / dist;
        const unitY = distY / dist;
        const numSegments = Math.floor(dist / Rope.SEGMENT_LENGTH);

        this._ropeNodes.push(new RopeNode(this._pinA, true));
        
        for (let t = 0; t <= numSegments; t += 1) {
            const x = this._pinA.x + unitX * t;
            const y = this._pinA.y + unitY * t;
            this._ropeNodes.push(new RopeNode(new Point(x, y)));
        }

        this._ropeNodes.push(new RopeNode(this._pinB, true));

        for (let i = 0; i < this._ropeNodes.length - 1; i++) {
            const node = this._ropeNodes[i];
            const nextNode = this._ropeNodes[i + 1];
            this._ropeConstrains.push(new RopeConstraint(node, nextNode, Rope.SEGMENT_LENGTH));
        }

        this._graphics = new Graphics();
        this._graphics.setStrokeStyle({width: 2, color: 0xff0000});

        this._graphics.eventMode = "none";
    }

    public update() {
        // Verlet integration
        this._ropeNodes.forEach((node) => {
            node.update();
            node.constrain();
        });

        // Apply constraints multiple times for stability
        for (let i = 0; i < 5; i++) {
            this._ropeConstrains.forEach((constraint) => {
                constraint.resolve();
            });
        }

        this.graphics.clear();
        this._graphics.moveTo(this._ropeNodes[0].position.x, this._ropeNodes[0].position.y);

        for (let i = 1; i < this._ropeNodes.length; i++) {
            const node = this._ropeNodes[i];
            this._graphics.lineTo(node.position.x, node.position.y);
        }

        this._graphics.stroke();
    }
}