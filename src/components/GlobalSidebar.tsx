import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
  const sortItems = (items: Item[]) =>
    [...items].sort((a, b) => {
      if (a.label === "intro") return -1;
      if (b.label === "intro") return 1;
      return a.label.localeCompare(b.label, "zh-TW");
    });

  return Object.entries(tree).map(([name, subs]) => ({
    name,
    subgroups: Object.entries(subs).map(([label, items]) => ({ label, items: sortItems(items) })),
  }));
}

const tree = buildTree();

function SubGroup({ sub, activePath, onNav }: { sub: SubGroup; activePath: string; onNav: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sidebar__group">
      <button className="sidebar__group-toggle" onClick={() => setOpen((v) => !v)}>
        <span className={`sidebar__group-arrow ${open ? "sidebar__group-arrow--open" : ""}`} />
        {sub.label}
      </button>
      {open && (
        <div className="sidebar__group-items">
          {sub.items.map(({ path, label }) => (
            <Link
              key={path}
              to={`/docs/${encodeURI(path)}`}
              className={`sidebar__item sidebar__item--sub ${activePath === path ? "sidebar__item--active" : ""}`}
              onClick={onNav}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryBlock({ cat, activePath, onNav }: { cat: Category; activePath: string; onNav: () => void }) {
  const isActive = activePath.startsWith(cat.name + "/");
  const [open, setOpen] = useState(isActive);

  return (
    <div className="sidebar__cat">
      <button
        className={`sidebar__cat-toggle ${isActive ? "sidebar__cat-toggle--active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`sidebar__group-arrow ${open ? "sidebar__group-arrow--open" : ""}`} />
        {cat.name}
      </button>
      {open && (
        <div className="sidebar__cat-body">
          {cat.subgroups.map((sub) =>
            sub.label ? (
              <SubGroup key={sub.label} sub={sub} activePath={activePath} onNav={onNav} />
            ) : (
              sub.items.map(({ path, label }) => (
                <Link
                  key={path}
                  to={`/docs/${encodeURI(path)}`}
                  className={`sidebar__item ${activePath === path ? "sidebar__item--active" : ""}`}
                  onClick={onNav}
                >
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

interface GlobalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSidebar({ isOpen, onClose }: GlobalSidebarProps) {
  const location = useLocation();

  const activePath = decodeURIComponent(
    location.pathname.replace(/^\/docs\//, "")
  );

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--closed"}`}>
      {tree.map((cat) => (
        <CategoryBlock key={cat.name} cat={cat} activePath={activePath} onNav={onClose} />
      ))}
    </aside>
  );
}
