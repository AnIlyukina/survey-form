import { api, handleApiError} from "./index.js";

const getSurveyId = () => {
    const query = new URLSearchParams(window.location.search);
    return query.get('id');
};

export const getSurveyData = async () => {
    const id = getSurveyId();
    try {
        const response = await api.get(`/ajax/vote.php?id=${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const saveSurveyData = async (data) => {
    const id = getSurveyId();
    try {
        const response = await api.post(`/ajax/vote.php?id=${id}`, data)
        return response.data;
    } catch (error) {
        handleApiError(error)
    }


}