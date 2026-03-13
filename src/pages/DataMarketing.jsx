import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, TrendingUp, PieChart, Activity, 
  ArrowRight, CheckCircle, Download, Calendar,
  Users, Target, Zap, Globe, Smartphone,
  Monitor, Filter, Eye, Clock, DollarSign,
  Phone, Mail, Database, LineChart, Award,
  Sparkles, ChevronRight, PlayCircle
} from 'lucide-react';

function DataMarketing() {
  const [activeMetric, setActiveMetric] = useState('reach');

  const metrics = {
    reach: {
      title: 'Reach & Impressions',
      value: '2.5M+',
      change: '+45%',
      description: 'Monthly impressions across all platforms',
      icon: <Eye className="w-6 h-6" />
    },
    engagement: {
      title: 'Engagement Rate',
      value: '8.2%',
      change: '+12%',
      description: 'Average engagement across campaigns',
      icon: <Activity className="w-6 h-6" />
    },
    conversion: {
      title: 'Conversion Rate',
      value: '3.4%',
      change: '+8%',
      description: 'Inquiry to showing conversion',
      icon: <Target className="w-6 h-6" />
    },
    speed: {
      title: 'Time to Offer',
      value: '7 Days',
      change: '-3 Days',
      description: 'Average days to first offer',
      icon: <Clock className="w-6 h-6" />
    }
  };

  const dataTools = [
    {
      title: 'Market Intelligence',
      description: 'Real-time market data and trend analysis',
      features: [
        'Comparable sales analysis',
        'Neighborhood trends',
        'Price prediction models',
        'Demographic insights'
      ],
      icon: <Database className="w-6 h-6" />
    },
    {
      title: 'Buyer Behavior Analytics',
      description: 'Deep understanding of buyer preferences',
      features: [
        'Search pattern analysis',
        'Property feature preferences',
        'Price point optimization',
        'Geographic targeting'
      ],
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Campaign Performance',
      description: 'Real-time campaign tracking and optimization',
      features: [
        'Multi-channel attribution',
        'ROI analysis',
        'A/B testing',
        'Conversion tracking'
      ],
      icon: <BarChart className="w-6 h-6" />
    },
    {
      title: 'Predictive Analytics',
      description: 'Forecast market movements and opportunities',
      features: [
        'Price trend forecasting',
        'Demand prediction',
        'Investment opportunity scoring',
        'Risk assessment'
      ],
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  const caseStudies = [
    {
      property: 'Waterfront Estate, Miami',
      challenge: 'Property sat on market for 120+ days with another agency',
      solution: 'Data analysis revealed incorrect pricing and targeting',
      result: 'Sold in 12 days at 98% of revised asking price',
      metrics: {
        views: '185K+',
        inquiries: '42',
        showings: '15'
      },
      icon: '🌊'
    },
    {
      property: 'Penthouse Collection, NYC',
      challenge: 'Multiple units needed coordinated marketing strategy',
      solution: 'Predictive analytics identified optimal pricing and timing',
      result: 'All 5 units sold in 30 days, 15% above projections',
      metrics: {
        views: '320K+',
        inquiries: '78',
        showings: '45'
      },
      icon: '🗽'
    },
    {
      property: 'Vineyard Estate, Napa Valley',
      challenge: 'Unique property required specialized buyer targeting',
      solution: 'Data modeling identified qualified buyer segments',
      result: 'Sold to international buyer at record price per acre',
      metrics: {
        views: '95K+',
        inquiries: '28',
        showings: '8'
      },
      icon: '🍷'
    }
  ];

  const platformData = [
    { platform: 'Zillow', impressions: '850K', engagement: '7.2%', cost: '$0.45/click' },
    { platform: 'Realtor.com', impressions: '620K', engagement: '6.8%', cost: '$0.52/click' },
    { platform: 'Instagram', impressions: '450K', engagement: '12.4%', cost: '$0.38/click' },
    { platform: 'Facebook', impressions: '380K', engagement: '5.9%', cost: '$0.42/click' },
    { platform: 'LinkedIn', impressions: '120K', engagement: '4.2%', cost: '$0.85/click' },
    { platform: 'YouTube', impressions: '280K', engagement: '9.1%', cost: '$0.31/view' }
  ];

  const roiMetrics = [
    {
      category: 'Marketing Spend',
      traditional: '$25K',
      dataDriven: '$22K',
      savings: '12%'
    },
    {
      category: 'Time to Sale',
      traditional: '45 Days',
      dataDriven: '7 Days',
      savings: '84%'
    },
    {
      category: 'Sale Price',
      traditional: '95% of ask',
      dataDriven: '102% of ask',
      savings: '+7%'
    },
    {
      category: 'Buyer Quality',
      traditional: '15 inquiries',
      dataDriven: '42 inquiries',
      savings: '180%'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <BarChart className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                DATA-DRIVEN MARKETING
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
              Intelligence{' '}
              <span className="text-[#F97316] font-medium">Meets</span>{' '}
              Impact
            </h1>
            <p className="text-xl md:text-2xl text-[#A1A1AA] mb-8 leading-relaxed">
              We don't guess – we analyze. Our data-driven approach transforms raw information 
              into actionable insights that deliver measurable results for every property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-xl hover:bg-[#EA580C] transition-all duration-300"
              >
                <PlayCircle className="w-5 h-5" />
                See Data in Action
              </Link>
              <button
                onClick={() => window.scrollTo({ top: document.getElementById('metrics').offsetTop, behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 bg-[#18181B] border border-[#27272A] text-white px-8 py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Download Sample Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Metrics Dashboard */}
      <section id="metrics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Activity className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              LIVE PERFORMANCE METRICS
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Real-Time{' '}
            <span className="text-[#F97316] font-medium">Intelligence</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(metrics).map(([key, metric]) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`bg-[#18181B] border ${activeMetric === key ? 'border-[#F97316]' : 'border-[#27272A]'} rounded-2xl p-6 text-left hover:border-[#F97316] transition-colors`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-[#F97316]">{metric.icon}</div>
                <span className={`text-xs font-medium ${activeMetric === key ? 'text-[#F97316]' : 'text-[#A1A1AA]'}`}>
                  {metric.change}
                </span>
              </div>
              <div className="text-3xl font-light text-white mb-1">{metric.value}</div>
              <div className="text-sm text-[#A1A1AA]">{metric.title}</div>
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-light text-white mb-2">{metrics[activeMetric].title}</h3>
              <p className="text-white/90 mb-4">{metrics[activeMetric].description}</p>
              <div className="flex items-center gap-4">
                <div className="bg-black/20 rounded-xl px-4 py-2">
                  <span className="text-white text-sm">Current: {metrics[activeMetric].value}</span>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2">
                  <span className="text-white text-sm">Trend: {metrics[activeMetric].change}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-white/70 text-sm mb-2">Industry Average</div>
              <div className="flex items-end gap-4">
                <div>
                  <div className="text-2xl text-white mb-1">
                    {activeMetric === 'reach' && '1.2M'}
                    {activeMetric === 'engagement' && '4.5%'}
                    {activeMetric === 'conversion' && '1.8%'}
                    {activeMetric === 'speed' && '45 Days'}
                  </div>
                  <div className="text-white/60 text-xs">vs Our Performance</div>
                </div>
                <div className="text-[#A1A1AA] text-sm">
                  {activeMetric === 'reach' && '+108%'}
                  {activeMetric === 'engagement' && '+82%'}
                  {activeMetric === 'conversion' && '+89%'}
                  {activeMetric === 'speed' && '-38 Days'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Database className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              OUR DATA TOOLS
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Precision{' '}
            <span className="text-[#F97316] font-medium">Analytics</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataTools.map((tool, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-6">
                <div className="text-[#F97316]">{tool.icon}</div>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{tool.title}</h3>
              <p className="text-[#A1A1AA] text-sm mb-4">{tool.description}</p>
              <ul className="space-y-2">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#F97316]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ROI Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-6">
              <DollarSign className="w-4 h-4 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-xs uppercase">
                ROI COMPARISON
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Data-Driven{' '}
              <span className="text-[#F97316] font-medium">Advantage</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8">
              Compare traditional marketing approaches with our data-driven methodology. 
              The numbers speak for themselves.
            </p>
            <div className="space-y-4">
              {roiMetrics.map((item, index) => (
                <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{item.category}</span>
                    <span className="text-[#F97316] text-sm font-medium">{item.savings}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A1A1AA]">Traditional: {item.traditional}</span>
                    <ArrowRight className="w-4 h-4 text-[#F97316]" />
                    <span className="text-white">Data-Driven: {item.dataDriven}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
            <h3 className="text-xl text-white mb-6">Key Insights</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#A1A1AA]">Marketing Efficiency</span>
                  <span className="text-[#F97316]">+127%</span>
                </div>
                <div className="w-full h-2 bg-[#27272A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#A1A1AA]">Buyer Quality</span>
                  <span className="text-[#F97316]">+180%</span>
                </div>
                <div className="w-full h-2 bg-[#27272A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#A1A1AA]">Time Savings</span>
                  <span className="text-[#F97316]">84%</span>
                </div>
                <div className="w-full h-2 bg-[#27272A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Performance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Globe className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              PLATFORM PERFORMANCE
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Multi-Channel{' '}
            <span className="text-[#F97316] font-medium">Optimization</span>
          </h2>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-[#27272A] text-sm text-[#A1A1AA] font-medium">
            <div>Platform</div>
            <div>Impressions</div>
            <div>Engagement</div>
            <div>Cost Efficiency</div>
          </div>
          {platformData.map((platform, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-6 border-b border-[#27272A] last:border-0 hover:bg-[#0A0A0A] transition-colors">
              <div className="text-white font-medium">{platform.platform}</div>
              <div className="text-[#A1A1AA]">{platform.impressions}</div>
              <div className="text-[#A1A1AA]">{platform.engagement}</div>
              <div className="text-[#F97316]">{platform.cost}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Award className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              DATA IN ACTION
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Real{' '}
            <span className="text-[#F97316] font-medium">Results</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{study.icon}</div>
              <h3 className="text-xl font-medium text-white mb-4">{study.property}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs text-[#A1A1AA] uppercase mb-1">Challenge</div>
                  <div className="text-[#A1A1AA] text-sm">{study.challenge}</div>
                </div>
                <div>
                  <div className="text-xs text-[#A1A1AA] uppercase mb-1">Solution</div>
                  <div className="text-[#A1A1AA] text-sm">{study.solution}</div>
                </div>
                <div>
                  <div className="text-xs text-[#F97316] uppercase mb-1">Result</div>
                  <div className="text-white font-medium">{study.result}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#27272A]">
                <div className="text-center">
                  <div className="text-[#F97316] text-lg font-light">{study.metrics.views}</div>
                  <div className="text-[#A1A1AA] text-xs">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-[#F97316] text-lg font-light">{study.metrics.inquiries}</div>
                  <div className="text-[#A1A1AA] text-xs">Inquiries</div>
                </div>
                <div className="text-center">
                  <div className="text-[#F97316] text-lg font-light">{study.metrics.showings}</div>
                  <div className="text-[#A1A1AA] text-xs">Showings</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Predictive Analytics Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-4">
                Predictive{' '}
                <span className="font-medium">Analytics</span>
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Our advanced algorithms analyze millions of data points to forecast market trends, 
                identify opportunities, and predict optimal pricing strategies before the competition.
              </p>
              <ul className="space-y-3">
                {[
                  'Price trend forecasting with 94% accuracy',
                  'Demand prediction by neighborhood',
                  'Investment opportunity scoring',
                  'Risk assessment and mitigation'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-5 h-5 text-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <div className="text-white/70 text-sm mb-4">Sample Prediction</div>
              <div className="text-4xl text-white font-light mb-2">+12.4%</div>
              <div className="text-white/80 mb-4">Projected price appreciation in targeted Miami neighborhoods</div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                Next 12 months
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Put Data to Work for{' '}
            <span className="text-[#F97316] font-medium">Your Property</span>
          </h2>
          <p className="text-[#A1A1AA] text-xl mb-8 max-w-2xl mx-auto">
            Let our analytics team show you how data-driven marketing can transform your results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-full hover:bg-[#EA580C] transition-colors"
            >
              <BarChart className="w-5 h-5" />
              Request Data Consultation
            </Link>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] border border-[#27272A] text-white px-8 py-4 rounded-full hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Speak With an Analyst
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              Free Data Audit
            </div>
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              No Obligation
            </div>
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              Confidential
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DataMarketing;
