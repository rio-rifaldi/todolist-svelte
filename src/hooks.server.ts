import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async (props) => {
	if (props.event.url.pathname === '/json') {
		return new Response('halooo');
	}
	// console.log(props);

	return await props.resolve(props.event);
};
