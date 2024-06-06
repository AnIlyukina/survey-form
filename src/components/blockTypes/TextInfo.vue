<script setup>
import {toRefs} from "vue";

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

const {data} = toRefs(props);
</script>

<template>
	<div :id="data.id" class="nn-invest-TextInfo">
		<div class="nn-invest-form__label">
			{{ index ? `${index}.` : '' }} <span v-html="data.title"></span>
		</div>
		<p v-if="data.comments" v-html="data.comments" class="nn-invest-form__addition"></p>
	</div>
</template>

<style scoped>
.nn-invest-TextInfo {
	margin-bottom: 40px;
}
</style>