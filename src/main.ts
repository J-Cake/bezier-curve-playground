import p5 from 'p5';
import $ from 'jquery';
import _ from 'lodash';

import StateManager from "./sys/stateManager";
import {Coordinate} from "./sys/GameObject";
import Handle from "./Scripts/Handle";
import BezierCurve from "./Scripts/BezierCurve";

/**
 * This is what the global state looks like
 */
export interface GlobalState {
    drawContext: p5;
    camera_pos: { x: number, y: number };
    textures: { [texture: string]: p5.Image };

    mouse: Coordinate & { left: boolean, middle: boolean, right: boolean, prev: Coordinate };
    keys: { [key: string]: boolean };

    handles: Handle[],
    curve: BezierCurve,
}

export const TextureMap: readonly string[] = [
    "test-texture.png"
];

/**
 * This is the global state. It manages and contains variables that are accessible from anywhere within the src.
 * It can also be used to alert different components of the src about certain actions or events, as well as respond to
 * them.
 */
export const State = new StateManager<GlobalState>({
    camera_pos: {x: 0, y: 0},
    drawContext: new p5(function (ctx: p5) {
        return Object.assign(ctx, {
            preload() { // This function is the first thing that runs. You use this to load resources. Try to avoid using this function anything else.
                State.setState(() => {
                    const textures: { [texture: string]: p5.Image } = {};

                    for (const i of TextureMap)
                        ctx.loadImage(`/textures/${i}`, img => textures[i] = img);

                    return {
                        textures
                    };
                });
            },
            setup() { // This function runs once to *set up* the drawing tools, such as the canvas.
                const doc = $(document);

                ctx.createCanvas(doc.width(), doc.height())
                window.addEventListener('resize', () => ctx.resizeCanvas(window.innerWidth, window.innerWidth));

                doc.on('keydown', e => State.setState(prev => ({
                    keys: _.merge(prev.keys ?? {}, {[e.key]: true})
                })));
                doc.on('keyup', e => State.dispatch('key-press', prev => ({
                    keys: _.merge(prev.keys ?? {}, {[e.key]: false})
                })));

                doc.on('mousedown', e => State.dispatch('mouse-down', prev => ({
                    mouse: {
                        x: ctx.mouseX + prev.camera_pos.x,
                        y: ctx.mouseY + prev.camera_pos.y,
                        prev: {x: ctx.pmouseX, y: ctx.pmouseY},
                        left: Boolean(e.buttons & 1),
                        middle: Boolean(e.buttons & 4),
                        right: Boolean(e.buttons & 2),
                    }
                })));

                doc.on('mouseup', e => State.dispatch('mouse-up', prev => ({
                    mouse: {
                        x: ctx.mouseX + prev.camera_pos.x,
                        y: ctx.mouseY + prev.camera_pos.y,
                        prev: {x: ctx.pmouseX, y: ctx.pmouseY},
                        left: Boolean(e.buttons & 1),
                        middle: Boolean(e.buttons & 4),
                        right: Boolean(e.buttons & 2),
                    }
                })));

                doc.on('mousemove', () => State.dispatch('mouse-move', prev => ({
                    mouse: {
                        x: ctx.mouseX + prev.camera_pos.x,
                        y: ctx.mouseY + prev.camera_pos.y,
                        prev: {x: ctx.pmouseX, y: ctx.pmouseY},
                        left: prev.mouse.left,
                        middle: prev.mouse.middle,
                        right: prev.mouse.right
                    }
                })));

                State.setState({
                    handles: [
                        new Handle({x: ctx.width / 2 - 150, y: ctx.height / 2 + 50, width: 10, height: 10}),
                        new Handle({x: ctx.width / 2 - 50, y: ctx.height / 2 - 50, width: 10, height: 10}),
                        new Handle({x: ctx.width / 2, y: ctx.height / 2 - 75, width: 10, height: 10}),
                        new Handle({x: ctx.width / 2 + 50, y: ctx.height / 2 - 50, width: 10, height: 10}),
                        new Handle({x: ctx.width / 2 + 150, y: ctx.height / 2 + 50, width: 10, height: 10}),
                    ],
                    curve: new BezierCurve(25, 5)
                });
            },
            draw() { // Draw runs 60 times a second (or tries to). It's the update loop. For instance, if you do a call to ctx.background in here, you'll erase the background 60 times a second.
                ctx.background([0xff, 0xff, 0xff]);
                const state = State.setState(prev => ({
                    camera_pos: {
                        x: 0,
                        y: 0,
                    },
                    mouse: {
                        x: ctx.mouseX + prev.camera_pos.x,
                        y: ctx.mouseY + prev.camera_pos.y,
                        prev: {x: ctx.pmouseX, y: ctx.pmouseY},
                        left: prev.mouse.left,
                        middle: prev.mouse.middle,
                        right: prev.mouse.right
                    }
                }));

                ctx.translate(state.camera_pos.x, state.camera_pos.y);

                state?.curve.render(ctx, state);

                for (const handle of state?.handles) {
                    handle.render(ctx, state);
                    handle.tick(ctx, state);
                }
            }
        });
    }),
    mouse: {
        x: 0,
        y: 0,
        prev: {
            x: 0,
            y: 0
        },
        left: false,
        middle: false,
        right: false
    },
    keys: {}
});