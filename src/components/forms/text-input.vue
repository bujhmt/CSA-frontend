<template>
    <div class="input-wrapper">
        <label v-if="label && label.length">{{ label }}</label>
        <label v-else>{{ placeholder }}</label>
        <component
            :is="tag"
            :type="type"
            :placeholder="placeholder"
            :rows="textarea && rows"
            :class="{invalid: !isValid, small: label && label.length}"
            @input="handleInput"
            class="text-input"
        />
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Validator} from '@/interfaces/types/validator';
import {TargetEvent} from '@/interfaces/target-event';

const END_DELAY = 1000;

export default defineComponent({
    name: 'TextInput',
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
        type: {
            required: false,
            type: String,
            default: 'text',
        },
        inputKey: {
            required: false,
            type: String as () => string | null,
            default: null,
        },
        validators: {
            required: false,
            type: Array as () => Validator<string>[],
            default: () => [],
        },
        textarea: {
            required: false,
            type: Boolean,
            default: false,
        },
        rows: {
            required: false,
            type: Number,
            default: 5,
        },
    },
    emits: ['value', 'valid-change', 'end'],
    data() {
        return {
            value: '',
            timeout: null as null | number,
        };
    },
    computed: {
        isValid(): boolean {
            if (!this.value.length) {
                return true;
            }

            return this.validators?.every((validator) => validator(this.value));
        },
        tag(): string {
            return this.textarea ? 'textarea' : 'input';
        },
    },
    methods: {
        handleInput(event: TargetEvent<HTMLInputElement | HTMLTextAreaElement>): void {
            this.value = event.target.value;

            this.$emit('value', this.inputKey ? {[this.inputKey]: this.value} : this.value);
            this.$emit('valid-change', this.isValid);

            if (this.value) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }

                this.timeout = setTimeout(() => {
                    this.$emit('end', this.inputKey ? {[this.inputKey]: this.value} : this.value);
                    this.timeout = null;
                }, END_DELAY);
            }
        },
    },
    watch: {
        isValid(newValidity: boolean) {
            this.$emit('valid-change', newValidity);
        },
    },
});

</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.input-wrapper {
    display        : flex;
    flex-direction : column;

    label {
        font-weight : 500;
        font-size   : 16px;
        padding     : 0 5px;
        line-height : 25px;
    }

    .text-input {
        padding       : 13px 25px;
        background    : $white;
        border        : 1px solid $primary;
        box-sizing    : border-box;
        border-radius : 10px;
        transition    : border 0.3s ease;
        width         : 100%;

        &.small {
            padding : 10px;
        }

        &.invalid {
            border : 1px solid $red;
        }
    }
}

</style>
