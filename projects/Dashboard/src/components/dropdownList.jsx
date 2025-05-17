import { useState, useRef, useEffect } from "react";
import { treeData } from "../data/zonas"


function getAllDescendants(node) {
  if (!node.children) return [];
  return node.children.flatMap((child) => [
    child.value,
    ...getAllDescendants(child),
  ]);
}

function TreeNode({ node, selected, toggle }) {
  const isChecked = selected.has(node.value);

  const handleToggle = () => {
    const descendants = getAllDescendants(node);
    toggle(node.value, descendants);
  };

  return (
    <div className="mt-2">
      <label>
        <input type="checkbox" checked={isChecked} onChange={handleToggle} />
        {node.label}
      </label>
      {node.children &&
        node.children.map((child) => (
          <div key={child.value} className="ml-4">
            <TreeNode node={child} selected={selected} toggle={toggle} />
          </div>
        ))}
    </div>
  );
}

export default function DropdownList() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const comboRef = useRef();

  const toggle = (value, descendants) => {
    const newSelected = new Set(selected);
    const shouldSelect = !newSelected.has(value);
    if (shouldSelect) {
      newSelected.add(value);
      descendants.forEach((d) => newSelected.add(d));
    } else {
      newSelected.delete(value);
      descendants.forEach((d) => newSelected.delete(d));
    }
    setSelected(newSelected);
  };

  const handleClickOutside = (e) => {
    if (comboRef.current && !comboRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-80 text-left" ref={comboRef}>
      <input
        type="text"
        readOnly
        onClick={() => setOpen(!open)}
        value={
          selected.size === 0
            ? "Seleccionar ubicación..."
            : [...selected].join(" - ")
        }
        className="p-2 border border-black rounded-lg w-full h-10 cursor-pointer"
      />
      {open && (
        <div className="top-full z-10 absolute bg-white shadow-[0px_4px_10px_rgba(0, p-2 border border-black rounded-lg w-full max-h-80 overflow-y-auto 0, 0, 0.1)]">
          <label>
            <input
              type="checkbox"
              checked={selected.size > 0}
              onChange={() => {
                const all = [];
                treeData.forEach((node) => {
                  all.push(node.value, ...getAllDescendants(node));
                });
                const newSet = selected.size === 0 ? new Set(all) : new Set();
                setSelected(newSet);
              }}
            />
            TODO
          </label>
          {treeData.map((node) => (
            <TreeNode
              key={node.value}
              node={node}
              selected={selected}
              toggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
