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
	return getVisibleFields(state.fieldsByStep[state.currentStep] ?? [], state.formData);
});


const getVisibleFields = (fields, formData) => {
	const visibilityMap = new Map();
	const childrenMap = new Map();

	fields.forEach(item => {
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

	const evaluateVisibility = (id, isVisible) => {
		visibilityMap.set(id, isVisible);
		if (childrenMap.has(id)) {
			childrenMap.get(id).forEach(childId => evaluateVisibility(childId, isVisible));
		}
	};

	fields.forEach(item => {
		if (item.conditions) {
			const conditionGroups = item.conditions.reduce((groups, condition, index) => {
				const groupIndex = groups.length - 1;
				if (index === 0 || condition.logic === 'or') {
					groups.push([condition]);
				} else {
					groups[groupIndex].push(condition);
				}
				return groups;
			}, []);

			const isCompleted = conditionGroups.some(group => {
				return group.every(condition => {
					const valueToCheck = formData[condition.id];
					if (Array.isArray(valueToCheck)) {
						return condition.condition === "=="
							? valueToCheck.includes(condition.value)
							: !valueToCheck.includes(condition.value);
					} else {
						return condition.condition === "=="
							? valueToCheck === condition.value
							: valueToCheck !== condition.value;
					}
				});
			});

			if (!isCompleted) {
				evaluateVisibility(item.id, false);
			}
		}
	});

	return fields.filter(item => visibilityMap.get(item.id));
};

const isLastStep = computed(() => {
	// Общее количество шагов
	let steps = Object.keys(state.fieldsByStep).reverse()[0]

	// Если текущий меньше общего, то проверяем наличие заполняемых полей
	if (state.currentStep < steps) {
		let fields = getVisibleFields(state.fieldsByStep[state.currentStep + 1] ?? [], state.formData);
		return fields.length === 0
	}
	return true
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