import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export function setShowDate(input: boolean) {
	let isShowDate = writable(false);
	isShowDate.set(input);
	setContext('isShowDate', isShowDate);
}

export function getIsShowDate(): Writable<boolean> {
	return getContext('isShowDate');
}
