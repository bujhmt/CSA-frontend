<template>
    <TemplateRoot>
        <Card class="card">
            <h1>Особистий кабінет</h1>
            <span class="sub-title">Введіть дані, щоб увійти в свій обліковий запис</span>
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
            <Btn
                @click="handleSubmit"
                :disabled="!isValidForm"
                label="Увійти"
                class="button"
            />
            <div class="text-block">
                <span>Не маєте акаунт?</span>
                <router-link to="/register" class="link">Створити обліковий запис</router-link>
            </div>
        </Card>
        <ErrorPopup :show="show">
            {{errorText}}
        </ErrorPopup>
    </TemplateRoot>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import Card from '@/components/block/card.vue';
import Btn from '@/components/block/btn.vue';
import TemplateRoot from '@/components/common/template-root.vue';
import TextInput from '@/components/forms/text-input.vue';
import {ValidationInput} from '@/interfaces/validation-input';
import ErrorPopup from '@/components/block/error-popup.vue';

const SHOW_ERROR_DURATION = 5000;

export default defineComponent({
    name: 'LoginView',
    components: {
        TextInput, TemplateRoot, Btn, Card, ErrorPopup,
    },
    data() {
        return {
            validationSchema: {
                login: {
                    value: '',
                    validators: [
                        (value) => value.length > 5,
                    ],
                },
                password: {
                    value: '',
                    validators: [
                        (value) => value.length > 8,
                    ],
                },
            } as Record<string, ValidationInput<string>>,
            isValidForm: false,
            show: false,
            errorText: '',
        };
    },
    methods: {
        handleInput(valueSchema: Record<string, string>): void {
            if (valueSchema) {
                const [key, value] = Object.entries(valueSchema)[0];
                this.validationSchema[key].value = value;
            }
        },
        showError(message: string): void {
            this.show = true;
            this.errorText = message;

            setTimeout(() => {
                this.show = false;
            }, SHOW_ERROR_DURATION);
        },
        handleSubmit(): void {
            this.$store.dispatch('auth/login', {
                login: this.validationSchema.login.value,
                password: this.validationSchema.password.value,
            }).then((success: boolean) => {
                if (success) {
                    this.$router.push({path: '/'});
                } else {
                    this.showError('Некоректні дані користувача');
                }
            }).catch(() => {
                this.showError('Проблеми з сервером, спробуйте пізніше');
            });
        },
        handleValidityChange(newValidity: boolean) {
            this.isValidForm = newValidity;
        },
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
