import type p5 from 'p5';
import {GlobalState} from "../main";
import DragObject from "../sys/DragObject";
import {Rect} from "../sys/GameObject";

export default class Handle extends DragObject {
    constructor(hitBox: Rect) {
        super(hitBox);
    }

    render(ctx: p5, state: GlobalState) {
        if (this.isInterceptingRadius(state.mouse, 10) || this.isDragging) {
            ctx.fill(0xff);
            ctx.stroke(0, 0, 0, 128);
        } else {
            ctx.fill(0x88);
            ctx.stroke(80, 80, 80, 50);
        }

        const pos = this.hitBox;
        ctx.ellipse(pos.x, pos.y, pos.width, pos.height);
    }

    tick(ctx: p5, state: GlobalState) {
    }
}