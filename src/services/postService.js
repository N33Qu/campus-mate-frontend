import api from '@/config/axiosConfig';

class PostService {

    async getPost(postId) {
        return api.get(`/post/${postId}`);
    }

    async createPost(postData) {
        return api.post('/post', postData);
    }

    async updatePost(postId, postData) {
        return api.patch(`/post/${postId}`, postData);
    }

    async deletePost(postId) {
        return api.delete(`/post/${postId}`);
    }
}

export default new PostService();