import api from '@/config/axiosConfig.js'
import { useAuthStore } from '@/stores/authStore.js';




export async function fetchGrades(){
    try {
        const authStore = useAuthStore();
        const role = authStore.userRole;
        const response = role === "ROLE_STUDENT" ? await api.get(`/grade/user/${authStore.userId}`) : await api.get(`/grade/creator/${authStore.userId}`);
        if (!response) {
            return [];
        }
        return response.data.map((gradeDto) => ({
            gradeId: gradeDto.gradeId,
            subjectName: gradeDto.subjectName,
            grade: gradeDto.grade,
            comment: gradeDto.comment,
            dateOfReceipt: new Date(gradeDto.dateOfReceipt)
        }));
    } catch (error) {
        console.error("Error fetching grades:", error);
        throw error;
    }
}

export async function addGrade(gradeData){
    try {
        const authStore = useAuthStore();
        const response = await api.post("/grade", {
            subjectName: gradeData.subjectName,
            grade: gradeData.grade,
            comment: gradeData.comment,
            userId: gradeData.userId,
            creatorId: authStore.userId
        });

        return {
            ...gradeData,
            dateOfReceipt: new Date(response.data.dateOfReceipt)
        };
    } catch (error) {
        console.error("Error adding grade:", error);
        throw error;
    }
}

export async function updateGrade(gradeData){
    try {
        const response = await api.patch(`/grade/${gradeData.gradeId}`, gradeData);
        return {
            ...gradeData,
            dateOfReceipt: new Date(response.data.dateOfReceipt)
        };
    } catch (error) {
        console.error("Error updating grade:", error);
        throw error;
    }
}

export async function deleteGrade(gradeId){
    try {
        await api.delete(`/grade/${gradeId}`);
    } catch (error) {
        console.error("Error deleting grade:", error);
        throw error;
    }
}

