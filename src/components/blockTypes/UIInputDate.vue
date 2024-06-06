<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {computed, ref, toRefs, watch} from 'vue';

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

const {data, formData, validationError} = toRefs(props)

const date = ref(formData.value[data.value.id] || null);

watch(date, (newValue) => {
	formData.value[data.value.id] = newValue;
});

const isValidateError = computed(() => validationError.value.isShow && validationError.value.errors[data.value.id])

</script>

<template>
	<div :id="data.id" class="nn-invest-datepicker">
		<label class="nn-invest-form__label">
			{{ index ? `${index}.` : '' }} {{ data.title }}<span v-if="data.required" class="nn-invest-form__required"/>
		</label>
		<p v-if="data.comments" v-html="data.comments" class="nn-invest-form__addition"></p>
		<Datepicker
			v-model="date"
			:enable-time-picker="false"
			:locale="'ru'"
			:day-names="['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
			:format="'dd.MM.yy'"
			:placeholder="data.placeholder"
			:class="{ 'invalid-date': isValidateError }"
			class="nn-invest-form__data-picker"
			auto-apply
		/>
		<div class="nn-invest-form__input-error">
			<span v-if="validationError.isShow">
				{{ validationError.errors[data.id] || '' }}
			</span>
		</div>
	</div>
</template>

<style>

.nn-invest-form__data-picker {
	margin-top: 12px;
}

.dp__month_year_wrap {
	order: -1;
	gap: 10px;
	margin-left: 10px;
}

.dp__month_year_row {
	margin-bottom: 20px;
}

.dp__arrow_top {
	display: none;
}

.dp__month_year_select, .dp__overlay_cell {
	background-color: #F4F4F4;
}

.dp__menu, .dp__overlay {
	border-radius: 30px;
}
.dp__overlay {
	padding: 16px;
}

.dp__overlay_container {
	height: 290px!important;
	justify-content: center;
}

.dp__calendar_header {
	font-weight: 500;
}

.dp__overlay_row.dp__flex_row {
	flex: initial;
	gap: 5px;
}

.dp__overlay_row {
	padding-top: 5px;
}

.dp__button.dp__overlay_action {
	display: none;
}

.dp__overlay_col {
	width: initial;
	flex: 1;
}

.dp__theme_light {
	--dp-menu-border-color:#f3f3f3;
	--dp-background-color: #FFF;
	--dp-border-color: #FFF;
	--dp-border-color-hover: #FFF;
	--dp-primary-color: var(--main-form-color);
	--dp-input-padding: 12px;
	--dp-font-size: 14px;
	--dp-cell-border-radius: 50%;
	--dp-border-radius: 8px;
	--dp-menu-padding: 16px;
	--dp-text-color: #333333
}

.invalid-date.dp__theme_light {
	--dp-border-color: #E72828; /* Измените цвет границы на красный, если дата невалидна */
	--dp-border-color-hover: #E72828;
}
</style>