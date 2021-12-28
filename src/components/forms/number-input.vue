<template>
    <div class="input-wrapper">
        <label v-if="label && label.length">{{ label }}</label>
        <input
            v-model="value"
            :placeholder="placeholder"
            :max="max"
            :min="min"
            @input="handleInput"
            type="number"
        >
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

const END_DELAY = 1000;

export default defineComponent({
    name: 'NumberInput',
    props: {
        placeholder: {
            required: false,
            type: String,
            default: '',
        },
        label: {
            required: false,
            type: String,
            default: '',
        },
        initialValue: {
            required: false,
            type: Number,
            default: null,
        },
        min: {
            required: false,
            type: Number,
            default: null,
        },
        max: {
            required: false,
            type: Number,
            default: null,
        },
    },
    emits: ['value', 'end'],
    data() {
        return {
            value: this.initialValue,
            timeout: null as null | number,
        };
    },
    methods: {
        handleInput(): void {
            if (this.value) {
                this.$emit('value', this.value);

                if (this.timeout) {
                    clearTimeout(this.timeout);
                }

                this.timeout = setTimeout(() => {
                    this.$emit('end', this.value);
                    this.timeout = null;
                }, END_DELAY);
            }
        },
    },
});

</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.input-wrapper {
    display        : flex;
    flex-direction : column;
    width          : 100%;

    label {
        font-weight : 500;
        font-size   : 16px;
        padding     : 0 5px;
        line-height : 25px;
    }

    input {
        padding       : 13px 25px;
        background    : $white;
        border        : 1px solid $primary;
        box-sizing    : border-box;
        border-radius : 10px;
        transition    : border 0.3s ease;
        width         : 100%;
    }
}

</style>
