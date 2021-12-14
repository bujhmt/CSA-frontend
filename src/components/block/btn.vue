<template>
    <button :disabled="disabled">
        <slot>{{ label }}</slot>
    </button>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

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
    background      : $primary;
    color           : $white;
    padding         : 15px;
    font-weight     : 600;
    font-size       : 24px;
    line-height     : 28px;
    border-radius   : 10px;
    border          : 2px solid $primary;
    cursor          : pointer;
    transition      : color 0.3s ease, background 0.3s ease;

    &:hover {
        background : $white;
        color      : $primary;
    }
}
</style>
