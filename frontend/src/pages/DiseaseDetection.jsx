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
        disease: 'Early Blight',
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
    <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Camera size={36} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Plant Disease Detection</h1>
              <p className="text-sm text-red-100 mt-1">Upload a photo of an infected leaf for instant AI diagnosis and treatment.</p>
            </div>
          </div>
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Leaf size={200} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Image Upload</h3>
            
            <div 
              {...getRootProps()} 
              className={`flex-1 border-2 border-dashed rounded-xl flex items-center justify-center p-6 transition-colors cursor-pointer min-h-[250px]
                ${isDragActive ? 'border-farm-green bg-green-50' : 'border-gray-300 hover:border-farm-green hover:bg-gray-50'}
              `}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={preview} alt="Plant" className="max-h-64 object-contain rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                    <p className="text-white font-bold flex items-center gap-2">
                       <Upload size={20} /> Click to change image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Upload size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="font-semibold text-gray-600">Drag & drop a leaf image here</p>
                  <p className="text-sm mt-1">or click to select file</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={!file || loading} 
              className={`w-full font-bold py-3 px-4 rounded-xl transition duration-200 shadow-sm flex justify-center items-center gap-2
                ${!file ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-farm-green hover:bg-green-800 text-white'}
              `}
            >
              {loading ? (
                 <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <><Bug size={20} /> Analyze Disease</>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="h-full">
            {result ? (
              <div className={`p-8 rounded-2xl shadow-lg border-2 animate-in fade-in slide-in-from-bottom-4 bg-white
                ${result.isHealthy ? 'border-farm-green' : 'border-red-500'}
              `}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-full ${result.isHealthy ? 'bg-green-100 text-farm-green' : 'bg-red-100 text-red-500'}`}>
                    {result.isHealthy ? <CheckCircle size={36} /> : <AlertCircle size={36} />}
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium text-sm">Diagnosis Result</p>
                    <h2 className={`text-2xl font-display font-bold ${result.isHealthy ? 'text-farm-green' : 'text-red-600'}`}>
                      {result.disease}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 mt-1">{result.confidence} Confidence</p>
                  </div>
                </div>

                {!result.isHealthy && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                      <p className="text-sm text-orange-800 font-bold mb-1 flex items-center gap-1"><Bug size={16} /> Cause</p>
                      <p className="text-gray-700 text-sm">{result.details.cause}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-sm text-farm-green font-bold mb-1 flex items-center gap-1"><Droplets size={16} /> Recommended Treatment</p>
                      <p className="text-gray-700 text-sm">{result.details.cure}</p>
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs font-bold text-gray-500 uppercase">Chemical Control</p>
                        <p className="text-farm-green font-semibold">{result.details.pesticide}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-800 font-bold mb-1 flex items-center gap-1"><Leaf size={16} /> Prevention</p>
                      <p className="text-gray-700 text-sm">{result.details.prevention}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/50 border border-dashed border-gray-300 rounded-2xl h-full flex flex-col items-center justify-center text-gray-400 p-12 min-h-[400px]">
                <Bug size={64} className="mb-4 text-gray-300" />
                <p className="text-center">Upload an image of your crop's leaf and hit "Analyze" to detect diseases instantly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
