import {computed, ref} from 'vue';
import {useToast} from 'vue-toastification';
import postService from '@/services/postService';
import {userService} from "@/services/userService.js";
import {useAuthStore} from "@/stores/authStore.js";
import {usePermissions} from "@/composables/usePermissions.js";

export function usePost() {
    const post = ref(null);
    const posts = ref([]);
    const isLoading = ref(false);
    const isAuthorized = ref(false);
    const isEmpty = ref(false);
    const toast = useToast();
    const authStore = useAuthStore()
    const userId = computed(() => authStore.userId)
    const {getUserPosts} = userService
    const { canView } = usePermissions();

    const fetchPosts = async () => {
        if (!userId.value || !canView()) {
            console.error('User is not logged in')
            return
        }
        isLoading.value = true;
        try {
            const response = await getUserPosts(userId.value);
            posts.value = response.data;
            isAuthorized.value = true;
            isEmpty.value = response.data.length === 0;
            if (isEmpty.value) toast.info('Brak ogłoszeń');
        } catch (error) {
            console.error('Error fetching posts', error);
            handlePostError(error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchPost = async (postId) => {
        isLoading.value = true;
        try {
            const response = await postService.getPost(postId);
            post.value = response.data;
            return response.data;
        } catch (error) {
            toast.error('Błąd podczas pobierania ogłoszenia');
            console.error('Error fetching post', error);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const createPost = async (postData) => {
        try {
            const response = await postService.createPost(postData);
            toast.success('Ogłoszenie utworzone pomyślnie');
            return response.data;
        } catch (error) {
            toast.error('Błąd podczas tworzenia ogłoszenia');
            console.error('Error creating post', error);
            return null;
        }
    };

    const updatePost = async (postId, postData) => {
        try {
            const response = await postService.updatePost(postId, postData);
            toast.success('Ogłoszenie zaktualizowane pomyślnie');
            return response.data;
        } catch (error) {
            toast.error('Błąd podczas aktualizacji ogłoszenia');
            console.error('Error updating post', error);
            return null;
        }
    };

    const deletePost = async (postId) => {
        try {
            await postService.deletePost(postId);
            toast.success('Ogłoszenie usunięte pomyślnie');
            return true;
        } catch (error) {
            toast.error('Błąd podczas usuwania ogłoszenia');
            console.error('Error deleting post', error);
            return false;
        }
    };

    const handlePostError = (error) => {
        if (error.response?.status === 401) {
            isAuthorized.value = false;
            console.error('User is not logged in');
        } else if (error.response?.status === 404) {
            isEmpty.value = true;
            isAuthorized.value = true;
        } else {
            console.error('Error:', error);
        }
    };

    return {
        post,
        posts,
        isLoading,
        isAuthorized,
        isEmpty,
        fetchPosts,
        fetchPost,
        createPost,
        updatePost,
        deletePost
    };
}