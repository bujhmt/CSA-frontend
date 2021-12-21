<template>
    <div class="files-form">
        <span v-if="label && label.length">{{ label }}</span>
        <div class="input-wrapper">
            <Icon src="/icons/files.svg" class="icon"/>
            <input
                type="file"
                :title="placeholder"
                multiple
                @change="handleChange"
                :class="{checked}"
            >
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Icon from '@/components/common/icon.vue';
import {TargetEvent} from '@/interfaces/target-event';

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
    emits: ['files'],
    data() {
        return {
            isFilesPicked: false,
            checked: false,
        };
    },
    computed: {
        placeholder(): string | null {
            return this.isFilesPicked ? '' : 'Файли не вибрано';
        },
    },
    methods: {
        handleChange(event: TargetEvent<HTMLInputElement>) {
            if (event.target.files) {
                this.$emit('files', event.target.files);
                this.checked = true;
            }
        },
    },
});

</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.files-form {
    display        : flex;
    flex-direction : column;
    width          : 100%;

    .input-wrapper {
        margin-top  : 10px;
        display     : flex;
        align-items : center;

        .icon {
            margin-right : 10px;
        }

        span {
            white-space : break-spaces;
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

            &.checked {
                border : 1.5px solid $dark-green;
            }
        }
    }
}
</style>
