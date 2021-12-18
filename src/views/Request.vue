<template>
    <TemplateRoot>
        <Card class="card">
            <h1>Подання запиту</h1>
            <select v-model="selectedType">
                <option v-for="opt in typeOptions" :key="opt">{{opt}}</option>
            </select>
            <select v-model="selectedStatus">
                <option v-for="opt in statusOptions" :key="opt.type" :value="opt">
                    {{opt.name}}
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
import {useStore} from 'vuex';
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
        const store = useStore();
        const typeOptions = ref(['Витяг', 'Свідоцтво']);
        const selectedType = ref<string>('');

        const statusOptions = computed(() => {
            switch (selectedType.value) {
            case 'Витяг':
                return [{name: 'Скорочений витяг запису про народження', type: 'birth'},
                    {name: 'Повний витяг запису про народження', type: 'birth full'},
                    {name: 'Витяг запису про державну реєстрацію шлюбу', type: 'marReg'}];
            case 'Свідоцтво':
                return [{name: 'Свідоцтво про розірвання шлюбу', type: 'divorce'},
                    {name: 'Свідоцтво про зміну імені', type: 'nameChange'},
                    {name: 'Свідоцтво про смерть', type: 'death'}];
            default:
                return [];
            }
        });
        const selectedStatus = ref<{name: string, type: string}>({name: '', type: ''});

        watch(() => selectedType.value, (first, second) => {
            if (first !== second) {
                selectedStatus.value.name = '';
            }
        });

        const handleSubmit = () => {
            console.log(selectedStatus.value);
            const isFull = selectedStatus.value.type.split(' ')[1] === 'full';
            store.dispatch('issuedDocs/sendReq', {type: isFull ? `Повний ${selectedType.value}` : selectedType.value, actType: selectedStatus.value.type.split(' ')[0]});
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
