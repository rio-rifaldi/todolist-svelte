import type { Writable } from 'svelte/store';

export function closeUpdateOnOutsideClick(isEdit: Writable<boolean>) {
	window.addEventListener('click', (e) => {
		if (document.getElementById('todolist')?.contains(e.target as Node)) {
			return;
		} else {
			isEdit.set(false);
		}
	});
}
