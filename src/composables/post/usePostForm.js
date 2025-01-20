import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useTeams } from '@/composables/team/useTeams.js';
import { usePost } from '@/composables/post/usePost';
import {useAuthStore} from "@/stores/authStore.js";
import {teamService} from "@/services/teamService.js";

export const usePostForm = (props, emit) => {
    const { teams, fetchTeams, fetchUserTeams } = useTeams();
    const { post, fetchPost, createPost, updatePost } = usePost();

    const isEditing = computed(() => !!props.postId);
    const modalTitle = computed(() => isEditing.value ? 'Edytuj Ogłoszenie' : 'Dodaj Ogłoszenie');
    const isSaving = ref(false);
    const authStore = useAuthStore()
    const userRole = computed(() => authStore.userRole);
    const userId = computed(() => authStore.userId);

    const initialValues = computed(() => ({
        postTitle: '',
        postContent: '',
        ...(!isEditing.value && { teams: [] })
    }));

    const validationSchema = computed(() => {
        const baseSchema = {
            postTitle: yup.string()
                .required('Tytuł jest wymagany')
                .min(3, 'Tytuł musi mieć co najmniej 3 znaki')
                .max(100, 'Tytuł nie może przekraczać 100 znaków'),
            postContent: yup.string()
                .required('Treść jest wymagana')
                .min(10, 'Treść musi mieć co najmniej 10 znaków')
                .max(1000, 'Treść nie może przekraczać 1000 znaków')
        };

        if (!isEditing.value) {
            baseSchema.teams = yup.array()
                .required('Wybierz co najmniej jeden zespół')
                .min(1, 'Wybierz co najmniej jeden zespół');
        }

        return yup.object(baseSchema);
    });

    const { handleSubmit, errors, defineField, resetForm } = useForm({
        validationSchema: validationSchema,
        validateOnMount: false,
        initialValues: initialValues
    });

    const [postTitle, postTitleProps] = defineField('postTitle');
    const [postContent, postContentProps] = defineField('postContent');
    const [selectedTeams, selectedTeamsProps] = !isEditing.value ? defineField('teams') : [ref([]), {}];

    const loadData = async () => {
        if (!isEditing.value) {
            if (userRole.value === 'ROLE_LECTURER') await fetchUserTeams(userId.value);
            else await fetchTeams();
        } else if (props.postId) {
            const postData = await fetchPost(props.postId);
            if (postData) {
                postTitle.value = postData.postTitle;
                postContent.value = postData.postContent;
                if (!isEditing.value && postData.teams) {
                    selectedTeams.value = postData.teams.map(team => team.teamId);
                }
            }
        }
    };

    const onSubmit = handleSubmit(async (values) => {
        isSaving.value = true;
        try {
            if (isEditing.value) {
                const updateData = {
                    postTitle: values.postTitle,
                    postContent: values.postContent
                };
                await updatePost(props.postId, updateData);
            } else {
                console.log('Selected teams:', values);
                await createPost({
                    postTitle: values.postTitle,
                    postContent: values.postContent,
                    teams: values.teams
                });
            }
            emit('saved');
            emit('close');
        } finally {
            isSaving.value = false;
        }
    });

    const closeModal = () => {
        resetForm();
        emit('close');
    };



    return {
        teams,
        isEditing,
        modalTitle,
        isSaving,
        errors,
        postTitle,
        postTitleProps,
        postContent,
        postContentProps,
        selectedTeams,
        selectedTeamsProps,
        loadData,
        onSubmit,
        closeModal
    };
};