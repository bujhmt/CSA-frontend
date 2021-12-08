<template>
    <input
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :class="{invalid: !isValid}"
        @input="handleInput"
        class="text-input"
    >
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Validator} from '@/interfaces/types/validator';

export default defineComponent({
    name: 'TextInput',
    props: {
        placeholder: {
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
    },
    emits: ['value', 'valid-change'],
    data() {
        return {
            value: '',
        };
    },
    computed: {
        isValid(): boolean {
            if (!this.value.length) {
                return true;
            }

            return this.validators?.every((validator) => validator(this.value));
        },
    },
    methods: {
        handleInput(): void {
            if (this.isValid) {
                this.$emit('value', this.inputKey ? {[this.inputKey]: this.value} : this.value);
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
@import "src/assets/colors";

.text-input {
    padding       : 13px 25px;
    background    : $white;
    border        : 1px solid $primary;
    box-sizing    : border-box;
    border-radius : 10px;
    transition    : border 0.3s ease;

    &.invalid {
        border : 1px solid $red;
    }
}

</style>
