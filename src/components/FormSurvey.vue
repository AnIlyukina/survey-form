<script setup>
import {computed, onBeforeUnmount, onMounted, reactive, ref, toRefs} from "vue";
import FieldsByStep from "./FieldsByStep.vue";
import FormTitles from "./FormTitles.vue";
import UIButton from "./blockTypes/UIButton.vue";

import { checkValidByType } from "../utils/validation.js";
import { encryptWithAES } from '../utils/encryption.js';
import { formatDateToDDMMYYYY } from '../utils/helpers.js';
import { initializeRecaptcha, renderRecaptcha } from '../utils/recaptcha.js';

const props = defineProps({
	surveyData: {
		type: Object,
		required: true,
	}
})

const emit = defineEmits(['sendData'])

const {surveyData} = toRefs(props);
let numberOfPreviousSteps = ref(0);
let requestData = reactive({});
let captchaError = ref('');
let widgetId;


const state = reactive({
	groupType: surveyData.value.groupType,
	groupName: surveyData.value.groupName,
	title: surveyData.value.title,
	fieldsByStep: {},
	currentStep: 1,
	formData: {},
	validationError: {
		isShow: false,
		errors: {}
	},
});

const setInitialData = () => {
	state.fieldsByStep = getFieldsByStep(surveyData.value.questions);
}

const getFieldsByStep = (items) => {
	return items.reduce((accumulator, currentValue) => {
		const step = currentValue.step;
		if (!accumulator[step]) {
			accumulator[step] = [];
		}
		accumulator[step].push(currentValue);
		return accumulator;
	}, {});
}

const currentFields = computed(() => {
	const result = state.fieldsByStep[state.currentStep] ?? [];
	const visibilityMap = new Map();
	const childrenMap = new Map();
	// Создание иерархии зависимостей
	result.forEach(item => {
		if (item.condition) {
			item.condition.forEach(condition => {
				if (!childrenMap.has(condition.id)) {
					childrenMap.set(condition.id, []);
				}
				childrenMap.get(condition.id).push(item.id);
			});
		}
		visibilityMap.set(item.id, true);
	});


	// Оценка условий видимости
	const evaluateVisibility = (id, isVisible) => {
		visibilityMap.set(id, isVisible);
		if (childrenMap.has(id)) {
			childrenMap.get(id).forEach(childId => evaluateVisibility(childId, isVisible));
		}
	};
	result.forEach(item => {
		if (item.conditions) {

			// сгруппировать условия (все последовательные условия и в один массив)
			let conditionGroups = {};
			let indexGroup = 1
			item.conditions.forEach((item, index) => {
				if (index === 0) {
					conditionGroups[indexGroup] = [item]
				} else {
					if (item.logic === 'and') {
						conditionGroups[indexGroup].push(item)
					} else {
						indexGroup += 1
						conditionGroups[indexGroup] = [item]
					}
				}
			})

			let isCompleted = false;

			let groups = Object.values(conditionGroups)
			for (let i = 0; i < groups.length; i++) {
				if (isCompleted) break
				isCompleted = groups[i].every(group => {
					const valueToCheck = state.formData[group.id];
					if (Array.isArray(valueToCheck)) {
						if (group.condition === "==") {
							return valueToCheck.includes(group.value)
						} else {
							return !valueToCheck.includes(group.value)
						}
					} else {
						if (group.condition === "==") {
							return valueToCheck && group.value === valueToCheck
						} else {
							return valueToCheck && group.value !== valueToCheck
						}
					}
				})
			}

			if (!isCompleted) {
				evaluateVisibility(item.id, false);
			}
		}
	});

	// Фильтрация элементов
	return result.filter(item => visibilityMap.get(item.id));
});


const isLastStep = computed(() => {
	let steps = Object.keys(state.fieldsByStep)
	return state.currentStep === Number(steps[steps.length - 1])
})

const checkValidForm = () => {
	state.validationError.errors = {}
	// прохожу по всем видимым полям

	let fieldForCheck = []
	currentFields.value.forEach(item => {
		if (item.type === 'MULTY') {
			item.items.forEach(item2 => fieldForCheck.push(item2))
		} else {
			fieldForCheck.push(item)
		}
	})

	fieldForCheck.forEach(item => {
		// если поле с таким id есть в массиве ошибок пропускаем ошибку
		if (item.required) {
			if (!state.validationError.errors[item.id]) {
				// если нет смотрим в списке заполненых полей
				let checkedValue = state.formData[item.id]

				if (typeof checkedValue === 'string') {
					checkedValue = checkedValue.trim()
				}

				if (!checkedValue) {
					state.validationError.errors[item.id] = "Это поле обязательно"
				} else {
					const typeVariable = typeof state.formData[item.id]
					if (Array.isArray(state.formData[item.id]) && state.formData[item.id].length === 0) {
						state.validationError.errors[item.id] = "Это поле обязательно"
					} else if (!Array.isArray(state.formData[item.id]) && typeVariable === 'object' && isNaN(state.formData[item.id]?.getTime())) {
						state.validationError.errors[item.id] = "Это поле обязательно"
					} else {
						let validationType = item.type
						if (validationType) {
							let error = checkValidByType(validationType, state.formData[item.id])

							if (error) {
								state.validationError.errors[item.id] = error
							} else {
								delete state.validationError.errors[item.id]
							}
						}
					}
				}
			}
		}
	})
	return Object.keys(state.validationError.errors).length === 0
}

