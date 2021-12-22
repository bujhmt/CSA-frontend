<template>
    <button :disabled="disabled" :class="{disabled, [accent]: true}">
        <slot>{{ label }}</slot>
    </button>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

enum Accent {
    DEFAULT = 'default',
    DANGER = 'danger',
}

export default defineComponent({
    name: 'Btn',
    props: {
        label: {
            required: true,
            type: String,
        },
        disabled: {
            required: false,
            type: Boolean,
            default: false,
        },
        accent: {
            required: false,
            type: String as () => Accent,
            default: Accent.DEFAULT,
        },
    },
});

</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

button {
    display         : flex;
    justify-content : center;
    align-items     : center;
    color           : $white;
    padding         : 15px;
    font-weight     : 600;
    font-size       : 24px;
    line-height     : 28px;
    border-radius   : 10px;
    cursor          : pointer;
    transition      : color 0.3s ease, background 0.3s ease;

    &.disabled {
        background : rgba($black, 0.4);
        border     : none;
        cursor     : default;
    }

    &.default {
        background : $primary;
        border     : 2px solid $primary;

        &:hover:not(.disabled) {
            background : $white;
            color      : $primary;
        }
    }

    &.danger {
        background : darken($red, 15);
        border     : 2px solid darken($red, 15);

        &:hover:not(.disabled) {
            background : $white;
            color      : darken($red, 15);
        }
    }
}
</style>
