<template>
    <TemplateRoot>
        <Card class="card">
            <h1>Регістрація</h1>
            <TextInput
                :validators="validationSchema.login.validators"
                type="email"
                placeholder="Логін"
                class="input"
                input-key="login"
                @value="handleInput"
                @valid-change="handleValidityChange"
            />
            <TextInput
                :validators="validationSchema.password.validators"
                type="password"
                placeholder="Пароль"
                class="input"
                input-key="password"
                @value="handleInput"
                @valid-change="handleValidityChange"
            />
            <TextInput
                :validators="validationSchema.passwordRepeat.validators"
                type="password"
                placeholder="Повторіть пароль"
                class="input"
                input-key="passwordRepeat"
                @value="handleInput"
                @valid-change="handleValidityChange"
            />
            <Btn
                @click="handleSubmit"
                :disabled="!isValidForm"
                label="Створити"
                class="button"
            />
            <div class="text-block">
                <span>Вже маєте акаунт?</span>
                <router-link to="/login" class="link">Авторизуйтесь</router-link>
            </div>
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

const SHOW_ERROR_DURATION = 5000;

export default defineComponent({
    name: 'RegisterView',
    components: {
        TextInput, TemplateRoot, Btn, Card, ErrorPopup,
    },
    setup() {
        const store = useStore();
        const router = useRouter();

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
        const passwordValidation = reactive<ValidationInput<string>>(
            {
                value: '',
                validators: [
                    (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/gi.test(value),
                ],
            },
        );
        const passwordRepeatValidation = reactive<ValidationInput<string>>(
            {
                value: '',
                validators: [
                    (value) => passwordValidation.value === value,
                ],
            },
        );

        const validationSchema = reactive<Record<string, ValidationInput<string>>>({
            login: loginValidation,
            password: passwordValidation,
            passwordRepeat: passwordRepeatValidation,
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
            store.dispatch('auth/register', {
                login: loginValidation.value,
                password: passwordValidation.value,
            }).then((success) => {
                if (success) {
                    router.push({path: '/'});
                } else {
                    showError('Цей логін вже зайнятий');
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
