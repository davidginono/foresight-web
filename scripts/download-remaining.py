"""Download observed source dependencies that were below the initial viewport."""
import concurrent.futures
import json
import subprocess
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit, urlunsplit

root = Path(__file__).resolve().parents[1]
urls = json.loads((root / 'reference/missing-assets.json').read_text())
folder = root / 'reference/downloads'
folder.mkdir(exist_ok=True)

def download(pair):
    index, url = pair
    parts = urlsplit(url)
    encoded = urlunsplit((parts.scheme, parts.netloc, quote(unquote(parts.path)), parts.query, ''))
    output = folder / (str(index) + Path(unquote(parts.path)).suffix)
    result = subprocess.run(['curl.exe', '--fail', '--silent', '--show-error', '--max-time', '30', '--output', str(output), encoded], capture_output=True)
    if result.returncode: return {'url': url, 'error': result.stderr.decode(errors='replace')}
    kind = 'font' if output.suffix in ('.woff2','.woff','.ttf','.eot') else 'image'
    return {'url': url, 'path': str(output), 'kind': kind, 'name': unquote(parts.path).rsplit('/',1)[-1]}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(download, enumerate(urls)))
manifest=root / 'reference/remaining-assets.json'
previous=json.loads(manifest.read_text(encoding='utf8'))['assets'] if manifest.exists() else []
merged={a['url']:a for a in previous}
merged.update({a['url']:a for a in results if 'error' not in a})
manifest.write_text(json.dumps({'assets': list(merged.values()), 'failures': [r for r in results if 'error' in r]}, indent=2), encoding='utf8')
print(json.dumps({'downloaded':len([r for r in results if 'error' not in r]),'failures':[r for r in results if 'error' in r]}, indent=2))
