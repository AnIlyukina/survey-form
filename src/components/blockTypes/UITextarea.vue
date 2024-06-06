<script setup>

import {computed, ref, toRefs, watch} from "vue";

const props = defineProps({
	data: {
		type: Object,
		required: true,
	},
	formData: {
		type: Object,
		required: true,
	},
	validationError: {
		type: Object,
		required: true
	},
	index: Number
})

const {data, formData, validationError} = toRefs(props);

const inputValue = ref(formData.value[data.value.id] || '')

watch(inputValue, (newValue) => {
	formData.value[data.value.id] = newValue;
}, { immediate: true });

const isValidateError = computed(() => validationError.value.isShow && validationError.value.errors[data.value.id])

</script>

<template>
	<label :for="data.id" class="nn-invest-form__label">
		{{ index ? `${index}.` : '' }} <span v-html="data.title"></span><span v-if="data.required" class="nn-invest-form__required"/>
	</label>
	<p v-if="data.comments" v-html="data.comments" class="nn-invest-form__addition"></p>
	<textarea
		v-model="inputValue"
		:id="data.id"
		:name="data.id"
		:placeholder="data.placeholder"
		:class="['nn-invest-textarea__textarea', isValidateError ? 'error' : '']"
		rows="5"
		cols="33"
	></textarea>
	<div class="nn-invest-form__input-error">
			<span v-if="validationError.isShow">
				{{ validationError.errors[data.id] || '' }}
			</span>
	</div>
</template>

<style scoped>

.nn-invest-textarea__textarea {
	box-sizing: border-box;
	width: 100%;
	margin-top: 24px;
	background-color: #FFF;
	border: 1px solid #FFF;
	border-radius: 8px;
	padding: 14px;
	outline: none;
	font-family: 'Geometria', sans-serif;
	font-size: 14px;
}

/* Для современных браузеров */
.nn-invest-textarea__textarea::placeholder {
	font-family: 'Geometria', sans-serif;
	color: #ABABAB;
}

/* Для WebKit и Edge */
.nn-invest-textarea__textarea::-webkit-input-placeholder {
	font-family:  'Geometria', sans-serif;
	color: #ABABAB;
}

/* Для Firefox 4-18 */
.nn-invest-textarea__textarea:-moz-placeholder {
	font-family: 'Geometria', sans-serif;
	color: #ABABAB;
}

/* Для Firefox 19+ */
.nn-invest-textarea__textarea::-moz-placeholder {
	font-family: 'Geometria', sans-serif;
}

/* Для IE 10-11 */
.nn-invest-textarea__textarea:-ms-input-placeholder {
	font-family: 'Geometria', sans-serif;
	color: #ABABAB;
}

/* Для Edge */
.nn-invest-textarea__textarea::-ms-input-placeholder {
	font-family: 'Geometria', sans-serif;
	color: #ABABAB;
}

.nn-invest-textarea__textarea.error {
	border: 1px solid #E72828;
}
</style>