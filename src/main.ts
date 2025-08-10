import { Application, Assets, BitmapFont, NineSliceSprite, Container } from "pixi.js";
import { DragManager } from "./dragManager";
import { Rope } from "./rope";
import { Pin } from "./boardItems/pin";
import { Note } from "./boardItems/note";
import { CheckList } from "./boardItems/checklist";
import { randomIntBetween } from "./utils";
import { MultiNote } from "./boardItems/mutliNote";
import { Polaroid } from "./boardItems/polaroid";
import { ImageNote } from "./boardItems/imageNote";
import { DetailView, PROJECTS } from "./boardItems/detailView";

class Game {

    private _app: Application;
    private _dragManager!: DragManager;
    private _dragLayer: Container;
    private _notes: Container[];
    private _ropes: Rope[];
    private _pins: Pin[];
    private _detailView!: DetailView;

    constructor() {
        this._app = new Application();
        this._dragLayer = new Container();

        this._notes = [];
        this._ropes = [];
        this._pins = [];
    }

    public async init() {
        await this._app.init({
            width: 640,
            height: 360,
            background: "#434561",
            antialias: false,
            resolution: 1,
            autoDensity: false,
            roundPixels: true,
        });

        document.getElementById("pixi-container")!.appendChild(this._app.canvas);

        const scaleX = window.innerWidth / 640;
        const scaleY = window.innerHeight / 360;
        const scale = Math.min(scaleX, scaleY);
        this._app.canvas.style.transform = `scale(${scale})`;
    }

    public load() {
        return Promise.all([
            Assets.load({alias: "board", src: "./assets/board.png", data: { scaleMode: 'nearest'} }),
            Assets.load({alias: "pin_head", src: "./assets/pin_head.png", data: { scaleMode: "nearest" } }),
            Assets.load({alias: "prize_machine", src: "./assets/prize_machine.png", data: { scaleMode: "nearest" } }),
            Assets.load({alias: "dibz", src: "./assets/dibz.png", data: { scaleMode: "nearest" } }),
            Assets.load({alias: "snail", src: "./assets/snail.png", data: { scaleMode: "nearest" } }),
            Assets.load({alias: "pointer", src: "./assets/pointer.png", data: { scaleMode: "nearest" } }),
            Assets.load({alias: "folder", src: "./assets/folder.png", data: { scaleMode: "nearest" } }),
            Assets.load({alias: "paperclip", src: "./assets/paperclip.png", data: { scaleMode: "nearest" } }),
            Assets.load({alias: "top_secret", src: "./assets/top_secret.png", data: { scaleMode: "nearest" } }),
            Assets.load({alias: "website_icon", src: "./assets/website_icon.png", data: { scaleMode: "nearest" } }),
            Assets.load({alias: "pixel_font_squarex6", src: "./assets/square_6x6.xml"}),
            Assets.load({alias: "pixel_font_roundx6", src: "./assets/round_6x6.xml"}),
            Assets.load({alias: "pixel_font_minogram", src: "./assets/minogram_6x10.xml"}),
            Assets.load({alias: "pixel_font_thick", src: "./assets/thick_8x8.xml"})
        ]);
    }

