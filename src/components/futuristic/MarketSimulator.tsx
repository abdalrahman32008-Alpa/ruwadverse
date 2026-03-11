import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Users, TrendingUp, AlertTriangle, Play, RefreshCw, BarChart2, Sparkles } from 'lucide-react';

interface MarketSimulatorProps {
  ideaTitle: string;
  sector: string;
}

export const MarketSimulator: React.FC<MarketSimulatorProps> = ({ ideaTitle, sector }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [metrics, setMetrics] = useState({
    cac: 0,
    ltv: 0,
    churn: '0',
    marketShare: '0',
    timeToProfit: 0
  });

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    
    // Simulate AI processing time
    setTimeout(() => {
      setMetrics({
        cac: Math.floor(Math.random() * 50) + 15, // $15 - $65
        ltv: Math.floor(Math.random() * 500) + 150, // $150 - $650
        churn: (Math.random() * 5 + 2).toFixed(1), // 2% - 7%
        marketShare: (Math.random() * 10 + 0.5).toFixed(2), // 0.5% - 10.5%
        timeToProfit: Math.floor(Math.random() * 18) + 6 // 6 - 24 months
      });
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 3000);
  };

  return (
    <div className="bg-[#0B0C0E] border border-white/10 rounded-3xl p-6 relative overflow-hidden font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Activity className="text-[#FFD700]" />
          <h3 className="text-xl font-bold text-white tracking-wider">Traction Engine v2.0</h3>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-2">&gt; INITIALIZING MARKET SIMULATION FOR: <span className="text-white font-bold">{ideaTitle.toUpperCase()}</span></p>
        <p className="text-gray-400 text-sm mb-4">&gt; SECTOR: <span className="text-[#FFD700]">{sector.toUpperCase()}</span></p>
        
        {!isSimulating && !simulationComplete && (
          <button 
            onClick={runSimulation}
            className="flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 px-6 py-3 rounded-xl hover:bg-[#FFD700]/20 transition-colors"
          >
            <Play size={16} />
            RUN PREDICTIVE MODEL
          </button>
        )}

        {isSimulating && (
          <div className="space-y-2 text-sm text-green-400">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>&gt; Analyzing competitor landscape...</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>&gt; Calculating Customer Acquisition Cost (CAC)...</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>&gt; Projecting Lifetime Value (LTV)...</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>&gt; Simulating Year 1 Churn Rate...</motion.p>
            <div className="flex items-center gap-2 mt-4 text-[#FFD700]">
              <RefreshCw size={16} className="animate-spin" />
              <span>PROCESSING NEURAL NETWORK...</span>
            </div>
          </div>
        )}
      </div>

      {simulationComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Users size={12}/> EST. CAC</div>
            <div className="text-2xl text-white">${metrics.cac}</div>
            <div className="text-[10px] text-green-400 mt-1">Industry Avg: ${metrics.cac + 20}</div>
          </div>
          
          <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1"><TrendingUp size={12}/> EST. LTV</div>
            <div className="text-2xl text-[#FFD700]">${metrics.ltv}</div>
            <div className="text-[10px] text-gray-400 mt-1">LTV:CAC Ratio = {(metrics.ltv / metrics.cac).toFixed(1)}x</div>
          </div>
          
          <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Y1 CHURN</div>
            <div className="text-2xl text-red-400">{metrics.churn}%</div>
            <div className="text-[10px] text-gray-400 mt-1">Monthly projection</div>
          </div>

          <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1"><BarChart2 size={12}/> TIME TO PROFIT</div>
            <div className="text-2xl text-blue-400">{metrics.timeToProfit} Mo</div>
            <div className="text-[10px] text-gray-400 mt-1">Breakeven point</div>
          </div>

          <div className="col-span-2 md:col-span-4 bg-[#FFD700]/5 border border-[#FFD700]/20 p-4 rounded-xl mt-2 flex items-start gap-3">
            <Sparkles className="text-[#FFD700] shrink-0 mt-1" size={16} />
            <div>
              <div className="text-sm text-white font-bold mb-1">AI STRATEGIC INSIGHT</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Based on the LTV:CAC ratio of {(metrics.ltv / metrics.cac).toFixed(1)}x, this project shows strong unit economics. 
                However, the {metrics.churn}% churn rate suggests retention strategies must be prioritized in Q2. 
                Recommended initial marketing channel: B2B LinkedIn Outreach for {sector}.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
