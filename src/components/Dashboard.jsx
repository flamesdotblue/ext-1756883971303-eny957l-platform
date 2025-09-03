import { Bell, Plus } from 'lucide-react';

export default function Dashboard({ stats, notifications, utmLinks, onQuickCreate, onGoToBuilder }) {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="text-xl font-semibold">Dashboard</div>
        <div className="flex gap-2">
          <button
            onClick={onGoToBuilder}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" /> Quick Create
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Clicks" value={stats.totalClicks.toLocaleString()} />
        <StatCard label="Top Campaign" value={stats.topCampaign} />
        <StatCard label="Unique Campaigns" value={stats.uniqueCampaigns} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Recent UTM Links</div>
            <button onClick={onGoToBuilder} className="text-sm text-neutral-600 hover:text-neutral-900">View all</button>
          </div>
          <div className="divide-y divide-neutral-200">
            {utmLinks.slice(0, 5).map((l) => (
              <div key={l.id} className="py-3 flex items-center justify-between text-sm">
                <div className="truncate max-w-[60%]">
                  <div className="font-medium truncate">{l.campaign}</div>
                  <div className="text-neutral-500 truncate">{l.finalUrl}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{(l.clicks || 0).toLocaleString()}</div>
                  <div className="text-neutral-500">clicks</div>
                </div>
              </div>
            ))}
            {utmLinks.length === 0 && (
              <div className="text-sm text-neutral-600 py-8 text-center">No links yet. Create your first UTM link to get started.</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4" />
            <div className="font-medium">Team Updates</div>
          </div>
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="text-sm">
                <div className="text-neutral-800">{n.message}</div>
                <div className="text-neutral-500">{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium">Quick-create UTM</div>
        </div>
        <QuickCreateForm onSubmit={onQuickCreate} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4">
      <div className="text-neutral-500 text-sm">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function QuickCreateForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const baseUrl = data.get('baseUrl')?.toString().trim();
    const source = data.get('utm_source')?.toString().trim();
    const medium = data.get('utm_medium')?.toString().trim();
    const campaign = data.get('utm_campaign')?.toString().trim();

    const params = new URLSearchParams();
    if (source) params.set('utm_source', source);
    if (medium) params.set('utm_medium', medium);
    if (campaign) params.set('utm_campaign', campaign);
    const finalUrl = baseUrl && params.toString() ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params.toString()}` : baseUrl || '';

    onSubmit({ baseUrl, source, medium, campaign, content: '', term: '', finalUrl });
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <input name="baseUrl" required placeholder="Base URL (https://example.com/...)" className="md:col-span-2 border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10" />
      <input name="utm_source" required placeholder="utm_source" className="border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10" />
      <input name="utm_medium" required placeholder="utm_medium" className="border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10" />
      <input name="utm_campaign" required placeholder="utm_campaign" className="border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10" />
      <button type="submit" className="md:col-span-5 sm:col-span-1 inline-flex justify-center items-center px-3 py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-800">Create</button>
    </form>
  );
}
