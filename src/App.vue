<script setup>
import FormSurvey from "./components/FormSurvey.vue";
import FormSubmissionStatus from "./components/FormSubmissionStatus.vue";
import {computed, onMounted, ref} from "vue";

const  isSendRequestSuccess = ref(false)

let surveyData = ref(null);
const getSurveyData = async () => {
	const id = getSurveyId();
	try {
		const response = await fetch(window.location.origin + '/ajax/vote.php?id=' + id);
		//const response = await fetch('https://anna.nn-invest.tz365.ru' + '/ajax/vote.php?id=' + 29);
		if (!response.ok) {
			throw new Error('Failed to fetch poll data');
		}
		surveyData.value = await response.json()
	} catch (error) {
		console.error("Error loading poll data:", error);
	}

	// try {
	// 	const response = await fetch('./src/questions.json');
	// 	if (!response.ok) {
	// 		throw new Error('Failed to fetch poll data');
	// 	}
	// 	surveyData.value = await response.json()
	// } catch (error) {
	// 	console.error("Error loading poll data:", error);
	// }
}

const sendData = async (data) => {
	const id = getSurveyId();
	try {
		const response = await fetch(window.location.origin + '/ajax/vote.php?id=' + id, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error('Failed to fetch poll data');
		}

		isSendRequestSuccess.value = true
	} catch (error) {
		console.error("Error loading poll data:", error);
	}
}

const getSurveyId = () => {
	const query = new URLSearchParams(window.location.search);
	return query.get('id');
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

onMounted(getSurveyData);

window.grecaptchaLoaded = function() {
	console.log('grecaptchaLoaded')
	window.dispatchEvent(new Event('grecaptchaLoaded'));
};
</script>

<template>
	<div class="nn-invest-survey" :class="getThemeClass">
		<FormSurvey
			v-if="!isSendRequestSuccess && surveyData"
			:surveyData="surveyData"
			@sendData="sendData"
		/>
		<FormSubmissionStatus
			v-if="isSendRequestSuccess"
			title="Ваша форма отправлена"
			subtitle="Спасибо за Ваши ответы!"
			iconName="success"
		/>
	</div>
</template>