const sendRequest = () => {
	if (grecaptcha.getResponse(widgetId)) {
		captchaError.value = ""
		emit('sendData', {
			...requestData,
			m: encryptWithAES(window.mouseCoordinates, surveyData.value.sessid),
			t: encryptWithAES(window.touchCoordinates, surveyData.value.sessid),
			c: encryptWithAES(window.clickCoordinates, surveyData.value.sessid),
			k: encryptWithAES(window.keyPresses, surveyData.value.sessid),
			id: surveyData.value.id,
			sessid: surveyData.value.sessid,
			['g-recaptcha-response']: grecaptcha.getResponse(widgetId)
		})
	} else {
		captchaError.value = "Это поле не заполнено"
	}
}

// Функция для сохранения текущего состояния
const saveCurrentState = () => {
	// сохраняем выбранные данные
	let fieldForCheck = []
	currentFields.value.forEach(item => {
		if (item.type === 'MULTY') {
			item.items.forEach(item2 => fieldForCheck.push(item2))
		} else {
			fieldForCheck.push(item)
		}
	})

	fieldForCheck.forEach(field => {
		if (field.type === 'DATE') {
			requestData[field.id] = formatDateToDDMMYYYY(state.formData[field.id])
		} else {
			requestData[field.id] = state.formData[field.id]
		}
	})
}

const scrollToError = () => {
	const errorId = Object.keys(state.validationError.errors)[0]
	let errorElement = document.querySelector(`#${errorId}`)
	//console.log(errorElement, 'errorElement')
	if (errorElement) {
		errorElement.scrollIntoView({block: "center", behavior: "smooth"})
	}
}

// Функция для переключения состояния показа ошибки валидации
const toggleValidationError = (isValid) => {
	state.validationError.isShow =!isValid;
};

// Функция для обновления количества предыдущих шагов
const updateNumberOfPreviousSteps = (step) => {
	if (step === 'forward') {
		numberOfPreviousSteps.value += state.fieldsByStep[state.currentStep].length;
	} else {
		numberOfPreviousSteps.value -= state.fieldsByStep[state.currentStep - 1].length
	}
};

const updateCurrentStep = (step) => {
	if (step === 'forward') {
		state.currentStep += 1;
	} else {
		state.currentStep -= 1;
	}
};

const updateStepAndValidate = (step) => {
	// Проверяем валидность формы
	const isValid = checkValidForm();

	// Обновляем состояние ошибки валидации
	toggleValidationError(isValid);

	if (isValid) {
		saveCurrentState()

		// Если это не последний шаг, обновляем количество предыдущих шагов и переходим к следующему шагу
		if (!isLastStep.value) {
			updateNumberOfPreviousSteps(step)
			updateCurrentStep(step)
		} else {
			sendRequest()
		}
	} else {
		scrollToError()
	}

	// if (!isLastStep.value) {
	// 	state.currentStep += 1;
	// } else if (isLastStep.value) {
	// 	sendRequest()
	// }
};

const changeCurrentStep = (step) => {
	if (step === 'forward') {
		updateStepAndValidate(step)
	} else {
		if (state.currentStep === 1) {
			window.location.href = window.location.origin + '/surveys' ;
		} else {
			updateNumberOfPreviousSteps(step)
			updateCurrentStep(step)
		}
	}
}

onMounted(() => {
	initializeRecaptcha(() => renderRecaptcha(window.captchaKey, id => widgetId = id));
	setInitialData()
});

onBeforeUnmount(() => {
	window.removeEventListener('grecaptchaLoaded', renderRecaptcha);
});

</script>

<template>
	<FormTitles
		:groupType="state.groupType"
		:groupName="state.groupName"
		:title="state.title"
	/>
	<div class="nn-invest-form">
		<form>
			<FieldsByStep
				:fields="currentFields"
				:numberOfPreviousSteps="numberOfPreviousSteps"
				:formData="state.formData"
				:validationError="state.validationError"
				@change-current-step="changeCurrentStep"
			/>

			<div v-show="isLastStep" class="nn-invest-form__captcha-block">
				<div id="nn-invest-form__captcha"></div>
				<div v-show="captchaError" class="nn-invest-form__input-error">{{ captchaError }}</div>
			</div>
			<div class="nn-invest-form__buttons-block">
				<UIButton
					name="Вернуться назад"
					type="inverted"
					@click.prevent="changeCurrentStep('back')"
				/>
				<UIButton
					:name="isLastStep ? 'Отправить' : 'Далее'"
					@click.prevent="changeCurrentStep('forward')"
				/>
			</div>
		</form>
	</div>
</template>

<style scoped>

.nn-invest-form {
	max-width: 620px;
	width: 100%;
	box-sizing: border-box;
	position: relative;
}

.nn-invest-form__buttons-block {
	display: flex;
	gap: 20px;
	margin-top: 40px;
}

.nn-invest-form__captcha-block {
	margin-top: 10px;
}

.nn-invest-form__buttons-block button {
	max-width: 211px;
}

@media screen and (max-width: 1024px) {
	.nn-invest-form__buttons-block {
		margin-top: 20px;
	}
}

@media screen and (max-width: 425px) {
	.nn-invest-form__buttons-block {
		gap: 10px;
	}
}
</style>