    public create() {
        // HACK: Font loader doesn't set scale mode on the texture, have to do it manually
        (Assets.get("pixel_font_squarex6") as BitmapFont).pages.forEach((page) => page.texture.source.scaleMode = "nearest");
        (Assets.get("pixel_font_roundx6") as BitmapFont).pages.forEach((page) => page.texture.source.scaleMode = "nearest");
        (Assets.get("pixel_font_minogram") as BitmapFont).pages.forEach((page) => page.texture.source.scaleMode = "nearest");
        (Assets.get("pixel_font_thick") as BitmapFont).pages.forEach((page) => page.texture.source.scaleMode = "nearest");

        const board = new NineSliceSprite({
            texture: Assets.get("board"),
            leftWidth: 14,
            rightWidth: 14,
            topHeight: 14,
            bottomHeight: 14,
        });
        board.width = 620;
        board.height = 340;
        board.position.set(10);
        this._app.stage.addChild(board);

        this._detailView = new DetailView();
        this._detailView.on("close", () => this.hideOverlay(), this);
        this._detailView.zIndex = 100;
        this._detailView.position.set((640 - this._detailView.width) / 2, (360 - this._detailView.height) / 2)

        this._dragManager = new DragManager(this._app, this._dragLayer);

        const pointerNote = new ImageNote("pointer", false, { angle: randomIntBetween(-5, 5), color: 0xff6c6c});
        pointerNote.position.set(346, 55);
        this._notes.push(pointerNote);
        this._dragManager.addDraggable(pointerNote);

        const nameNote = new Note("Jonny\nBlackburn", {width: 140, height: 64, fontSize: 20, font: "thick_8x8"});
        nameNote.position.set(board.width / 2, board.height / 2);
        this._notes.push(nameNote);
        this._dragManager.addDraggable(nameNote);

        const websiteNote = new ImageNote("website_icon", true, { angle: 3, color: 0xffe699 });
        websiteNote.position.set(380, 220);
        websiteNote.on("zoom", () => {
            this._dragManager.cancelDrag();
            window.open("https://jonny.blackburn.dev", '_blank')?.focus()
        }, this);
            
        this._notes.push(websiteNote);
        this._dragManager.addDraggable(websiteNote);

        const namePin = new Pin();
        namePin.position.set(
            nameNote.x - randomIntBetween(50, 62),
            nameNote.y - randomIntBetween(10, 34)
        );
        this._pins.push(namePin);

        this.addSkills(namePin);
        this.addExperience(namePin);
        
        this._notes.forEach((note) => note.zIndex = 1);
        this._app.stage.addChild(...this._notes);

        this._ropes.forEach((rope) => rope.graphics.zIndex = 2);
        this._app.stage.addChild(...this._ropes.map((rope) => rope.graphics));
        
        this._pins.forEach((pin) => pin.zIndex = 3);
        this._app.stage.addChild(...this._pins);
        this._dragManager.addDraggables(this._pins);

        this._dragLayer.zIndex = 100;
        this._app.stage.addChild(this._dragLayer);

        this._app.ticker.add((_time) => {
            this._ropes.forEach((rope) => rope.update());
        });
    }

    private addSkills(namePin: Pin) {
        const skillsNote = new Note("SKILLS", { width: 52, height: 24, angle: randomIntBetween(-4, 4), color: 0x6cd7ff, font: "thick_8x8" });
        skillsNote.position.set(560, 150);
        this._notes.push(skillsNote);
        this._dragManager.addDraggable(skillsNote);

        const skillPin = new Pin();
        skillPin.position.set(
            skillsNote.x - 30,
            skillsNote.y - 16,
        );
        this._pins.push(skillPin);
        this.createRopeBetween(namePin, skillPin);

        const languageList = new CheckList(["x Typescript", "X Javascript", "x WebGL", "X HTML", "x CSS", "x SCSS"]);
        languageList.position.set(471, 145);
        this._notes.push(languageList);
        this._dragManager.addDraggable(languageList);

        const languagePin = new Pin();
        languagePin.position.set(
            languageList.x - randomIntBetween(-20, 20),
            languageList.y
        );
        this._pins.push(languagePin);
        this.createRopeBetween(skillPin, languagePin);

        const frameworkList = new CheckList(["X React", "X React Native", "x NextJS", "X Redux", "x PixiJS", "x ThreeJS"], { width: 80 });
        frameworkList.position.set(558, 27);
        this._notes.push(frameworkList);
        this._dragManager.addDraggable(frameworkList);

        const frameworkPin = new Pin();
        frameworkPin.position.set(
            frameworkList.x - randomIntBetween(-20, 20),
            frameworkList.y
        );
        this._pins.push(frameworkPin);
        this.createRopeBetween(skillPin, frameworkPin);

        const toolsList = new CheckList(["x Git", "X Docker", "x Grafana", "x New Relic", "X Analytics"]);
        toolsList.position.set(445, 32);
        this._notes.push(toolsList);
        this._dragManager.addDraggable(toolsList);

        const toolsPin = new Pin();
        toolsPin.position.set(
            toolsList.x - randomIntBetween(-20, 20),
            toolsList.y
        );
        this._pins.push(toolsPin);
        this.createRopeBetween(skillPin, toolsPin);

        const miscList = new CheckList(["X Photoshop", "x Spine", "X Figma", "X Miro", "", " Telepathy"]);
        miscList.position.set(565, 194);
        this._notes.push(miscList);
        this._dragManager.addDraggable(miscList);

        const miscPin = new Pin();
        miscPin.position.set(
            miscList.x - randomIntBetween(-20, 20),
            miscList.y
        );
        this._pins.push(miscPin);
        this.createRopeBetween(skillPin, miscPin);
    }

