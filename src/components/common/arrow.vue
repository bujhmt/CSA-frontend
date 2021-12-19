<template>
    <div
        class="arrow"
        :class="direction"
        :style="{'--size': `${size}px`, '--primary-size': `${primarySize}px`}"
    ></div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

const DEFAULT_ARROW_SIZE = 6;
const PRIMARY_DIFFERENCE = 2;

enum Direction {
    TOP = 'top',
    BOTTOM = 'bottom',
    RIGHT = 'right',
    LEFT = 'left',
}

enum Type {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
}

export default defineComponent({
    name: 'Arrow',
    props: {
        size: {
            required: false,
            type: Number,
            default: () => DEFAULT_ARROW_SIZE,
        },
        direction: {
            required: false,
            type: String as () => Direction,
            default: Direction.TOP,
        },
        type: {
            required: false,
            type: String as () => Type,
            default: Type.PRIMARY,
        },
    },
    computed: {
        primarySize(): number {
            return this.type === Type.PRIMARY ? this.size + PRIMARY_DIFFERENCE : this.size;
        },
    },
});

</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.arrow {
    width         : 0;
    height        : 0;
    border-left   : var(--size) solid transparent;
    border-right  : var(--size) solid transparent;
    border-bottom : var(--primary-size) solid $grey;

    &.bottom {
        transform : rotate(180deg);
    }

    &.right {
        transform : rotate(90deg);
    }

    &.left {
        transform : rotate(-90deg);
    }
}

</style>
