import { useState } from "react";
import { Link } from "react-router-dom";

const docModules = import.meta.glob("../docs/**/*.md", {
  query: "?raw",
  import: "default",
});

const allPaths = Object.keys(docModules)
  .map((k) => k.replace("../docs/", "").replace(/\.md$/, ""));

interface Item { path: string; label: string }
interface SubGroup { label: string; items: Item[] }
interface Category { name: string; subgroups: SubGroup[] }

function buildTree(): Category[] {
  const tree: Record<string, Record<string, Item[]>> = {};
  for (const path of allPaths) {
    const parts = path.split("/");
    const cat = parts[0];
    const sub = parts.length === 3 ? parts[1] : "";
    const label = parts[parts.length - 1];
    if (!tree[cat]) tree[cat] = {};
    if (!tree[cat][sub]) tree[cat][sub] = [];
    tree[cat][sub].push({ path, label });
  }
  return Object.entries(tree).map(([name, subs]) => ({
    name,
    subgroups: Object.entries(subs).map(([label, items]) => ({ label, items })),
  }));
}

const tree = buildTree();

function SubGroupLinks({ sub }: { sub: SubGroup }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="docs-nav__subgroup">
      <button className="docs-nav__subgroup-toggle" onClick={() => setOpen((v) => !v)}>
        <span className={`sidebar__group-arrow ${open ? "sidebar__group-arrow--open" : ""}`} />
        {sub.label}
      </button>
      {open && sub.items.map(({ path, label }) => (
        <Link key={path} to={`/docs/${encodeURI(path)}`} className="docs-nav__link docs-nav__link--sub">
          {label}
        </Link>
      ))}
    </div>
  );
}

function CategoryCard({ cat }: { cat: Category }) {
  const [open, setOpen] = useState(false);
  const total = cat.subgroups.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="docs-nav__card">
      <button className="docs-nav__card-header" onClick={() => setOpen((v) => !v)}>
        <span className="docs-nav__card-title">{cat.name}</span>
        <span className="docs-nav__card-count">{total} 篇</span>
        <span className={`sidebar__group-arrow ${open ? "sidebar__group-arrow--open" : ""}`} />
      </button>

      {open && (
        <div className="docs-nav__card-body">
          {cat.subgroups.map((sub) =>
            sub.label ? (
              <SubGroupLinks key={sub.label} sub={sub} />
            ) : (
              sub.items.map(({ path, label }) => (
                <Link key={path} to={`/docs/${encodeURI(path)}`} className="docs-nav__link">
                  {label}
                </Link>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function DocsNav() {
  return (
    <section className="docs-nav">
      <div className="docs-nav__inner">
        <h2 className="docs-nav__heading">筆記目錄</h2>
        <div className="docs-nav__grid">
          {tree.map((cat) => (
            <CategoryCard key={cat.name} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
