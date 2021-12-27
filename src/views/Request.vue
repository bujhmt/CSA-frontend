<template>
    <TemplateRoot>
        <Card class="card">
            <h1>Подання запиту</h1>
            <select v-model="selectedType" class="select">
                <option v-for="opt in typeOptions" :key="opt">
                    {{ opt }}
                </option>
            </select>
            <select
                v-model="selectedStatus"
                class="select"
                :class="{disabled: !selectedType}"
            >
                <option
                    v-for="opt in statusOptions"
                    :key="opt.type"
                    :value="opt"
                    :disabled="!selectedType"
                >
                    {{ opt.name }}
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
import {useRouter} from 'vue-router';
import Card from '@/components/block/card.vue';
import TemplateRoot from '@/components/common/template-root.vue';
import Btn from '@/components/block/btn.vue';
import getEnv from '@/helpers/get-env';

export default defineComponent({
    name: 'RequestView',
    components: {
        TemplateRoot,
        Card,
        Btn,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
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

        const selectedStatus = ref<{ name: string, type: string }>({name: '', type: ''});

        watch(() => selectedType.value, (first, second) => {
            if (first !== second) {
                selectedStatus.value.name = '';
            }
        });

        const baseUrl = getEnv<string>('VUE_APP_API_URL');

        const handleSubmit = () => {
            store.dispatch('issuedDocs/sendReq',
                {
                    type: selectedStatus.value.name,
                }).then(() => {
                window.open(`${baseUrl}/receipt.pdf`, '_blank');
                router.push({name: 'Home'});
            });
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
@import 'src/assets/colors';

.card {
    max-width      : 730px;
    margin         : 60px auto;
    align-items    : center;
    flex-direction : column;

    .select {
        padding       : 5px 10px;
        background    : $white;
        border        : 1px solid $primary;
        box-sizing    : border-box;
        border-radius : 10px;

        &.disabled {
            border : 1px solid $grey;
        }
    }

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
