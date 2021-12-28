<template>
    <TemplateRoot>
        <Card class="card">
            <h1>Додавання акту цивільного стану</h1>
            <select v-model="selectedType" class="select">
                <option v-for="opt in typeOptions" :key="opt">
                    {{ opt }}
                </option>
            </select>
            <TextInput v-if="selectedType==='Зміна імені'"
                    placeholder="Нове ПІБ"
                    :validators="validationSchema.name.validators"
                    @value="handleInput"
            />
            <div v-else-if="selectedType==='Одруження'">
                <TextInput
                    placeholder="Номер паспорту чоловіка"
                    :validators="validationSchemaMarriage.documentHusband.validators"
                    input-key="documentHusband"
                    @value="handleInputMarriage"
                />
                <TextInput
                    placeholder="Номер паспорту жінки"
                    :validators="validationSchemaMarriage.documentWife.validators"
                    input-key="documentWife"
                    @value="handleInputMarriage"
                />
            </div>
            <Btn
                @click="handleSubmit"
                :disabled="!selectedType"
                label="Додати"
                class="button"
            />
        </Card>
    </TemplateRoot>
</template>

<script lang="ts">
import {
    computed, defineComponent, reactive, ref, watch,
} from 'vue';
import {useStore} from 'vuex';
import {useRoute, useRouter} from 'vue-router';
import Card from '@/components/block/card.vue';
import TemplateRoot from '@/components/common/template-root.vue';
import Btn from '@/components/block/btn.vue';
import getEnv from '@/helpers/get-env';
import TextInput from '@/components/forms/text-input.vue';
import { ValidationInput } from '@/interfaces/validation-input';
import { $post } from '@/plugins/axios';

export default defineComponent({
    name: 'RequestView',
    components: {
        TemplateRoot,
        TextInput,
        Card,
        Btn,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        const typeOptions = ref(['Зміна імені', 'Одруження', 'Смерть']);
        const selectedType = ref<string>('');

        const baseUrl = getEnv<string>('VUE_APP_API_URL');

        const nameValidation = reactive<ValidationInput<string>>(
            {
                value: '',
                validators: [
                    (value) => value.length > 7,
                    (value) => value.split(' ').length === 3,
                ],
            },
        );

        const documentHusbandValidation = reactive<ValidationInput<string>>(
            {
                value: '',
                validators: [
                    (value) => value.length === 9,
                    (value) => value.match(/^[0-9]*$/),
                ],
            },
        );

        const documentWifeValidation = reactive<ValidationInput<string>>(
            {
                value: '',
                validators: [
                    (value) => value.length === 9,
                    (value) => value.match(/^[0-9]*$/),
                ],
            },
        );

        const validationSchema = reactive<Record<string, ValidationInput<string>>>({
            name: nameValidation,
        });

        const validationSchemaMarriage = reactive<Record<string, ValidationInput<string>>>({
            documentHusband: documentHusbandValidation,
            documentWife: documentWifeValidation,
        });

        const handleInput = (valueSchema: string): void => {
            if (valueSchema) {
                validationSchema.name.value = valueSchema;
            }
        };

        const handleInputMarriage = (valueSchema: Record<string, string>): void => {
            if (valueSchema) {
                const [key, value] = Object.entries(valueSchema)[0];
                validationSchemaMarriage[key].value = value;
            }
        };
        const actTypeFromLocale: Record<string, string> = {
            'Зміна імені': 'nameChange',
            Одруження: 'marriage',
            Смерть: 'death',
        };

        const handleSubmit = () => {
            const body: {userId: string, data?: Record<string, string>, actType: string} = {
                userId: route.params.id as string,
                actType: actTypeFromLocale[selectedType.value],
            };
            switch (selectedType.value) {
            case 'Зміна імені':
                body.data = {
                    newName: validationSchema.name.value,
                };
                break;
            case 'Одруження':
                body.data = {
                    husbandDocument: validationSchemaMarriage.documentHusband.value,
                    wifeDocument: validationSchemaMarriage.documentWife.value,
                };
                break;
            default:
                break;
            }
            console.log(body);
            $post<string>('/civil-act/create', {
                auth: store.getters['auth/userToken'],
                body,
            }).then((answer) => {
                console.log(answer);
            });
        };

        return {
            typeOptions,
            selectedType,
            handleSubmit,
            handleInput,
            handleInputMarriage,
            validationSchema,
            validationSchemaMarriage,
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
        margin-top : 40px;
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
