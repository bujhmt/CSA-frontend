<template>
    <select v-model="selected" @change="handleSelect">
        <option
            v-for="(item, index) in values"
            :value="item.value"
            :key="`${item.value}-${index}`"
        >
            {{item.title || item.value}}
        </option>
    </select>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {SelectItem} from '@/interfaces/inputs/select-item';

export default defineComponent({
    name: 'SelectInput',
    props: {
        values: {
            required: true,
            type: Array as () => SelectItem[],
            default: () => [],
        },
    },
    emits: ['selected'],
    data() {
        return {
            selected: this.values?.[0]?.value,
        };
    },
    methods: {
        handleSelect() {
            this.$emit('selected', this.selected);
        },
    },
});

</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

select {
    padding       : 10px 25px;
    background    : $white;
    border        : 1px solid $primary;
    box-sizing    : border-box;
    border-radius : 10px;
    transition    : border 0.3s ease;
    width         : 100%;
}

</style>
