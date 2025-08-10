import { BitmapText, Container, Rectangle, Sprite } from "pixi.js";
import { randomBool, randomIntBetween } from "../utils";

export const PROJECTS: { [key: string]: { title: string, text: string, link?: string } } = {
    SkyVegas: {
        title: "Sky Vegas",
        text: `    Took ownership of core PixiJS based free to play promotional slot game, grew daily players from 250K to 300K+ with new bonus rounds and UX features. Led delivery and collaborated with stakeholders in  marketing, product & design.
        
        
    Worked with key stakeholders to help design, prototype and successfully deliver 3 other PixiJS based promotional minigames. Breaking specifications down into tickets and delegating to other members or the team. 
        `,
    },

    Dibz: {
        title: "Dibz",
        text: `    While working at Flutter, I was able to take a secondment to work on Dibz. Dibz is a betting app built in React Native, aimed at a younger audience by making betting easier, think Bingo meets football. 
    I supported the launch of the MVP and contributed to incremental updates with a fast-paced agile team based in Portugal.`,
    },

    CreatureDash: {
        title: "Creature Dash",
        text: `    We were approached by a local school to help create an alternative to an expensive Snail Racing product they were using. 
    We took the opportunity to create a platform aimed at hosting virtual race nights using PixiJs for the game and React, Redux, Prisma, Docker to create the site.`,
    link: "https://www.creaturedash.com"
    },

    Flutter: {
        title: "Flutter",
        text: `    Engineering Manager
        Oct 2024 - Sept 2025
    Senior Software Developer
        Sept 2021 - Oct 2024
    Software Developer
        April 2020 - Sept 2021

    
    
    Led an agile team of six developers focusing on mentorship, code quality, and delivery. Worked on multiple front-end projects using React, React Native, and Pixi.js. Championed code reviews and pair programming to raise team technical standards.`,
    },

    CoreGaming: {
        title: "Core Gaming",
        text: `    Game Developer
        Dec 2018 - April 2020

    
    
    Sole developer creating a performant 2D/3D front-end game framework using Pixi.js and Three.js. Defined architecture, Git workflows, and coding standards from the ground up.`,
    },

    SGDigital: {
        title: "SG Digital",
        text: `    Software Engineer
        Sept 2017 - Dec 2018

        
        
    Developed omni-channel slot games across web and mobile platforms. Built internal tools to streamline localization and translations. Maintained and improved legacy libraries to support live games.`,
    }
};

export class DetailView extends Container {

    private _paperclip: Sprite;
    private _stamp: Sprite;
    private _title: BitmapText;
    private _link: BitmapText;
    private _text: BitmapText;

    constructor() {
        super();

        const background = Sprite.from("folder");
        this.addChild(background);

        const closeButton = new BitmapText({
            text: "X",
            style: {
                fontFamily: "square_6x6",
                fontSize: 20,
                fill: 0xff0000,
            }
        });
        closeButton.position.set(15, 8);
        this.addChild(closeButton);
        closeButton.eventMode = "static";
        closeButton.cursor = "pointer";
        closeButton.hitArea = new Rectangle(-4, -6, 18, 18);
        closeButton.on("pointerdown", () => this.emit("close"), this);

        this._title = new BitmapText({
            text: "",
            style: {
                fontFamily: "thick_8x8",
                fontSize: 20,
                fill: 0x1877ec,
            }
        });
        this._title.position.set(265, 20);
        this.addChild(this._title);

        this._link = new BitmapText({
            text: "",
            style: {
                fontFamily: "square_6x6",
                fontSize: 10,
                fill: 0x1877ec,
            }
        });
        this._link.position.set(265, 50);
        this.addChild(this._link);

        this._text = new BitmapText({
            text: "",
            style: {
                fontFamily: "minogram_6x10",
                fontSize: 10,
                fill: 0x3e3e3e,
                wordWrap: true,
                wordWrapWidth: 230,
            }
        });
        this._text.position.set(250, 70);
        this.addChild(this._text);

        this._paperclip = Sprite.from("paperclip");
        this.addChild(this._paperclip);

        this._stamp = Sprite.from("top_secret");
        this._stamp.anchor.set(0.5);
        this.addChild(this._stamp);

        this.randomize();
    }

    public open(project: keyof typeof PROJECTS) {
        this.randomize();

        const details = PROJECTS[project];

        this._title.text = details.title;
        this._text.text = details.text;

        this._link.text = "";
        if (details.link) {
            this._link.removeAllListeners();
            this._link.text = details.link;

            this._link.eventMode = "static";
            this._link.cursor = "zoom-in";
            this._link.on("pointerdown", () => window.open(details.link, '_blank')?.focus(), this);
        }
    }

    private randomize() {
        this._paperclip.position.set(randomIntBetween(240, 250), 5);
        this._paperclip.visible = randomBool();

        this._stamp.position.set(randomIntBetween(80, 160), randomIntBetween(30, 290));
        this._stamp.angle = randomIntBetween(-10, 10);
        this._stamp.visible = randomBool();
    }

}