import { Home, Link2, BarChart2, LayoutTemplate, Share2, GitCompare, Settings } from 'lucide-react';

const items = [
  { key: 'Dashboard', label: 'Dashboard', icon: Home },
  { key: 'UTM Builder', label: 'UTM Builder', icon: Link2 },
  { key: 'Analytics', label: 'Analytics', icon: BarChart2 },
  { key: 'Templates', label: 'Templates', icon: LayoutTemplate },
  { key: 'Exports', label: 'Exports', icon: Share2 },
  { key: 'Comparisons', label: 'Comparisons', icon: GitCompare },
];

export default function Sidebar({ current, onNavigate }) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-neutral-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="px-5 py-4 border-b border-neutral-200">
        <div className="font-semibold text-lg">UTM Command</div>
        <div className="text-xs text-neutral-500">Campaign URL manager</div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100 text-neutral-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-neutral-200">
        <button
          onClick={() => onNavigate('Settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
            current === 'Settings' ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
