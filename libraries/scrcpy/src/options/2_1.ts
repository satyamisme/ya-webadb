import { ScrcpyOptions1_21 } from "./1_21.js";
import type { ScrcpyOptionsInit2_0 } from "./2_0.js";
import { ScrcpyOptions2_0 } from "./2_0.js";
import { ScrcpyOptions } from "./types.js";

export interface ScrcpyOptionsInit2_1 extends ScrcpyOptionsInit2_0 {
    video?: boolean;
    audioSource?: "output" | "mic";
}

export class ScrcpyOptions2_1 extends ScrcpyOptions<ScrcpyOptionsInit2_1> {
    static readonly DEFAULTS = {
        ...ScrcpyOptions2_0.DEFAULTS,
        video: true,
        audioSource: "output",
    } as const satisfies Required<ScrcpyOptionsInit2_1>;

    override get defaults(): Required<ScrcpyOptionsInit2_1> {
        return ScrcpyOptions2_1.DEFAULTS;
    }

    constructor(init: ScrcpyOptionsInit2_1) {
        super(ScrcpyOptions2_0, init, ScrcpyOptions2_1.DEFAULTS);
    }

    override serialize(): string[] {
        return ScrcpyOptions1_21.serialize(this.value, this.defaults);
    }
}