    private addExperience(namePin: Pin) {
        const experienceNote = new Note("EVIDENCE", { width: 68, height: 24, angle: randomIntBetween(-4, 4), font: "thick_8x8", color: 0x6fff6c});
        experienceNote.position.set(140, 175);
        this._notes.push(experienceNote);
        this._dragManager.addDraggable(experienceNote);

        const experiencePin = new Pin();
        experiencePin.position.set(
            experienceNote.x - 4,
            experienceNote.y + 10,
        );
        this._pins.push(experiencePin);
        this.createRopeBetween(namePin, experiencePin);

        const sgNote = new MultiNote("SG Digital", ["Developer", "Sept 2017", "-", "Dec 2018"]);
        sgNote.position.set(69, 110);
        sgNote.on("zoom", () => this.showOverlay("SGDigital"), this);
        this._notes.push(sgNote);
        this._dragManager.addDraggable(sgNote);

        const sgPin = new Pin();
        sgPin.position.set(
            sgNote.x + randomIntBetween(0, 25),
            sgNote.y + 26
        );
        this._pins.push(sgPin);
        this.createRopeBetween(experiencePin, sgPin);

        const coreNote = new MultiNote("Core Gaming", ["Developer", "Dec 2018", "-", "Apr 2020"]);
        coreNote.position.set(141, 72);
        coreNote.on("zoom", () => this.showOverlay("CoreGaming"), this);
        this._notes.push(coreNote);
        this._dragManager.addDraggable(coreNote);

        const corePin = new Pin();
        corePin.position.set(
            coreNote.x + randomIntBetween(0, 25),
            coreNote.y + 26
        );
        this._pins.push(corePin);
        this.createRopeBetween(sgPin, corePin);

        const flutterNote = new MultiNote("Flutter", ["Engineering\nManager", "Apr 2020", "-", "Sept 2025"]);
        flutterNote.position.set(247, 65);
        flutterNote.on("zoom", () => this.showOverlay("Flutter"), this);
        this._notes.push(flutterNote);
        this._dragManager.addDraggable(flutterNote);

        const flutterPin = new Pin();
        flutterPin.position.set(
            flutterNote.x - 30,
            flutterNote.y + 26
        );
        this._pins.push(flutterPin);
        this.createRopeBetween(corePin, flutterPin);

        // Polaroids
        const skyVegasPolaroid = new Polaroid("Sky Vegas", "prize_machine", 4);
        skyVegasPolaroid.position.set(70, 276);
        skyVegasPolaroid.angle = -4;
        skyVegasPolaroid.on("zoom", () => this.showOverlay("SkyVegas"), this);
        this._notes.push(skyVegasPolaroid);
        this._dragManager.addDraggable(skyVegasPolaroid);

        const skyVegasPin = new Pin();
        skyVegasPin.position.set(
            skyVegasPolaroid.x,
            skyVegasPolaroid.y - skyVegasPolaroid.height / 2
        );
        this._pins.push(skyVegasPin);
        this.createRopeBetween(experiencePin, skyVegasPin);

        const dibzPolaroid = new Polaroid("Dibz", "dibz", -2);
        dibzPolaroid.position.set(170, 264);
        dibzPolaroid.angle = 2;
        dibzPolaroid.on("zoom", () => this.showOverlay("Dibz"), this);
        this._notes.push(dibzPolaroid);
        this._dragManager.addDraggable(dibzPolaroid);

        const dibzPin = new Pin();
        dibzPin.position.set(
            dibzPolaroid.x,
            dibzPolaroid.y - dibzPolaroid.height / 2
        );
        this._pins.push(dibzPin);
        this.createRopeBetween(experiencePin, dibzPin);

        const snailPolaroid = new Polaroid("Creature Dash", "snail");
        snailPolaroid.position.set(265, 272);
        snailPolaroid.on("zoom", () => this.showOverlay("CreatureDash"), this);
        this._notes.push(snailPolaroid);
        this._dragManager.addDraggable(snailPolaroid);

        const snailPin = new Pin();
        snailPin.position.set(
            snailPolaroid.x,
            snailPolaroid.y - snailPolaroid.height / 2
        );
        this._pins.push(snailPin);
        this.createRopeBetween(experiencePin, snailPin);
    }

    private createRopeBetween(pinA: Pin, pinB: Pin) {
        const rope = new Rope(pinA, pinB);
        
        this._ropes.push(rope);
    }

    private showOverlay(project: keyof typeof PROJECTS) {
        this._dragManager.cancelDrag();
        this._detailView.open(project);
        this._app.stage.addChild(this._detailView);
    }

    private hideOverlay() {
        this._app.stage.removeChild(this._detailView);
    }
}

const game = new Game();
game.init().then(() => {
    game.load().then(() => {
        game.create();
    })
});
