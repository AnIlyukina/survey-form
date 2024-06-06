<script setup>
import {toRefs} from "vue";

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		default: '' // Указываем тип кнопки по умолчанию
	},
	disabled: Boolean,
})

const {name, type, disabled} = toRefs(props);

</script>

<template>
	<button :class="['nn-invest-button', type]" :disabled="disabled">
		{{ name }}
	</button>
</template>

<style scoped>

.nn-invest-button {
	width: 100%;
	cursor: pointer;
	padding: 14px;
	border: 1px solid var(--main-form-color);
	color: white;
	background-color: var(--main-form-color);
	border-radius: 30px;
	transition: background-color .3s ease;
	font-family: Geometria-Medium, serif;
	line-height: 100%;
	font-size: 14px;
}

.nn-invest-button:disabled {
	border: 1px solid var(--main-form-color);
	color: #969696;
	background-color: var(--main-form-color);
	cursor: auto;
}

.nn-invest-button.inverted {
	border: 1px solid var(--main-form-color);
	color: var(--main-form-color);
	background-color: transparent;
}

@media screen and (max-width: 425px) {
	.nn-invest-button {
		cursor: pointer;
	}
}

</style>