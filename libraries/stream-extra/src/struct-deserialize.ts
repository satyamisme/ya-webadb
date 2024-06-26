import type Struct from "@yume-chan/struct";
import type { StructValueType } from "@yume-chan/struct";

import { BufferedTransformStream } from "./buffered-transform.js";

export class StructDeserializeStream<
    T extends Struct<object, PropertyKey, object, unknown>,
> extends BufferedTransformStream<StructValueType<T>> {
    constructor(struct: T) {
        super((stream) => {
            return struct.deserialize(stream) as never;
        });
    }
}
