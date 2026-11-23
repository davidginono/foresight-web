import swahili from './swahili.json' with { type: 'json' };

export function translate(locale, message) {
  return locale === 'sw' && Object.hasOwn(swahili, message) ? swahili[message] : message;
}
