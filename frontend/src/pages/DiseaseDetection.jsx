import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { Bug, Camera, Upload, AlertCircle, CheckCircle, Droplets, Leaf } from 'lucide-react';

const DiseaseDetection = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleAnalyze = () => {
    if (!file) return;
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setResult({
        disease: 'EARLY BLIGHT',
        isHealthy: false,
        confidence: '92.5%',
        details: {
          disease: "Early Blight",
          cause: "Alternaria solani fungus",
          cure: "Apply copper-based fungicide. Remove infected leaves immediately.",
          pesticide: "Mancozeb 75% WP @ 2g/L",
          prevention: "Avoid overhead irrigation. Crop rotation recommended."
        }
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen hex-bg p-4 lg:p-8" style={{ background: '#0A0A0F' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div style={{
          background: 'linear-gradient(90deg, #1A0500 0%, transparent 100%)',
          borderBottom: '1px solid #FF003366',
          padding: '24px 32px', position: 'relative', overflow: 'hidden'
        }}>
          <div className="relative z-10 flex items-center gap-6">
            <div style={{
              background: '#FF003322', border: '1px solid #FF0033', padding: '12px', borderRadius: 2,
              boxShadow: '0 0 15px #FF003344', color: '#FF0033'
            }}>
              <Camera size={36} className="flicker" />
            </div>
            <div>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#FF003388', fontSize: 11, letterSpacing: 3, margin: '0 0 4px' }}>
                // MAGI SENSOR GRID
              </p>
              <h1 className="text-3xl font-bold uppercase glitch-text" style={{ fontFamily: "'Orbitron', sans-serif", color: '#FF0033', letterSpacing: 4, textShadow: '0 0 20px #FF003366', margin: 0 }}>
                BIOLOGICAL THREAT DETECTION
              </h1>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#FF6600', fontSize: 13, marginTop: 8, letterSpacing: 1 }}>
                UPLOAD VISUAL DATA FOR IMMEDIATE AI DIAGNOSIS
              </p>
            </div>
          </div>
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 filter sepia hue-rotate-[-50deg] saturate-200">
            <Leaf size={200} color="#FF0033" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-6">
          
          {/* Upload Section */}
          <div className="nge-card flex flex-col h-full" data-label="// VISUAL DATA INPUT" style={{ padding: '24px' }}>
            <p style={{ fontFamily: "'Orbitron', sans-serif", color: '#FF6600', fontSize: 16, fontWeight: 700, letterSpacing: 3, margin: '0 0 16px', textShadow: '0 0 10px #FF660044' }}>
              IMAGE UPLOAD
            </p>
            
            <div 
              {...getRootProps()} 
              className="flex-1 border border-dashed flex items-center justify-center p-6 cursor-pointer min-h-[250px] transition-all duration-300 nge-hover"
              style={{
                borderColor: isDragActive ? '#00FF41' : '#FF660066',
                background: isDragActive ? '#00FF4111' : '#0D0D1A',
                borderRadius: 2
              }}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={preview} alt="Plant" className="max-h-64 object-contain" style={{ border: '1px solid #FF660044', borderRadius: 2 }} />
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ borderRadius: 2 }}>
                    <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#FF6600', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                       <Upload size={18} /> CLICK TO OVERRIDE IMAGE
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  <Upload size={48} className="mx-auto mb-4" color={isDragActive ? '#00FF41' : '#FF660066'} />
                  <p style={{ fontWeight: 700, color: isDragActive ? '#00FF41' : '#FF6600', fontSize: 14 }}>DROP VISUAL DATA HERE</p>
                  <p style={{ fontSize: 11, color: '#666680', marginTop: 4 }}>OR CLICK TO BROWSE LOCAL ARCHIVE</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={!file || loading} 
              className="w-full font-bold py-4 px-4 mt-6 uppercase transition-all duration-300 shadow-sm flex justify-center items-center gap-2 border"
              style={{
                background: (!file || loading) ? '#0A0A0F' : '#FF660022',
                borderColor: (!file || loading) ? '#FF660044' : '#FF6600',
                color: (!file || loading) ? '#FF660066' : '#FF6600',
                cursor: (!file || loading) ? 'not-allowed' : 'pointer',
                fontFamily: "'Orbitron', sans-serif", letterSpacing: 3, borderRadius: 2
              }}
              onMouseEnter={e => { if(file && !loading) { e.target.style.background = '#FF660044'; e.target.style.boxShadow = '0 0 20px #FF660066'; } }}
              onMouseLeave={e => { if(file && !loading) { e.target.style.background = '#FF660022'; e.target.style.boxShadow = 'none'; } }}
            >
              {loading ? (
                <span style={{ fontFamily: "'Share Tech Mono', monospace", color: '#FF6600', textShadow: '0 0 10px #FF6600' }} className="flicker">PROCESSING SCANS...</span>
              ) : (
                <><Bug size={18} /> INITIATE SCAN ▻</>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="h-full">
            {result ? (
              <div className="nge-card animate-in fade-in fill-mode-forwards" data-label="// DIAGNOSIS RESULT" style={{
                padding: '32px 24px',
                borderColor: result.isHealthy ? '#00FF41' : '#FF0033',
                background: result.isHealthy ? '#00FF410a' : '#FF00330a',
                boxShadow: `0 0 20px ${result.isHealthy ? '#00FF4122' : '#FF003322'}`
              }}>
                <div className="flex items-center gap-6 mb-8 border-b pb-6" style={{ borderColor: result.isHealthy ? '#00FF4144' : '#FF003344' }}>
                  <div style={{
                    padding: '16px', borderRadius: 2,
                    background: result.isHealthy ? '#00FF4122' : '#FF003322',
                    color: result.isHealthy ? '#00FF41' : '#FF0033',
                    border: `1px solid ${result.isHealthy ? '#00FF41' : '#FF0033'}`,
                    boxShadow: `0 0 15px ${result.isHealthy ? '#00FF4166' : '#FF003366'}`
                  }}>
                    {result.isHealthy ? <CheckCircle size={40} /> : <AlertCircle size={40} className="flicker" />}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: result.isHealthy ? '#00FF4188' : '#FF003388', letterSpacing: 2, margin: '0 0 4px' }}>
                      // THREAT LEVEL
                    </p>
                    <h2 className="text-3xl font-bold uppercase glitch-text" style={{
                      fontFamily: "'Orbitron', sans-serif",
                      color: result.isHealthy ? '#00FF41' : '#FF0033',
                      textShadow: `0 0 15px ${result.isHealthy ? '#00FF4188' : '#FF003388'}`,
                      margin: 0, letterSpacing: 2
                    }}>
                      {result.disease}
                    </h2>
                    <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#00FFFF', marginTop: 6, letterSpacing: 1 }}>
                      CONFIDENCE: {result.confidence}
                    </p>
                  </div>
                </div>

                {!result.isHealthy && (
                  <div className="space-y-4">
                    {/* Cause */}
                    <div style={{ background: '#1A0A00', padding: '16px', border: '1px solid #FF660066', borderRadius: 2, borderLeft: '4px solid #FF6600' }}>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#FF6600', fontSize: 12, fontWeight: 700, margin: '0 0 6px', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Bug size={14} /> CAUSE IDENTIFIED
                      </p>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#E8E8E8', fontSize: 13, margin: 0 }}>
                        {result.details.cause.toUpperCase()}
                      </p>
                    </div>

                    {/* Treatment */}
                    <div style={{ background: '#0A1A0A', padding: '16px', border: '1px solid #00FF4166', borderRadius: 2, borderLeft: '4px solid #00FF41' }}>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#00FF41', fontSize: 12, fontWeight: 700, margin: '0 0 6px', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Droplets size={14} /> RECOMMENDED TREATMENT
                      </p>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#E8E8E8', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                        {result.details.cure.toUpperCase()}
                      </p>
                      <div className="mt-4 pt-4 border-t border-[#00FF4133]">
                        <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#00FF4188', fontSize: 10, letterSpacing: 2, margin: '0 0 4px' }}>CHEMICAL PROTOCOL</p>
                        <p style={{ fontFamily: "'Rajdhani', sans-serif", color: '#00FFFF', fontSize: 15, fontWeight: 600, margin: 0, letterSpacing: 1 }}>
                          {result.details.pesticide.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Prevention */}
                    <div style={{ background: '#0D0D1A', padding: '16px', border: '1px solid #00FFFF66', borderRadius: 2, borderLeft: '4px solid #00FFFF' }}>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#00FFFF', fontSize: 12, fontWeight: 700, margin: '0 0 6px', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Leaf size={14} /> PREVENTION PROTOCOLS
                      </p>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#E8E8E8', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                        {result.details.prevention.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="nge-card border border-dashed flex flex-col items-center justify-center p-12 min-h-[440px]" data-label="// AWAITING DATA" style={{ background: '#0A0A0F', borderColor: '#FF660044' }}>
                <Bug size={64} color="#FF660022" className="mb-6" />
                <p style={{ fontFamily: "'Share Tech Mono', monospace", color: '#FF660088', textAlign: 'center', fontSize: 13, letterSpacing: 1, lineHeight: 1.6 }}>
                  SYSTEM IDLE. <br/>UPLOAD LEAF IMAGERY AND INITIATE SCAN FOR PATHOGEN ANALYSIS.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
