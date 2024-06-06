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

const inputValue = ref(formData.value[data.value.id] || null)

watch(inputValue, (newValue) => {
	formData.value[data.value.id] = newValue;
}, {immediate: true});


const isValidateError = computed(() => validationError.value.isShow && validationError.value.errors[data.value.id])

</script>

<template>
	<div class="nn-invest-input">
		<label :for="data.id" class="nn-invest-form__label">
			{{ index ? `${index}.` : '' }} <span v-html="data.title"></span><span v-if="data.required" class="nn-invest-form__required"/>
		</label>
		<p v-if="data.comments" v-html="data.comments" class="nn-invest-form__addition"></p>
		<input
			v-model="inputValue"
			:id="data.id"
			:name="data.id"
			:type="data.type === 'TEXT' || data.type === 'EMAIL' || data.type === 'PHONE' ? 'text' : 'number'"
			:class="['nn-invest-input__input', isValidateError ? 'error' : '']"
			:placeholder="data.placeholder"
		/>
		<div class="nn-invest-form__input-error">
			<span v-if="validationError.isShow">
				{{ validationError.errors[data.id] || '' }}
			</span>
		</div>
	</div>
</template>

<style scoped>
.nn-invest-input__input {
	font-size: 14px;
	margin-top: 12px;
	width: 100%;
	padding: 14px;
	border: 1px solid #FFF;
	border-radius: 8px;
	background-color: #FFF;
	outline: none;
	box-sizing: border-box;
	font-family: Geometria, sans-serif;
}

.nn-invest-input__input::placeholder {
	font-family: Geometria, sans-serif;
	color: #ABABAB;
}

.nn-invest-input__input.error {
	border: 1px solid #E72828;
}
</style>