from pathlib import Path
from PIL import Image, ImageDraw

folder=Path(__file__).resolve().parents[1]
for page in ['home','gallery','services','request-demo','faq','about-us']:
 for mode in ['desktop','mobile']:
  reference=folder/'reference'/f'{page}-{mode}.png'
  implementation=folder/'qa'/f'{page}-{mode}.png'
  if not reference.exists() or not implementation.exists():continue
  source=Image.open(reference).convert('RGB')
  actual=Image.open(implementation).convert('RGB')
  width=min(source.width,actual.width)
  height=844 if mode=='mobile' else 712
  out=Image.new('RGB',(width*2,height+24),'white')
  out.paste(source.crop((0,0,width,height)),(0,24));out.paste(actual.crop((0,0,width,height)),(width,24))
  ImageDraw.Draw(out).text((8,5),'SOURCE',fill='black');ImageDraw.Draw(out).text((width+8,5),'REACT',fill='black')
  out.save(folder/'qa'/f'compare-{page}-{mode}.png')
  thumb_width=390 if mode=='desktop' else 300
  source.thumbnail((thumb_width,10000));actual.thumbnail((thumb_width,10000))
  out=Image.new('RGB',(thumb_width*2,max(source.height,actual.height)+24),'#ddd')
  out.paste(source,(0,24));out.paste(actual,(thumb_width,24))
  ImageDraw.Draw(out).text((8,5),'SOURCE',fill='black');ImageDraw.Draw(out).text((thumb_width+8,5),'REACT',fill='black')
  out.save(folder/'qa'/f'compare-{page}-{mode}-full.png')
print('Comparison images saved in qa/')
