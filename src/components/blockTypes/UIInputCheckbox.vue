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
	index: Number,
})

const {data, formData, validationError} = toRefs(props);

const type = computed(() => data.value.type === 'CHECKBOX' ? 'checkbox' : 'radio');

const inputValue = ref(formData.value[data.value.id] || [])

watch(inputValue, (newValue) => {
	formData.value[data.value.id] = newValue;
}, {immediate: true});

</script>

<template>
	<div class="nn-invest-radio">
		<label class="nn-invest-form__label">
			{{ index ? `${index}.` : '' }} <span v-html="data.title"></span><span v-if="data.required" class="nn-invest-form__required"/>
		</label>
		<p v-if="data.comments" v-html="data.comments" class="nn-invest-form__addition"></p>
		<div class="nn-invest-options__block">
			<div v-for="(option, index) in data.answers" :class="`nn-invest-${type}__${type}`">
				<input
					v-model="inputValue"
					:id="`${data.id}-${index}`"
					:name="data.id"
					:type="type"
					:value="option.id"
					class="nn-invest-options__input"
				>
				<span></span>
				<label :for="`${data.id}-${index}`" class="nn-invest-options__label" v-html="option.text"></label>
			</div>
		</div>
		<div class="nn-invest-form__input-error">
			<span v-if="validationError.isShow">
				{{ validationError.errors[data.id] || '' }}
			</span>
		</div>
	</div>
</template>

<style scoped>
.nn-invest-options__block {
	margin: 20px 0 15px 0;
}

.nn-invest-options__input {
	position: absolute;
	opacity: 0;
}

.nn-invest-options__label {
	display: block;
	position: relative;
	padding-left: 35px;
	cursor: pointer;
	user-select: none;
	color: rgb(45, 53, 66);
	font-size: 14px;
	line-height: 150%;
	font-family: Geometria, sans-serif;
	letter-spacing: -0.6px;
}

.nn-invest-radio__radio,
.nn-invest-checkbox__checkbox {
	display: flex;
	gap: 20px;
	position: relative;
}

.nn-invest-radio__radio + .nn-invest-radio__radio,
.nn-invest-checkbox__checkbox + .nn-invest-checkbox__checkbox {
	margin-top: 24px;
}

.nn-invest-radio__radio span {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 0;
	height: 20px;
	width: 20px;
	border: 1px solid #DFDDE6;
	background-color: white;
	border-radius: 50%;
}

.nn-invest-radio__radio input:checked ~ span {
	height: 11px;
	width: 11px;
	border: 6px solid var(--main-form-color);
}

.nn-invest-checkbox__checkbox span {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 0;
	height: 20px;
	width: 20px;
	border: 1px solid #DFDDE6;
	background-color: white;
	border-radius: 4px;
}

.nn-invest-checkbox__checkbox input:checked ~ span {
	background-image: url("../../assets/icon-checked.svg");
	background-repeat: no-repeat;
	background-size: 70%;
	background-position: center;
	border: 1px solid var(--main-form-color);
	background-color: var(--main-form-color);
}
</style>