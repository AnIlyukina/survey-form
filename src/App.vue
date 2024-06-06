<script setup>
import {computed, onMounted, ref} from "vue";
import FormSurvey from "./components/FormSurvey.vue";
import FormSubmissionStatus from "./components/FormSubmissionStatus.vue";
import {getSurveyData, saveSurveyData} from './api/survey.js';

const  isSendRequestSuccess = ref(false)
let surveyData = ref(null);

const loadSurveyData = async () => {
	try {
		surveyData.value = await getSurveyData();
	} catch (error) {
		console.error('Error loading survey data:', error);
	}
};

const submitSurvey = async (data) => {
	try {
		await saveSurveyData(data);
		isSendRequestSuccess.value = true
	} catch (error) {
		console.error('Error sending survey data:', error);
	}
}

const getThemeClass = computed(() => {
	const groupTypeToClass = {
		'GROUP_A': 'group__a',
		'GROUP_B': 'group__b',
		'GROUP_C': 'group__c',
		'GROUP_D': 'group__d',
	};

	return groupTypeToClass[surveyData.value?.groupCode] || 'group__a';
});

onMounted(loadSurveyData);

</script>

<template>
	<div class="nn-invest-survey" :class="getThemeClass">
		<FormSurvey
			v-if="!isSendRequestSuccess && surveyData"
			:surveyData="surveyData"
			@sendData="submitSurvey"
		/>
		<FormSubmissionStatus
			v-if="isSendRequestSuccess"
			title="Ваша форма отправлена"
			subtitle="Спасибо за Ваши ответы!"
			iconName="success"
		/>
	</div>
</template>
