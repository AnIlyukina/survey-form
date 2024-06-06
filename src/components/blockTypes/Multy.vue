<script setup>
import {toRefs} from "vue";
import {getComponent} from "../../utils/getComponent.js";

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
const component = (type) => getComponent(type)
</script>

<template>
	<div :id="data.id" class="nn-invest-multi">
		<label class="nn-invest-form__label">
			{{ index }}. <span v-html="data.title"></span><span v-if="data.required" class="nn-invest-form__required"/>
		</label>
		<p v-if="data.comments" v-html="data.comments" class="nn-invest-form__addition"></p>
		<div v-for="(field) in data.items" :key="field.id" class="nn-invest-multi__item">
			<component
				v-if="component(field.type)"
				:is="component(field.type)"
				:data="field"
				:formData="formData"
				:validationError="validationError"
			/>
			<div v-else>Нет поля с типом {{field.type}}</div>
		</div>
	</div>
</template>

<style scoped>
.nn-invest-multi__item {
	margin-top: 25px;
}
</style>