import assert from 'node:assert/strict';
import test from 'node:test';
import pages from '../src/content/index.json' with { type: 'json' };
import testimonials from '../src/testimonialContent.json' with { type: 'json' };
import { translate } from '../src/locale.js';
import { pageMetadata } from '../src/metadata.js';
import { articles, faqs, implementationSteps, navigation, otherProducts, products } from '../src/siteContent.js';

test('Kiswahili covers public page metadata without changing default English', () => {
  for (const {path,title} of pages) {
    const english = pageMetadata(path,title);
    const swahili = pageMetadata(path,title,'sw');
    assert.notEqual(swahili.title,english.title,path);
    assert.notEqual(swahili.description,english.description,path);
    assert.deepEqual(pageMetadata(path,title,'en'),english,path);
  }
});

test('all public product, guide, FAQ and navigation copy has a Kiswahili entry', () => {
  const messages = [
    ...navigation.flatMap(item => [item.label,item.overview,...(item.links || []).map(([label])=>label)]).filter(Boolean),
    ...products.flatMap(({name,title,headline,summary,audience,features})=>[name,title,headline,summary,audience,...features.flat()]),
    ...otherProducts.flatMap(([,title,summary])=>[title,summary]),
    ...articles.flatMap(({title,category,description,sections})=>[title,category,description,...sections.flat()]),
    ...implementationSteps.flat(),
    ...faqs.flat(),
  ];

  for (const message of messages) {
    if (message !== 'AMCOS') assert.notEqual(translate('sw',message),message,message);
  }
  for (const {name,quote,quoteSw} of testimonials) {
    assert.ok(quoteSw && quoteSw !== quote,name);
  }
});
