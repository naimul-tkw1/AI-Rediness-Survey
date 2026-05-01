/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  BrainCircuit, 
  Target, 
  FileCheck, 
  ShieldAlert,
  BarChart3,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { SECTIONS, Section, Question } from './constants';

type Step = 'intro' | 'survey' | 'results';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | boolean>>({});

  const isLastSection = currentSectionIndex === SECTIONS.length - 1;
  const currentSection = SECTIONS[currentSectionIndex];

  const handleAnswer = (questionId: number, value: number | boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (currentStep === 'intro') {
      setCurrentStep('survey');
    } else if (currentStep === 'survey') {
      if (isLastSection) {
        setCurrentStep('results');
      } else {
        setCurrentSectionIndex(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 'results') {
      setCurrentStep('survey');
      setCurrentSectionIndex(SECTIONS.length - 1);
    } else if (currentStep === 'survey') {
      if (currentSectionIndex === 0) {
        setCurrentStep('intro');
      } else {
        setCurrentSectionIndex(prev => prev - 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const resetSurvey = () => {
    setAnswers({});
    setCurrentStep('intro');
    setCurrentSectionIndex(0);
    window.scrollTo(0, 0);
  };

  const totals = useMemo(() => {
    const scores = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      CD: 0,
      complianceFlags: { pii: false, decision: false, bias: false }
    };

    SECTIONS.forEach(section => {
      section.questions.forEach(q => {
        const val = answers[q.id];
        if (typeof val === 'number') {
          if (section.id === 'A') scores.A += val;
          if (section.id === 'B') scores.B += val;
          if (section.id === 'C') scores.C += val;
          if (section.id === 'D') scores.D += val;
        } else if (typeof val === 'boolean' && section.id === 'E') {
          if (q.id === 16) scores.complianceFlags.pii = val;
          if (q.id === 17) scores.complianceFlags.decision = val;
          if (q.id === 18) scores.complianceFlags.bias = val;
        }
      });
    });

    scores.CD = scores.C + scores.D;
    return scores;
  }, [answers]);

  const interpretations = useMemo(() => {
    return {
      A: totals.A >= 4 ? 'High' : totals.A >= 2 ? 'Moderate' : 'Low',
      B: totals.B >= 14 ? 'High' : totals.B >= 8 ? 'Moderate' : 'Low',
      CD: totals.CD >= 5 ? 'High' : totals.CD >= 3 ? 'Moderate' : 'Low',
      complianceClear: !totals.complianceFlags.pii && !totals.complianceFlags.decision && !totals.complianceFlags.bias
    };
  }, [totals]);

  const strategicRecommendation = useMemo(() => {
    const { A, B, CD, complianceClear } = interpretations;

    if (A === 'High' && B === 'High' && CD === 'High' && complianceClear) {
      return {
        title: 'Prime candidate',
        text: 'This is an excellent project to proceed with, subject to completing any required PIA or AIA processes.',
        recommendation: 'Review the GC AI register and consult with colleagues to determine if there are other similar AI projects you could re-use or adapt.',
        color: 'bg-green-50 border-green-200 text-green-800'
      };
    }

    if (A === 'High' && B === 'High' && (CD !== 'High' || !complianceClear)) {
      return {
        title: 'High potential, but action required',
        text: 'This is a great idea, but foundational work such as identifying and correcting data inaccuracies is required.',
        recommendation: 'Pause and resolve any process and data work before proceeding. Begin mandatory processes (PIA, AIA) where necessary.',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
      };
    }

    if (A === 'High' && B === 'Low' && CD !== 'Low') {
      return {
        title: 'High potential but lower priority',
        text: 'The project has potential but will not solve a high-priority problem.',
        recommendation: 'Pause. Flag as a developmental opportunity for those who are trying to develop a skillset. A low-risk way to build capacity.',
        color: 'bg-blue-50 border-blue-200 text-blue-800'
      };
    }

    if (A === 'Moderate' || B === 'Moderate') {
      return {
        title: 'Moderate candidate',
        text: 'This project has potential but requires a strong business case.',
        recommendation: 'Pause. Consider a small-scale pilot to better evaluate benefits or reassess the problem with a different AI solution.',
        color: 'bg-indigo-50 border-indigo-200 text-indigo-800'
      };
    }

    return {
      title: 'Low priority; re-evaluate',
      text: 'The task may not be right for AI, or the problem may not be big enough to solve.',
      recommendation: 'Pivot and consider simpler, non-AI process improvements first.',
      color: 'bg-red-50 border-red-200 text-red-800'
    };
  }, [interpretations]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Demo Warning Banner */}
      <div id="demo-banner" className="bg-red-700 text-white py-2 px-4 text-center text-sm font-medium sticky top-0 z-50 shadow-md">
        <span className="flex items-center justify-center gap-2">
          <AlertTriangle size={16} />
          UNOFFICIAL DEMO - This tool is for demonstration purposes only. Refer to official Government of Canada resources for actual assessments.
        </span>
      </div>

      {/* Header */}
      <header id="app-header" className="bg-white border-b border-slate-200 py-6 px-4 mb-8 sticky top-9 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#D30C15] p-2 rounded-lg text-white shadow-sm">
              <BrainCircuit size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">AI Readiness Scorecard</h1>
              <p className="text-sm text-slate-500 font-medium">Job aid: DDN3-J05 | Digital Discovery Tool</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={resetSurvey}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
              id="intro-page"
            >
              <div className="p-8 md:p-12 space-y-12">
                <section className="space-y-4">
                  <h2 className="text-3xl font-extrabold text-slate-900 border-b-4 border-[#D30C15] inline-block pb-2">Welcome</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    This tool helps you assess whether a specific problem or friction point is a strong candidate for an artificial intelligence (AI)-based solution.
                  </p>
                  <p className="text-slate-600">
                    AI refers to a broad range of technologies that can perform tasks typically associated with cognitive functions of humans, such as recognition, learning, and logical reasoning.
                  </p>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  <div id="who-is-it-for" className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-[#D30C15]">
                      <Target size={20} /> Who is this for?
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      For teams in early stages of exploring an AI-based solution who want a structured, evidence-based approach to discovery and planning.
                    </p>
                  </div>

                  <div id="why-use-it" className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-[#D30C15]">
                      <Info size={20} /> Why use it?
                    </h3>
                    <ul className="text-slate-600 text-sm space-y-2 list-disc pl-4">
                      <li>Move beyond vague "symptoms" to data-backed diagnosis.</li>
                      <li>Ensure AI is the right tool, not just a trendy solution.</li>
                      <li>Build a powerful business case for leadership support.</li>
                    </ul>
                  </div>
                </div>

                <section className="bg-[#1a2b4b] text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                       <Target size={24} className="text-[#D30C15]" /> The Objective
                    </h3>
                    <p className="opacity-90 max-w-2xl text-lg italic">
                      "By the end, you will have a clear profile of your AI opportunity, allowing you to proceed, pivot, or pause with confidence."
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BrainCircuit size={120} />
                  </div>
                </section>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileCheck size={20} /> How to use it?
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { step: 1, text: "Focus on a single, specific problem." },
                      { step: 2, text: "Complete each of the five sections." },
                      { step: 3, text: "Provide an honest assessment." },
                      { step: 4, text: "Use final scores to facilitate strategy." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center p-4">
                        <div className="w-10 h-10 rounded-full bg-[#D30C15] text-white flex items-center justify-center font-bold mb-3">
                          {item.step}
                        </div>
                        <p className="text-sm font-medium text-slate-700">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-8 border-t border-slate-100">
                  <button 
                    onClick={nextStep}
                    className="bg-[#D30C15] hover:bg-red-800 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-red-200 transition-all hover:scale-105 flex items-center gap-2 active:scale-95"
                  >
                    Start Assessment <ChevronRight />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'survey' && (
            <motion.div
              key={currentSection.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
              id={`section-${currentSection.id}`}
            >
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 gap-4">
                {SECTIONS.map((s, idx) => (
                  <div key={s.id} className="flex items-center gap-2 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 
                      ${idx === currentSectionIndex ? 'bg-[#D30C15] border-[#D30C15] text-white' : 
                        idx < currentSectionIndex ? 'bg-green-100 border-green-500 text-green-600' : 'bg-white border-slate-300 text-slate-400'}`}>
                      {idx < currentSectionIndex ? <CheckCircle2 size={20} /> : s.id}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider hidden sm:inline ${idx === currentSectionIndex ? 'text-slate-800' : 'text-slate-400'}`}>
                      Section {s.id}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-[#1a2b4b] p-6 text-white">
                  <h2 className="text-2xl font-bold">{currentSection.title}</h2>
                  <p className="text-slate-300 font-medium italic">{currentSection.subtitle}</p>
                </div>
                
                <div className="p-8">
                  <p className="text-slate-600 mb-10 pb-6 border-b border-slate-100">
                    {currentSection.description}
                  </p>

                  <div className="space-y-12">
                    {currentSection.questions.map((q) => (
                      <div key={q.id} className="space-y-4" id={`question-${q.id}`}>
                        <div className="flex gap-4">
                          <span className="font-bold text-slate-300 text-lg">{q.id}.</span>
                          <div className="space-y-1 flex-1">
                            <p className="text-lg font-bold text-slate-800 leading-tight">{q.text}</p>
                            {q.description && <p className="text-sm text-slate-500 italic">{q.description}</p>}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pl-8">
                          {q.type === 'binary' && (
                            <>
                              <button
                                onClick={() => handleAnswer(q.id, 1)}
                                className={`px-8 py-3 rounded-xl font-bold transition-all border-2 ${answers[q.id] === 1 ? 'bg-[#D30C15] border-[#D30C15] text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                              >
                                Yes (1)
                              </button>
                              <button
                                onClick={() => handleAnswer(q.id, 0)}
                                className={`px-8 py-3 rounded-xl font-bold transition-all border-2 ${answers[q.id] === 0 ? 'bg-[#D30C15] border-[#D30C15] text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                              >
                                No (0)
                              </button>
                            </>
                          )}

                          {q.type === 'scale' && (
                            <div className="w-full max-w-xs space-y-2">
                              <div className="flex justify-between w-full">
                                {[1, 2, 3, 4, 5].map(val => (
                                  <button
                                    key={val}
                                    onClick={() => handleAnswer(q.id, val)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all border-2 
                                      ${answers[q.id] === val ? 'bg-[#D30C15] border-[#D30C15] text-white shadow-lg scale-110' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                  >
                                    {val}
                                  </button>
                                ))}
                              </div>
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                <span>Low Impact</span>
                                <span>High Impact</span>
                              </div>
                            </div>
                          )}

                          {q.type === 'compliance' && (
                            <>
                              <button
                                onClick={() => handleAnswer(q.id, true)}
                                className={`px-8 py-3 rounded-xl font-bold transition-all border-2 ${answers[q.id] === true ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => handleAnswer(q.id, false)}
                                className={`px-8 py-3 rounded-xl font-bold transition-all border-2 ${answers[q.id] === false ? 'bg-green-500 border-green-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                              >
                                No
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-between gap-4">
                  <button 
                    onClick={prevStep}
                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2"
                  >
                    <ChevronLeft /> Back
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={currentSection.questions.some(q => answers[q.id] === undefined)}
                    className="bg-[#D30C15] hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                  >
                    {isLastSection ? 'View Results' : 'Next Section'} <ChevronRight />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
              id="results-page"
            >
              {/* Strategic Recommendation Callout */}
              <section className={`p-8 rounded-2xl border-4 shadow-2xl ${strategicRecommendation.color} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                   <BarChart3 size={160} />
                </div>
                <div className="relative z-10 space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-60">Your Strategic Recommendation</h2>
                  <h3 className="text-4xl font-extrabold tracking-tight">{strategicRecommendation.title}</h3>
                  <p className="text-xl leading-relaxed opacity-90 font-medium">
                    {strategicRecommendation.text}
                  </p>
                  <div className="bg-white/40 backdrop-blur-sm p-6 rounded-xl border border-black/5 flex gap-4 mt-6">
                    <Info className="shrink-0 mt-1" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-wider text-slate-700">Recommended Action:</p>
                      <p className="text-lg font-bold">{strategicRecommendation.recommendation}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Subtotal Scores Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h4 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                       <BarChart3 size={14} className="text-[#D30C15]" /> Section A: AI Fit
                    </h4>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-black text-slate-800">{totals.A}</span>
                      <span className="text-xl text-slate-400 font-bold">/ 5</span>
                    </div>
                    <p className={`text-lg font-bold ${interpretations.A === 'High' ? 'text-green-600' : 'text-slate-700'}`}>
                      {interpretations.A} Score
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100 italic text-sm text-slate-500">
                    {interpretations.A === 'High' ? 'Proceed. The task is an appropriate fit for AI.' : 
                     interpretations.A === 'Moderate' ? 'Pause. The task is a partial fit.' : 
                     'Pivot. The task is not a good fit for AI.'}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h4 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                       <BarChart3 size={14} className="text-[#D30C15]" /> Section B: Pain Point
                    </h4>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-black text-slate-800">{totals.B}</span>
                      <span className="text-xl text-slate-400 font-bold">/ 20</span>
                    </div>
                    <p className={`text-lg font-bold ${interpretations.B === 'High' ? 'text-green-600' : 'text-slate-700'}`}>
                      {interpretations.B} Score
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100 italic text-sm text-slate-500">
                    {interpretations.B === 'High' ? 'Problem is severe and justifies major investment.' : 
                     interpretations.B === 'Moderate' ? 'Problem is a known inconvenience.' : 
                     'Problem impact is minimal.'}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 md:col-span-2">
                  <h4 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                     <BarChart3 size={14} className="text-[#D30C15]" /> Quality Scores (C + D)
                  </h4>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-800">{totals.CD}</span>
                        <span className="text-xl text-slate-400 font-bold">/ 6</span>
                      </div>
                      <p className={`text-xl font-bold ${interpretations.CD === 'High' ? 'text-green-600' : 'text-slate-700'}`}>
                        {interpretations.CD} Score
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[120px]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Process (C)</p>
                        <p className="text-2xl font-black text-slate-700">{totals.C}/3</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[120px]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Data (D)</p>
                        <p className="text-2xl font-black text-slate-700">{totals.D}/3</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-100 italic text-slate-600 leading-relaxed">
                    {interpretations.CD === 'High' ? 'Proceed. Your project has a solid foundation.' : 
                     interpretations.CD === 'Moderate' ? 'Pause. Some foundational work (e.g., process cleanup) is needed.' : 
                     'Pivot. Significant foundational work is required before deployment.'}
                  </div>
                </div>
              </div>

              {/* Compliance Checkups */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden" id="compliance-results">
                <div className="bg-[#1a2b4b] p-6 text-white flex items-center gap-3">
                  <ShieldAlert className="text-white" />
                  <h3 className="text-xl font-bold">Compliance & Ethics Review</h3>
                </div>
                <div className="p-8 space-y-6">
                  {totals.complianceFlags.pii || totals.complianceFlags.decision ? (
                    <div className="flex gap-4 p-5 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                      <AlertTriangle className="text-orange-600 shrink-0" />
                      <div className="space-y-2">
                        <p className="font-bold text-orange-900">Formal Compliance Process Required</p>
                        <p className="text-sm text-orange-800">
                          {totals.complianceFlags.pii && "• Privacy Impact Assessment (PIA) is mandatory for PII processing. "}
                          {totals.complianceFlags.decision && "• Algorithmic Impact Assessment (AIA) is mandatory for automated decisions."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 p-5 bg-green-50 border-l-4 border-green-500 rounded-lg">
                      <CheckCircle2 className="text-green-600 shrink-0" />
                      <p className="font-bold text-green-900">Standard compliance checks cleared.</p>
                    </div>
                  )}

                  {totals.complianceFlags.bias && (
                    <div className="flex gap-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                      <AlertTriangle className="text-red-600 shrink-0" />
                      <div className="space-y-2">
                        <p className="font-bold text-red-900">Significant Ethical Risk Detected</p>
                        <p className="text-sm text-red-800">
                          Data bias or accountability implications must be addressed through a formal mitigation plan.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 pt-12 border-t border-slate-200 text-center">
                 <div className="space-y-2">
                   <p className="text-slate-500 font-medium">To learn more about Government of Canada AI policy:</p>
                   <a 
                    href="https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32592" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#D30C15] font-bold hover:underline flex items-center justify-center gap-1"
                   >
                     Directive on Automated Decision-Making <ExternalLink size={14} />
                   </a>
                 </div>
                 <div className="flex gap-4">
                  <button 
                    onClick={prevStep}
                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    Review Answers
                  </button>
                  <button 
                    onClick={resetSurvey}
                    className="bg-slate-900 hover:bg-black text-white px-10 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                  >
                    Start New Assessment
                  </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-20 text-center text-slate-400 text-xs border-t border-slate-200 pt-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="font-bold flex items-center gap-2">Canada School of Public Service</span>
            <span className="w-px h-4 bg-slate-300"></span>
            <span className="font-bold">École de la fonction publique du Canada</span>
          </div>
          <p>© 2026 Government of Canada Interactive Resource (Demo Edition)</p>
        </div>
      </footer>
    </div>
  );
}
