import type { StructFieldDefinition } from "./definition.js";
import type { StructFieldValue } from "./field-value.js";

export const STRUCT_VALUE_SYMBOL = Symbol("struct-value");

export function isStructValueInit(
    value: unknown,
): value is { [STRUCT_VALUE_SYMBOL]: StructValue } {
    return (
        typeof value === "object" &&
        value !== null &&
        STRUCT_VALUE_SYMBOL in value
    );
}

/**
 * A struct value is a map between keys in a struct and their field values.
 */
export class StructValue {
    /** @internal */ readonly fieldValues: Record<
        PropertyKey,
        StructFieldValue<StructFieldDefinition<unknown, unknown, PropertyKey>>
    > = {};

    /**
     * Gets the result struct value object
     */
    readonly value: Record<PropertyKey, unknown>;

    constructor(prototype: object) {
        // PERF: `Object.create(extra)` is 50% faster
        // than `Object.defineProperties(this.value, extra)`
        this.value = Object.create(prototype) as Record<PropertyKey, unknown>;

        // PERF: `Object.defineProperty` is slow
        // but we need it to be non-enumerable
        Object.defineProperty(this.value, STRUCT_VALUE_SYMBOL, {
            enumerable: false,
            value: this,
        });
    }

    /**
     * Sets a `StructFieldValue` for `key`
     *
     * @param name The field name
     * @param fieldValue The associated `StructFieldValue`
     */
    set(
        name: PropertyKey,
        fieldValue: StructFieldValue<
            StructFieldDefinition<unknown, unknown, PropertyKey>
        >,
    ): void {
        this.fieldValues[name] = fieldValue;

        // PERF: `Object.defineProperty` is slow
        // use normal property when possible
        if (fieldValue.hasCustomAccessors) {
            Object.defineProperty(this.value, name, {
                configurable: true,
                enumerable: true,
                get() {
                    return fieldValue.get();
                },
                set(v) {
                    fieldValue.set(v);
                },
            });
        } else {
            this.value[name] = fieldValue.get();
        }
    }

    /**
     * Gets the `StructFieldValue` for `key`
     *
     * @param name The field name
     */
    get(
        name: PropertyKey,
    ): StructFieldValue<StructFieldDefinition<unknown, unknown, PropertyKey>> {
        return this.fieldValues[name]!;
    }
}
