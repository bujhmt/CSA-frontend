<template>
    <TemplateRoot>
        <Card class="card">
            <h1>Подання запиту</h1>
            <select v-model="selectedType">
                <option v-for="opt in typeOptions" :key="opt">{{opt}}</option>
            </select>
            <select v-model="selectedStatus">
                <option v-for="opt in statusOptions" :key="opt">
                    {{opt}}
                </option>
            </select>
            <Btn
                @click="handleSubmit"
                :disabled="!selectedStatus"
                label="Надіслати"
                class="button"
            />
        </Card>
    </TemplateRoot>
</template>

<script lang="ts">
import {
    computed, defineComponent, ref, watch,
} from 'vue';
import Card from '@/components/block/card.vue';
import TemplateRoot from '@/components/common/template-root.vue';
import Btn from '@/components/block/btn.vue';

export default defineComponent({
    name: 'RequestView',
    components: {
        TemplateRoot,
        Card,
        Btn,
    },
    setup() {
        const typeOptions = ref(['Витяг', 'Свідоцтво']);
        const selectedType = ref<string>('');

        const statusOptions = computed(() => {
            switch (selectedType.value) {
            case 'Витяг':
                return ['Скорочений витяг запису про народження',
                    'Повний витяг запису про народження',
                    'Витяг запису про державну реєстрацію шлюбу'];
            case 'Свідоцтво':
                return ['Свідоцтво про розірвання шлюбу',
                    'Свідоцтво про зміну імені',
                    'Свідоцтво про смерть'];
            default:
                return [];
            }
        });
        const selectedStatus = ref<string>('');

        watch(() => selectedType.value, (first, second) => {
            if (first !== second) {
                selectedStatus.value = '';
            }
        });

        const handleSubmit = () => {
            console.log(selectedStatus.value);
        };

        return {
            typeOptions,
            selectedType,
            selectedStatus,
            statusOptions,
            handleSubmit,
        };
    },
});

</script>

<style lang="scss" scoped>
@import "src/assets/colors";

.card {
    max-width      : 730px;
    margin         : 60px auto;
    align-items    : center;
    flex-direction : column;

    h1 {
        margin-bottom : 30px;
        text-align    : center;
    }

    .button {
        width         : 100%;
        max-width     : 300px;
        margin-bottom : 40px;
    }

    .sub-title {
        margin-bottom : 40px;
        text-align    : center;
    }

    select {
        width         : 100%;
        max-width     : 400px;
        margin-bottom : 30px;
    }

    .text-block {
        display         : flex;
        justify-content : center;
        flex-wrap       : wrap;
        margin          : 0 -10px;

        * {
            padding     : 0 5px;
            font-weight : 500;
            font-size   : 18px;
            line-height : 30px;
            text-align  : center;
        }

        .link {
            color : $primary;

            &:hover {
                color : $primary-darken;
            }
        }
    }
}
</style>
