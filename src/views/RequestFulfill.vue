<template>
    <TemplateRoot>
        <div>
            {{ id }}
        </div>
    </TemplateRoot>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import TemplateRoot from '@/components/common/template-root.vue';
import Breadcrumbs from '@/components/common/breadcrumbs.vue';
import {BreadcrumbLink} from '@/interfaces/breadcrumbs-link';
import FormGroup from '@/components/block/form-group.vue';
import TextInput from '@/components/forms/text-input.vue';
import FilesInput from '@/components/forms/files-input.vue';
import Btn from '@/components/block/btn.vue';

export default defineComponent({
    name: 'ProfileView',
    components: {
        // FilesInput,
        // TextInput,
        // FormGroup,
        // Breadcrumbs,
        TemplateRoot,
        // Btn,
    },
    props: {
        id: {
            required: false,
            type: Number,
        },
    },
});

</script>

<style scoped lang="scss">
.text-form-group {
    margin-top : 20px;
}

.file-form-group {
    margin-top : 50px;
}

.button {
    width     : 100%;
    max-width : 300px;
    margin    : 40px auto;
}

</style>
