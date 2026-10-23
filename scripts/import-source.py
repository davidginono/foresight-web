"""Turn the captured, public source DOM and assets into local React content.

Run with Python + beautifulsoup4. This never contacts the production site.
"""
import hashlib
import json
import re
import shutil
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
REFERENCE = ROOT / "reference"
PUBLIC = ROOT / "public"
CONTENT = ROOT / "src" / "content"
CONTENT.mkdir(parents=True, exist_ok=True)
assets = {}
for manifest in REFERENCE.glob("*assets.json"):
    manifest_data = json.loads(manifest.read_text(encoding="utf-8"))
    if not isinstance(manifest_data, dict): continue
    for asset in manifest_data["assets"]:
        assets[asset["url"]] = asset

# Persist raw bundles so regeneration does not depend on browser temporary files.
raw_assets = REFERENCE / "source-assets"
raw_assets.mkdir(exist_ok=True)
for url, asset in assets.items():
    filename = hashlib.sha256(url.encode()).hexdigest()[:16] + Path(urlsplit(url).path).suffix
    cached = raw_assets / filename
    if not cached.exists(): shutil.copyfile(asset["path"], cached)
    asset["path"] = str(cached)

def local_url(url):
    return "/assets" + unquote(urlsplit(url).path)

by_path = {urlsplit(url).path: asset for url, asset in assets.items()}
missing = set()

def rewrite_url(url, base="https://foresight.co.tz/"):
    if not url or url.startswith(("data:", "#", "blob:")):
        return url
    absolute = urljoin(base, url)
    parts = urlsplit(absolute)
    if parts.path in by_path:
        return local_url(absolute)
    if parts.netloc in ("foresight.co.tz", "www.foresight.co.tz"):
        if re.search(r"\.(png|jpg|jpeg|webp|gif|svg|woff2?|ttf|eot|css|mp4)$", parts.path, re.I):
            missing.add(absolute)
            return local_url(absolute)
        return parts.path + ("?" + parts.query if parts.query else "") + ("#" + parts.fragment if parts.fragment else "")
    return url

def rewrite_css(css, base):
    # Keep only font faces whose real font file was captured. No remote fallback.
    def font_face(match):
        urls = re.findall(r"url\([\"']?([^\)\"']+)", match[0])
        available = [u for u in urls if urlsplit(urljoin(base, u)).path in by_path]
        if not available: return ""
        preferred = next((u for u in available if '.woff2' in u), available[0])
        fmt = "woff2" if '.woff2' in preferred else "woff"
        return re.sub(r"src\s*:[^;]+;", 'src:url("' + urljoin(base, preferred) + '") format("' + fmt + '");', match[0])
    css = re.sub(r"@font-face\s*\{[^}]+\}", font_face, css)
    return re.sub(r"url\(\s*([\"']?)(.*?)\1\s*\)", lambda m: 'url("' + rewrite_url(m[2], base) + '")', css)

for url, asset in assets.items():
    output = PUBLIC / local_url(url).lstrip("/")
    output.parent.mkdir(parents=True, exist_ok=True)
    if asset["kind"] == "stylesheet":
        output.write_text(rewrite_css(Path(asset["path"]).read_text(encoding="utf-8"), url), encoding="utf-8")
    else:
        shutil.copyfile(asset["path"], output)

