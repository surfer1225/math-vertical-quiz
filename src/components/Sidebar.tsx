"use client";

import { WORLDS } from "@/lib/gameLogic";

interface SidebarProps {
  currentWorld: number;
  currentLevel: number;
  open: boolean;
  onToggle: () => void;
  onSelect: (world: number, level: number) => void;
}

export default function Sidebar({ currentWorld, currentLevel, open, onToggle, onSelect }: SidebarProps) {
  return (
    <>
      {/* Hamburger button */}
      <button className="sidebar-toggle" onClick={onToggle} aria-label="菜单">
        <span className={`hamburger ${open ? "open" : ""}`}>
          <span /><span /><span />
        </span>
      </button>

      {/* Backdrop */}
      {open && <div className="sidebar-backdrop" onClick={onToggle} />}

      {/* Sidebar panel */}
      <nav className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">关卡选择</span>
        </div>

        <div className="sidebar-content">
          {WORLDS.map((world) => {
            const isCurrentWorld = world.id === currentWorld;

            return (
              <div key={world.id} className="sidebar-world">
                <div className={`sidebar-world-header ${isCurrentWorld ? "active" : ""}`}>
                  <span className="sidebar-world-emoji">{world.emoji}</span>
                  <span className="sidebar-world-name">W{world.id} {world.name}</span>
                </div>

                <div className="sidebar-levels">
                  {world.levels.map((level, idx) => {
                    const levelNum = idx + 1;
                    const isActive = isCurrentWorld && levelNum === currentLevel;

                    return (
                      <button
                        key={level.id}
                        className={`sidebar-level ${isActive ? "active" : ""}`}
                        onClick={() => {
                          onSelect(world.id, levelNum);
                          onToggle();
                        }}
                      >
                        <span className="sidebar-level-id">{level.id}</span>
                        <span className="sidebar-level-desc">{level.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
