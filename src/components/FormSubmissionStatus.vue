<script setup>
import UIButton from "./blockTypes/UIButton.vue";
import {toRefs} from "vue";

const props = defineProps({
	title: String,
	subtitle: String,
	iconName: String,
})

const { title, subtitle, iconName } = toRefs(props)

const getImageUrl = (imageName) => {
	return new URL(`../assets/icon-${imageName}.svg`, import.meta.url).href;
}

const backToMain = () => {
	window.location.href = window.location.origin + '/surveys' ;
}
</script>

<template>
	<div class="nn-invest-status">
		<div class="nn-invest-status__image-block">
			<img :src="getImageUrl(iconName)" alt="Успешно отправлено">
		</div>
		<div class="nn-invest-status__content">
			<h4> {{ title }} </h4>
			<p> {{ subtitle }} </p>
		</div>
		<div class="nn-invest-status__button-block">
			<UIButton
				@click="backToMain"
				name="Вернуться на главную"
			/>
		</div>
	</div>

</template>

<style scoped>
.nn-invest-status {
	background-color: #F1F1F1;
	border-radius: 30px;
	display: flex;
	flex-direction: column;
	gap: 30px;
	align-items: center;
	text-align: center;
	padding: 41px 10px;
}

.nn-invest-status__content > h4 {
	font-size: 24px;
	text-decoration: none;
	margin: 0;
	text-transform: initial;
	line-height: 100%;
	font-family: Geometria-Medium, serif;
	color: #282525;
}

.nn-invest-status__content > p {
	margin: 18px 0 0 0;
	font-family: Geometria-Bold, serif;
	font-size: 14px;
	line-height: 100%;
	color: #282525;
}

.nn-invest-status__button-block {
	max-width: 211px;
	width: 100%;
	font-family: Geometria-Medium, serif;
}
</style>