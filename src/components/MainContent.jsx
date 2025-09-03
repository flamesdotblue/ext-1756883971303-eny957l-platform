import { useMemo, useState } from 'react';
import { Copy, Plus, Save, Check } from 'lucide-react';

export default function MainContent({ section, utmLinks, onAddLink, templates, onSaveTemplate, onApplyTemplate }) {
  if (section === 'UTM Builder') return <UTMBuilder templates={templates} onSaveTemplate={onSaveTemplate} onApplyTemplate={onApplyTemplate} onAddLink={onAddLink} />;
  if (section === 'Analytics') return <Analytics utmLinks={utmLinks} />;
  if (section === 'Templates') return <Templates templates={templates} onSaveTemplate={onSaveTemplate} />;
  if (section === 'Exports') return <Exports utmLinks={utmLinks} />;
  if (section === 'Comparisons') return <Comparisons utmLinks={utmLinks} />;
  if (section === 'Settings') return <Settings />;
  return null;
}

function Section({ title, children, actions }) {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {actions}
      </div>
      {children}
    </div>
  );
}

function UTMBuilder({ onAddLink, templates, onSaveTemplate, onApplyTemplate }) {
  const [form, setForm] = useState({ baseUrl: '', source: '', medium: '', campaign: '', content: '', term: '' });

  const finalUrl = useMemo(() => {
    try {
      const params = new URLSearchParams();
      if (form.source) params.set('utm_source', form.source);
      if (form.medium) params.set('utm_medium', form.medium);
      if (form.campaign) params.set('utm_campaign', form.campaign);
      if (form.content) params.set('utm_content', form.content);
      if (form.term) params.set('utm_term', form.term);
      if (!form.baseUrl) return '';
      const hasQ = form.baseUrl.includes('?');
      return `${form.baseUrl}${params.toString() ? (hasQ ? '&' : '?') + params.toString() : ''}`;
    } catch {
      return '';
    }
  }, [form]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddLink({ ...form, finalUrl });
    setForm({ baseUrl: '', source: '', medium: '', campaign: '', content: '', term: '' });
  };

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!finalUrl) return;
    await navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Section title="UTM Builder" actions={
      <div className="flex items-center gap-2">
        <TemplateApply templates={templates} onApply={(t) => setForm((f) => ({ ...f, ...t.values }))} />
        <TemplateSave onSave={(name) => onSaveTemplate({ name, values: form })} />
      </div>
    }>
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Text name="baseUrl" label="Base URL" value={form.baseUrl} onChange={handleChange} placeholder="https://example.com/landing" required />
          <div className="grid grid-cols-2 gap-3">
            <Text name="source" label="utm_source" value={form.source} onChange={handleChange} placeholder="newsletter" required />
            <Text name="medium" label="utm_medium" value={form.medium} onChange={handleChange} placeholder="email" required />
          </div>
          <Text name="campaign" label="utm_campaign" value={form.campaign} onChange={handleChange} placeholder="spring_sale" required />
          <div className="grid grid-cols-2 gap-3">
            <Text name="content" label="utm_content" value={form.content} onChange={handleChange} placeholder="cta_button" />
            <Text name="term" label="utm_term" value={form.term} onChange={handleChange} placeholder="shoes" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2 text-sm truncate" title={finalUrl || 'Preview will appear here'}>
            {finalUrl || 'Your final URL will appear here'}
          </div>
          <button type="button" onClick={copy} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 text-sm hover:bg-neutral-50">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy'}
          </button>
          <button type="submit" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-800">
            <Plus className="h-4 w-4" /> Save Link
          </button>
        </div>
      </form>

      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <div className="font-medium mb-3">Saved Links</div>
        <div className="divide-y divide-neutral-200">
          {utmLinks.length === 0 && <div className="text-sm text-neutral-600 py-6">No links yet.</div>}
          {utmLinks.map((l) => (
            <div key={l.id} className="py-3 flex items-center justify-between gap-4 text-sm">
              <div className="min-w-0">
                <div className="font-medium truncate">{l.campaign}</div>
                <div className="text-neutral-500 truncate">{l.finalUrl}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="font-medium">{(l.clicks || 0).toLocaleString()}</div>
                  <div className="text-neutral-500">clicks</div>
                </div>
                <button onClick={() => navigator.clipboard.writeText(l.finalUrl)} className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md border border-neutral-200 text-xs hover:bg-neutral-50">
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Text({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-neutral-600">{label}</span>
      <input {...props} className={`border border-neutral-200 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/10 ${props.className || ''}`} />
    </label>
  );
}

function TemplateSave({ onSave }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 text-sm hover:bg-neutral-50">
        <Save className="h-4 w-4" /> Save Template
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white border border-neutral-200 rounded-md p-3 w-64 shadow-sm">
          <div className="text-sm mb-2">Template Name</div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Facebook CPC" className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm mb-2 outline-none focus:ring-2 focus:ring-neutral-900/10" />
          <button
            onClick={() => {
              if (!name.trim()) return;
              onSave(name.trim());
              setName('');
              setOpen(false);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-800"
          >
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      )}
    </div>
  );
}

function TemplateApply({ templates, onApply }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 text-sm hover:bg-neutral-50">
        Apply Template
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white border border-neutral-200 rounded-md p-2 w-64 max-h-64 overflow-auto shadow-sm">
          {templates.length === 0 && <div className="text-sm text-neutral-600 p-2">No templates yet.</div>}
          {templates.map((t) => (
            <button key={t.id} onClick={() => { onApply(t); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-50">
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Analytics({ utmLinks }) {
  const campaigns = useMemo(() => {
    const map = new Map();
    utmLinks.forEach((l) => {
      const key = l.campaign || '—';
      map.set(key, (map.get(key) || 0) + (l.clicks || 0));
    });
    return Array.from(map.entries()).map(([name, clicks]) => ({ name, clicks }));
  }, [utmLinks]);

  const max = Math.max(1, ...campaigns.map((c) => c.clicks));

  return (
    <Section title="Analytics">
      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <div className="font-medium mb-3">Top Campaigns</div>
        <div className="space-y-3">
          {campaigns.length === 0 && <div className="text-sm text-neutral-600">No data yet.</div>}
          {campaigns.map((c) => (
            <div key={c.name} className="text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="truncate pr-3">{c.name}</span>
                <span className="text-neutral-600">{c.clicks.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-neutral-100 rounded">
                <div className="h-2 bg-neutral-900 rounded" style={{ width: `${(c.clicks / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Templates({ templates, onSaveTemplate }) {
  const [name, setName] = useState('');
  const [values, setValues] = useState({ source: '', medium: '', campaign: '', content: '', term: '' });

  const save = () => {
    if (!name.trim()) return;
    onSaveTemplate({ name: name.trim(), values });
    setName('');
    setValues({ source: '', medium: '', campaign: '', content: '', term: '' });
  };

  return (
    <Section title="Templates">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
          <div className="font-medium">Create Template</div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name" className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tiny name="source" label="utm_source" value={values.source} onChange={(e) => setValues((v) => ({ ...v, source: e.target.value }))} />
            <Tiny name="medium" label="utm_medium" value={values.medium} onChange={(e) => setValues((v) => ({ ...v, medium: e.target.value }))} />
            <Tiny name="campaign" label="utm_campaign" value={values.campaign} onChange={(e) => setValues((v) => ({ ...v, campaign: e.target.value }))} />
            <Tiny name="content" label="utm_content" value={values.content} onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))} />
            <Tiny name="term" label="utm_term" value={values.term} onChange={(e) => setValues((v) => ({ ...v, term: e.target.value }))} />
          </div>
          <button onClick={save} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-800">
            <Save className="h-4 w-4" /> Save Template
          </button>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="font-medium mb-3">Saved Templates</div>
          <div className="space-y-2">
            {templates.length === 0 && <div className="text-sm text-neutral-600">No templates yet.</div>}
            {templates.map((t) => (
              <div key={t.id} className="border border-neutral-200 rounded-md p-3">
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-neutral-600 mt-1">
                  {Object.entries(t.values).filter(([_, v]) => v).map(([k, v]) => `${k}:${v}`).join(' · ') || 'No values'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Tiny({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-neutral-600">{label}</span>
      <input {...props} className="border border-neutral-200 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/10" />
    </label>
  );
}

function Exports({ utmLinks }) {
  const csv = useMemo(() => {
    const header = ['baseUrl','utm_source','utm_medium','utm_campaign','utm_content','utm_term','finalUrl','clicks'];
    const rows = utmLinks.map((l) => header.map((h) => (l[h] ?? '')).join(','));
    return [header.join(','), ...rows].join('\n');
  }, [utmLinks]);

  const copy = async () => {
    await navigator.clipboard.writeText(csv);
    alert('CSV copied to clipboard');
  };

  const download = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utm-links.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Section title="Exports" actions={
      <div className="flex gap-2">
        <button onClick={copy} className="px-3 py-2 rounded-md border border-neutral-200 text-sm hover:bg-neutral-50">Copy CSV</button>
        <button onClick={download} className="px-3 py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-800">Download CSV</button>
      </div>
    }>
      <div className="bg-white border border-neutral-200 rounded-xl p-4 text-sm text-neutral-600">
        Export your UTM links as CSV to share with your team or import into BI tools.
      </div>
    </Section>
  );
}

function Comparisons({ utmLinks }) {
  const channels = useMemo(() => {
    const map = new Map();
    utmLinks.forEach((l) => {
      const key = l.medium || '—';
      map.set(key, (map.get(key) || 0) + (l.clicks || 0));
    });
    return Array.from(map.entries()).map(([name, clicks]) => ({ name, clicks })).sort((a, b) => b.clicks - a.clicks);
  }, [utmLinks]);

  const max = Math.max(1, ...channels.map((c) => c.clicks));

  return (
    <Section title="Channel Comparisons">
      <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
        {channels.length === 0 && <div className="text-sm text-neutral-600">No data yet.</div>}
        {channels.map((c) => (
          <div key={c.name} className="text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="truncate pr-3">{c.name}</span>
              <span className="text-neutral-600">{c.clicks.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded">
              <div className="h-2 bg-neutral-900 rounded" style={{ width: `${(c.clicks / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Settings() {
  const [team, setTeam] = useState('Marketing Team');
  const [domain, setDomain] = useState('example.com');

  return (
    <Section title="Settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
          <div className="font-medium">Workspace</div>
          <label className="text-sm">
            <div className="text-neutral-600 mb-1">Team Name</div>
            <input value={team} onChange={(e) => setTeam(e.target.value)} className="w-full border border-neutral-200 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/10" />
          </label>
          <label className="text-sm">
            <div className="text-neutral-600 mb-1">Primary Domain</div>
            <input value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full border border-neutral-200 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/10" />
          </label>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4 text-sm text-neutral-600">
          Configure naming conventions, default parameters, and workspace details.
        </div>
      </div>
    </Section>
  );
}
