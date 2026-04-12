import { detectLocaleFromAcceptLanguage } from '$lib/i18n';

export const load = async ({ request }) => {
	const locale = detectLocaleFromAcceptLanguage(request.headers.get('accept-language'));

	return { locale };
};