service_routes = {
    "saccos": "/saccos-microfinance-system/", "union": "/union-management-system/",
    "amcos": "/amcos-management-system/", "payroll": "/payroll-system/",
    "car tracking": "/car-tracking-system/", "school": "/school-management-system/",
    "inventory": "/inventory-and-accounting-software/", "consultancy": "/software-consultancy-and-service/",
}
page_index = []
for capture in sorted(REFERENCE.glob("*.html")):
    if capture.stem in ("gallery-lightbox", "mobile-menu-expanded"):
        continue
    soup = BeautifulSoup(capture.read_text(encoding="utf-8"), "html.parser")
    if not soup.body or not soup.title: continue
    canonical = soup.select_one('link[rel="canonical"]')
    path = urlsplit(canonical["href"]).path if canonical else "/" + capture.stem.replace("author-", "author/").replace("category-", "category/") + "/"
    if capture.stem == "home": path = "/"
    if capture.stem == "2024-09-12": path = "/2024/09/12/"
    styles = []
    for tag in soup.select('style,link[rel="stylesheet"]'):
        if tag.name == "link":
            href = rewrite_url(tag["href"])
            if href.startswith("/assets/"):
                styles.append({"href": href})
        else:
            css = rewrite_css(tag.get_text(), "https://foresight.co.tz" + path)
            if css.strip():
                digest = hashlib.sha256(css.encode()).hexdigest()[:16]
                dest = PUBLIC / "assets" / "styles" / (digest + ".css")
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_text(css, encoding="utf-8")
                styles.append({"href": "/assets/styles/" + digest + ".css"})
        tag.decompose()
    body = soup.body
    for tag in body.select("script,link,meta,#elementor-device-mode,.elfsight-app-2bbd2f10-09cc-49b3-a922-c012c739da17"):
        tag.decompose()
    for tag in body.find_all(True):
        for attr in list(tag.attrs):
            if attr.startswith("on") or attr in ("srcset", "sizes", "data-e-action-hash", "fetchpriority", "inert"):
                del tag[attr]
        for attr in ("src", "href", "poster", "data-src", "data-thumbnail"):
            if tag.has_attr(attr):
                tag[attr] = rewrite_url(tag[attr])
        if tag.has_attr("style"):
            tag["style"] = rewrite_css(tag["style"], "https://foresight.co.tz" + path)
        classes = tag.get("class", [])
        if "elementor-invisible" in classes:
            classes.remove("elementor-invisible")
        if "e-gallery-image" in classes:
            tag["style"] = tag.get("style", "") + ';background-image:url("' + tag.get("data-thumbnail", "") + '")'
        if tag.name == "a":
            text = tag.get_text(" ", strip=True).lower()
            href = tag.get("href", "")
            if text in ("request demo", "request a demo") and href in ("#", "", path + "#"):
                tag["href"] = "/request-demo/"
            if text in ("view all services", "our services") and href in ("#", "", path + "#"):
                tag["href"] = "/services/"
            if "union management" in text and "saccos" not in text and len(text) < 50:
                tag["href"] = "/union-management-system/"
            if text == "read more" and href in ("#", "", path + "#"):
                parent = tag
                for _ in range(6):
                    parent = parent.parent
                    title = parent.find(["h2", "h3"])
                    if title:
                        heading = title.get_text(" ", strip=True).lower()
                        for key, route in service_routes.items():
                            if key in heading:
                                tag["href"] = route
                                break
                        break
            if href.startswith("https://info@") or href.startswith("http://info@"):
                tag["href"] = "mailto:info@foresight.co.tz"
        if tag.name == "form":
            tag.attrs.pop("action", None)
            tag["data-local-form"] = "true"
        if tag.name == "input" and tag.get("type") == "hidden":
            tag.decompose()
    for counter in body.select('.elementor-counter-number[data-to-value]'):
        counter.string = counter['data-to-value']
    # Swiper's generated clones and measured widths must be initialized locally.
    for clone in body.select(".swiper-slide-duplicate"):
        clone.decompose()
    for element in body.select(".swiper,.swiper-container,.swiper-wrapper,.swiper-slide"):
        element.attrs.pop("style", None)
        element["class"] = [c for c in element.get("class", []) if c not in ("swiper-initialized", "swiper-horizontal", "swiper-pointer-events", "swiper-backface-hidden", "swiper-fade", "swiper-watch-progress", "swiper-slide-active", "swiper-slide-next", "swiper-slide-prev", "swiper-slide-visible", "swiper-slide-fully-visible")]
    for iframe in body.select("iframe[src]"):
        iframe["loading"] = "lazy"
        if not iframe.get("title"): iframe["title"] = "Foresight location map"
    # Make every field accessible even where the source relied on placeholders.
    for field in body.select("input,textarea,select"):
        if not field.get("aria-label") and not body.find("label", attrs={"for": field.get("id")}):
            field["aria-label"] = field.get("placeholder") or field.get("name", "Input")
    payload = {"path": path, "title": soup.title.get_text(), "bodyClass": " ".join(body.get("class", [])), "styles": styles, "html": body.decode_contents()}
    (CONTENT / (capture.stem + ".json")).write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    page_index.append({"path": path, "file": capture.stem, "title": payload["title"]})

(CONTENT / "index.json").write_text(json.dumps(page_index, indent=2), encoding="utf-8")
(REFERENCE / "asset-inventory.json").write_text(json.dumps([{"source": u, "local": local_url(u), "kind": a["kind"]} for u, a in assets.items()], indent=2), encoding="utf-8")
(REFERENCE / "missing-assets.json").write_text(json.dumps(sorted(missing), indent=2), encoding="utf-8")
print(f"Imported {len(page_index)} pages and {len(assets)} original assets. Missing dependencies: {len(missing)}")
