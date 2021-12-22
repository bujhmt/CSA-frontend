<template>
    <TemplateRoot>
        <Card class="card">
            <h1>Деактивація користувача</h1>
            <TextInput
                :validators="validationSchema.login.validators"
                type="email"
                placeholder="Логін"
                class="input"
                input-key="login"
                @value="handleInput"
                @valid-change="handleValidityChange"
            />
            <Btn
                @click="handleSubmit"
                :disabled="!isValidForm"
                label="Створити"
                class="button"
            />
        </Card>
        <ErrorPopup :show="show">
            {{errorText}}
        </ErrorPopup>
    </TemplateRoot>
</template>

<script lang="ts">

import {defineComponent, reactive, ref} from 'vue';
import { useStore } from 'vuex';
import {useRouter} from 'vue-router';
import Card from '@/components/block/card.vue';
import Btn from '@/components/block/btn.vue';
import TemplateRoot from '@/components/common/template-root.vue';
import TextInput from '@/components/forms/text-input.vue';
import {ValidationInput} from '@/interfaces/validation-input';
import ErrorPopup from '@/components/block/error-popup.vue';
import axios from '@/plugins/axios';
import { AuthResponse } from '@/interfaces/authResponse';

const SHOW_ERROR_DURATION = 5000;

export default defineComponent({
    name: 'RegisterView',
    components: {
        TextInput, TemplateRoot, Btn, Card, ErrorPopup,
    },
    setup() {
        const store = useStore();

        const isValidForm = ref(false);
        const show = ref(false);
        const errorText = ref('');

        const loginValidation = reactive<ValidationInput<string>>(
            {
                value: '',
                validators: [
                    (value) => value.length > 5,
                ],
            },
        );

        const validationSchema = reactive<Record<string, ValidationInput<string>>>({
            login: loginValidation,
        });

        const handleValidityChange = (newValidity: boolean) => {
            isValidForm.value = newValidity;
        };

        const handleInput = (valueSchema: Record<string, string>): void => {
            if (valueSchema) {
                const [key, value] = Object.entries(valueSchema)[0];
                validationSchema[key].value = value;
            }
        };

        const showError = (message: string): void => {
            show.value = true;
            errorText.value = message;

            setTimeout(() => {
                show.value = false;
            }, SHOW_ERROR_DURATION);
        };

        const handleSubmit = () => {
            axios.post<AuthResponse>('/auth/signup/registrator', {
                login: loginValidation.value,
            }, {headers: { Authorization: `Bearer ${store.getters['auth/userToken']}`}}).then((res) => {
                if (!res?.data?.token) {
                    showError('Такого користувача не існує');
                }
            }).catch(() => {
                showError('Проблеми з сервером, спробуйте пізніше');
            });
        };
        return {
            handleInput,
            handleSubmit,
            validationSchema,
            handleValidityChange,
            isValidForm,
            show,
            errorText,
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

    .input {
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
