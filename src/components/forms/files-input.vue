<template>
    <div class="files-form">
        <span v-if="label && label.length">{{ label }}</span>
        <div class="input-wrapper">
            <Icon src="/icons/files.svg" class="icon"/>
            <input
                type="file"
                :title="placeholder"
                multiple
            >
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Icon from '@/components/common/icon.vue';

export default defineComponent({
    name: 'FilesInput',
    components: {Icon},
    props: {
        label: {
            required: false,
            type: String,
            default: '',
        },
    },
    data() {
        return {
            isFilesPicked: false,
        };
    },
    computed: {
        placeholder(): string | null {
            return this.isFilesPicked ? '' : 'Файли не вибрано';
        },
    },
});

</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.files-form {
    display        : flex;
    flex-direction : column;

    .input-wrapper {
        margin-top  : 10px;
        display     : flex;
        align-items : center;

        .icon {
            margin-right : 10px;
        }

        input {
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
    }
}
</style>
