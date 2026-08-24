import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Filter, ArrowRight, Layers, Globe } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/ui/Badge';

export const WatershedsList: React.FC = () => {
  const navigate = useNavigate();
  const { watersheds } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');

  const statesList = Array.from(new Set(watersheds.map((w) => w.state)));

  const filtered = watersheds.filter((w) => {
    const matchState = stateFilter === 'ALL' || w.state.toLowerCase() === stateFilter.toLowerCase();
    const matchSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.district.toLowerCase().includes(searchTerm.toLowerCase());
    return matchState && matchSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
            Watershed Management &amp; Health Register
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Directory of all monitored hydrological units, GIS boundaries, and health indices.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search watershed code, catchment name, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All States</option>
            {statesList.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Watershed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ws) => (
          <div
            key={ws.id}
            onClick={() => navigate(`/watershed/${ws.id}`)}
            className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 hover:border-emerald-500/50 hover:bg-slate-900 transition cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
                <span className="text-xs font-bold text-emerald-400 font-mono group-hover:text-emerald-300">
                  {ws.code}
                </span>
                <Badge status={ws.status} size="sm" />
              </div>

              <h3 className="text-base font-bold text-white font-mono group-hover:text-emerald-400 transition">
                {ws.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {ws.state} &bull; {ws.district} District
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Interventions</span>
                  <span className="font-bold text-white">{ws.totalInterventions} Units</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Area</span>
                  <span className="font-bold text-cyan-400">{ws.areaHa.toLocaleString()} Ha</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-xs font-mono">
                Health Score:{' '}
                <strong className={ws.healthScore >= 75 ? 'text-emerald-400' : 'text-amber-400'}>
                  {ws.healthScore}/100
                </strong>
              </span>
              <span className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Map &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
