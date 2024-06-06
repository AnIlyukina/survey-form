<script setup>
import {toRefs} from "vue";

const props = defineProps({
	groupType: {
		type: String,
		default: ''
	},
	groupName: {
		type: String,
		default: ''
	},
	title: {
		type: String,
		default: ''
	},
})

const { groupName, groupType, title} = toRefs(props)

</script>

<template>
	<h2 v-if="groupType" class="nn-invest-form__group-type">{{ groupType }}</h2>
	<h3 v-if="groupName" class="nn-invest-form__group-name">{{ groupName }}</h3>
	<h4 v-if="title" class="nn-invest-form__title">{{ title }}</h4>
</template>

<style scoped>
.nn-invest-form__group-type,
.nn-invest-form__group-name,
.nn-invest-form__title {
	margin: 0;
	letter-spacing: initial;
	line-height: 100%;
}

.nn-invest-form__group-type {
	font-size: 40px;
	color: #282525;
	padding-bottom: 6px;
	width: fit-content;
	font-family: Geometria-Bold, sans-serif;
	border-bottom: 2px solid #282525;
}

.nn-invest-form__group-name {
	font-size: 34px;
	text-transform: uppercase;
	margin-top: 8px;
	font-family: Geometria-Bold, sans-serif;
	color: #282525;
}
.nn-invest-form__title {
	text-decoration: none;
	text-transform: initial;
	font-size: 26px;
	margin-top: 26px;
	line-height: 115%;
	color: #282525;
}

@media screen and (max-width: 1440px) {
	.nn-invest-form__group-type {
		font-size: 28px;
	}
	.nn-invest-form__group-name {
		font-size: 18px;
	}
}

@media screen and (max-width: 1024px) {
	.nn-invest-form__group-type {
		font-size: 22px;
	}

	.nn-invest-form__group-name {
		font-size: 14px;
		margin-top: 15px;
	}

	.nn-invest-form__title {
		margin-top: 15px;
		font-size: 14px;
	}
}
</style>