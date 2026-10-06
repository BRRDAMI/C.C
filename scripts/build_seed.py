import re, json, pathlib

src = pathlib.Path("/app/frontend/src")
thumbs_txt = (src / "data/thumbs.js").read_text()
thumbs = dict(re.findall(r'"(\d+)":\s*"([^"]+)"', thumbs_txt))

mock = (src / "data/mock.js").read_text()


def grab(name):
    m = re.search(r"export const %s = \[(.*?)\n\];" % name, mock, re.S)
    rows = []
    for line in m.group(1).strip().splitlines():
        d = {}
        d["id"] = re.search(r'id: "([^"]+)"', line).group(1)
        d["name"] = re.search(r'name: "([^"]+)"', line).group(1)
        d["category"] = re.search(r'category: "([^"]+)"', line).group(1)
        d["rap"] = re.search(r'rap: "([^"]+)"', line).group(1)
        d["price"] = float(re.search(r"price: ([\d.]+)", line).group(1))
        aid = re.search(r"(?:assetImg|bundleImg)\((\d+)\)", line).group(1)
        d["image"] = thumbs.get(aid, "")
        rows.append(d)
    return rows


trending = grab("trending")
listings = grab("listings")
for t in trending:
    t["trending"] = True
for l in listings:
    l["trending"] = False

all_items = trending + listings
missing = [i["name"] for i in all_items if not i["image"]]
print(len(all_items), "items,", len(missing), "missing images", missing)
pathlib.Path("/app/backend/catalog_seed.json").write_text(json.dumps(all_items, indent=1))
