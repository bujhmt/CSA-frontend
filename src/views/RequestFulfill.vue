<template>
    <TemplateRoot>
        <Breadcrumbs :links="breadcrumbs"/>
        <div class="cards-wrapper" v-if="issuedDocument">
            <Card class="issued-document-card">
                <span>Запит:</span>
                <strong>{{ issuedDocument.type }}</strong>
                <span>Номер запиту:</span>
                <strong>{{ issuedDocument.serialCode }}</strong>
                <span>Дата запиту:</span>
                <strong>{{ issuedDocument.requestDate }}</strong>
                <span class="block">Особа, що подала запит:</span>
                <span></span>
                <span>ФІО:</span>
                <strong>{{ issuedDocument.requester.name }}</strong>
                <span>№ Документу:</span>
                <strong>{{ issuedDocument.requester.passportData.document }}</strong>
                <span>№ Запису:</span>
                <strong>{{ issuedDocument.requester.passportData.record }}</strong>
                <span>ІПН:</span>
                <strong>{{
                        issuedDocument.requester.passportData.taxpayerIdentificationNumber
                    }}</strong>
                <div
                    v-if="issuedDocument.requester.userDocuments
                    && issuedDocument.requester.userDocuments.length"
                >
                    <img
                        v-for="doc in issuedDocument.requester.userDocuments"
                        :src="`${baseUrl}/${doc.document}`"
                        :key="doc.id"
                        alt="document"
                    >
                </div>
            </Card>
            <Card class="buttons-card">
                <FormGroup class="files-form-group">
                    <FilesInput label="Витяг/свідоцтво" @files="addFiles"/>
                </FormGroup>
                <Btn label="Надати" class="button" @click="handleSubmit"/>
                <TextInput
                    placeholder="Причина відмови"
                    input-key="comment"
                    @value="handleComment"
                />
                <Btn label="Відмовити" class="button" accent="danger" @click="denyReq"/>
            </Card>
        </div>
    </TemplateRoot>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import TemplateRoot from '@/components/common/template-root.vue';
import Breadcrumbs from '@/components/common/breadcrumbs.vue';
import {BreadcrumbLink} from '@/interfaces/breadcrumbs-link';
import {IssuedDocument} from '@/interfaces/models/issued-document';
import Card from '@/components/block/card.vue';
import FormGroup from '@/components/block/form-group.vue';
import TextInput from '@/components/forms/text-input.vue';
import FilesInput from '@/components/forms/files-input.vue';
import getEnv from '@/helpers/get-env';
import Btn from '@/components/block/btn.vue';

export default defineComponent({
    name: 'ProfileView',
    components: {
        Btn,
        Card,
        Breadcrumbs,
        TemplateRoot,
        FormGroup,
        FilesInput,
        TextInput,
    },
    props: {
        id: {
            required: false,
            type: Number,
        },
    },
    data() {
        const baseUrl = getEnv<string>('VUE_APP_API_URL');

        return {
            baseUrl,
            files: [] as File[],
            comment: '',
        };
    },
    computed: {
        serialCode(): number {
            return parseInt(this.$route.params.id as string, 10);
        },
        issuedDocument(): IssuedDocument {
            return this.$store.getters['issuedDocs/bySerialCode'](this.serialCode);
        },
        breadcrumbs(): BreadcrumbLink[] {
            return [
                {
                    url: '/registrator',
                    text: 'Запити',
                },
                {
                    url: `/requestFulfill/${this.serialCode}`,
                    text: `Запит номер ${this.serialCode}`,
                },
            ];
        },
    },
    methods: {
        denyReq() {
            this.$store.dispatch(
                'issuedDocs/denyReq',
                {
                    serialCode: this.serialCode,
                    status: 'DENIED',
                    comment: this.comment,
                },
            );
            this.$router.push({name: 'Registrator'});
        },
        addFiles(files: FileList) {
            // eslint-disable-next-line no-restricted-syntax
            for (const file of files) {
                if (!this.files.find(({name}) => file.name === name)) {
                    this.files.push(file);
                }
            }
        },
        handleSubmit() {
            const formData = new FormData();
            this.files.forEach((file) => formData.append('file', file));
            fetch('http://localhost:3000/issued-docs/response', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${this.$store.getters['auth/userToken']}`,
                },
            }).then((res) => {
                console.log(res.json());
            });
        },
        handleComment(valueSchema: Record<string, string>): void {
            if (valueSchema) {
                this.comment = valueSchema.comment;
            }
        },
    },
    created() {
        if (!this.issuedDocument) {
            this.$store.dispatch(
                'issuedDocs/fetchBySerialCode',
                {
                    authToken: this.$store.getters['auth/userToken'],
                    serialCode: this.serialCode,
                },
            );
        }
    },
});

</script>

<style scoped lang="scss">
::v-deep .files-form-group {
    margin-top : 30px;
}

.cards-wrapper {
    position        : relative;
    display         : flex;
    justify-content : space-between;
    margin-top      : 20px;

    .issued-document-card {
        display     : flex;
        flex-wrap   : wrap;
        align-items : stretch;

        span, strong {
            display       : block;
            flex          : 0 0 50%;
            margin-bottom : 15px;
        }

        div {
            flex           : 0 0 100%;
            display        : flex;
            flex-direction : column;

            > * {
                margin-top : 15px;
            }
        }

        .block {
            margin-top  : 20px;
            font-weight : 600;
            font-size   : 22px;
        }

        strong {
            font-weight : 600;
        }
    }

    .buttons-card {
        flex           : 0 0 20%;
        display        : flex;
        flex-direction : column;
        margin-left    : 20px;
        padding        : 20px 10px;

        .button {
            width         : 100%;
            margin-bottom : 20px;
            margin-top    : 20px;
        }
    }
}

</style>
