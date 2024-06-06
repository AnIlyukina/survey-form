<script setup>
import {ref, toRefs, watch} from "vue";

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
	index: Number,
})

const {data, formData, index, validationError} = toRefs(props);
const selected = ref(formData.value[data.value.id] || null)

watch(selected, (newValue) => {
	formData.value[data.value.id] = newValue;
}, {immediate: true});

const setValue = (item) => {
	selected.value = item;
}
</script>

<template>
	<div :id="data.id" class="nn-invest-grade">
		<label class="nn-invest-form__label">
			{{ index ? `${index}.` : '' }} <span v-html="data.title"></span><span v-if="data.required" class="nn-invest-form__required"/>
		</label>
		<p v-if="data.comments" v-html="data.comments" class="nn-invest-form__addition"></p>
		<div class="nn-invest-grade__buttons-block">
			<button
				v-for="item in data.answers"
				:class="[item.id === selected ? 'selected' : '', 'nn-invest-grade__button']"
				@click.prevent="setValue(item.id)"
			>
				{{ item.text }}
			</button>
		</div>
		<div class="nn-invest-form__input-error">
			<span v-if="validationError.isShow">
				{{ validationError.errors[data.id] || '' }}
			</span>
		</div>
	</div>
</template>

<style scoped>
.nn-invest-grade__buttons-block {
	margin-top: 24px;
	display: flex;
	gap: 10px;
}

.nn-invest-grade__button {
	cursor: pointer;
	font-weight: 500;
	border-radius: 8px;
	border: none;
	width: 43px;
	font-size: 14px;
	font-family: Geometria-Medium, sans-serif;
	height: 43px;
	background-color: white;
	color: #282F39;
	transition: background-color 0.3s ease, color 0.3s ease;
}

.nn-invest-grade__button.selected {
	color: white;
	background-color: var(--main-form-color);
}
</style>