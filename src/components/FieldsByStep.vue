<script setup>
import {toRefs} from "vue";
import {getComponent} from "../utils/getComponent.js";

const props = defineProps({
	fields: Array,
	formData: Object,
	validationError: Object,
	numberOfPreviousSteps: Number,
})

const {fields, formData, numberOfPreviousSteps, validationError} = toRefs(props);


const component = (type) => getComponent(type)

let counter = 0
const getIndex = (field, index) => {
	if (index === 0) {
		counter = 0
	}
	if (field.type !== 'INFO') {
		counter += 1
		return counter + numberOfPreviousSteps.value
	}
}

</script>

<template>
	<div class="nn-invest-form__fields">
		<div v-for="(field, index) in fields" :key="field.id" class="nn-invest-form__form-item">
			<component
				v-if="component(field.type)"
				:is="component(field.type)"
				:index="getIndex(field, index)"
				:data="field"
				:formData="formData"
				:validationError="validationError"
			/>
			<div v-else>Нет поля с типом {{field.type}}</div>
		</div>
	</div>
</template>

<style scoped>
.nn-invest-form__fields {
	margin-top: 40px;
}

.nn-invest-form__form-item + .nn-invest-form__form-item {
	margin-top: 10px;
}

@media screen and (max-width: 1024px) {

	.nn-invest-form__fields {
		margin-top: 30px;
	}

	.nn-invest-form__form-item + .nn-invest-form__form-item {
		margin-top: 5px;
	}
}
</style>