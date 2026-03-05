import React, { useState, useEffect } from 'react';
import { FileText, Lock, Download, EyeOff, ShieldAlert, Trash2 } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { storeSecureFile, getSecureFile, getAllSecureFiles, deleteSecureFile } from '../services/db';

export default function SecurePDFViewer() {
  const [downloadedFiles, setDownloadedFiles] = useState<any[]>([]);
  const [viewingFile, setViewingFile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const files = await getAllSecureFiles();
    setDownloadedFiles(files);
  };

  const handleDownload = async (id: string, name: string, url: string) => {
    setIsLoading(true);
    try {
      // In a real app, fetch from actual URL. Here we mock a blob.
      const mockContent = `
        %PDF-1.4
        1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
        2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
        3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
        4 0 obj << /Length 50 >> stream
        BT /F1 24 Tf 100 700 Td (Secure Content: ${name}) Tj ET
        endstream
        endobj
        xref
        0 5
        0000000000 65535 f
        0000000010 00000 n
        0000000060 00000 n
        0000000117 00000 n
        0000000220 00000 n
        trailer << /Size 5 /Root 1 0 R >>
        startxref
        320
        %%EOF
      `;
      const blob = new Blob([mockContent], { type: 'application/pdf' });
      
      await storeSecureFile(id, name, blob);
      await loadFiles();
      alert('ফাইলটি সুরক্ষিতভাবে ডাউনলোড করা হয়েছে। ইন্টারনেট ছাড়াই এটি পড়া যাবে।');
    } catch (error) {
      console.error('Download failed:', error);
      alert('ডাউনলোড ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async (id: string) => {
    const file = await getSecureFile(id);
    if (file) {
      setViewingFile(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ফাইলটি মুছে ফেলতে চান?')) {
      await deleteSecureFile(id);
      await loadFiles();
    }
  };

  if (viewingFile) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col h-screen">
        {/* Secure Viewer Header */}
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-emerald-400" />
            <span className="font-medium">{viewingFile.name} (Secure View)</span>
          </div>
          <button 
            onClick={() => setViewingFile(null)}
            className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

        {/* PDF Content Simulation */}
        <div className="flex-1 overflow-auto p-4 bg-slate-500 flex justify-center relative select-none">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-10 overflow-hidden">
             <div className="rotate-45 text-4xl font-bold text-slate-900 whitespace-nowrap">
               CONFIDENTIAL • PROGGA ACADEMIC CARE • DO NOT SHARE
             </div>
          </div>

          <div className="bg-white w-full max-w-2xl min-h-[80vh] shadow-2xl p-12 relative">
             <h1 className="text-3xl font-bold text-slate-900 mb-6">{viewingFile.name}</h1>
             <p className="text-slate-700 leading-relaxed mb-4">
               এটি একটি সুরক্ষিত ডকুমেন্ট। এই ফাইলটি শুধুমাত্র অ্যাপের অভ্যন্তরীণ স্টোরেজে সংরক্ষিত আছে।
             </p>
             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 mb-6">
               অফলাইন মোড সক্রিয়: এই ফাইলটি ইন্টারনেট সংযোগ ছাড়াই পড়া যাবে।
             </div>
             
             <h2 className="text-xl font-bold text-slate-800 mb-3">বিষয়বস্তু</h2>
             <p className="text-slate-700 leading-relaxed">
               [এখানে পিডিএফ এর মূল বিষয়বস্তু প্রদর্শিত হবে...]
               <br/><br/>
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
             </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="bg-red-900/90 text-white/90 text-xs p-2 text-center flex items-center justify-center gap-2">
          <ShieldAlert size={12} />
          <span>স্ক্রিনশট এবং শেয়ারিং নিষ্ক্রিয় করা হয়েছে</span>
        </div>
      </div>
    );
  }

  const AVAILABLE_FILES = [
    { id: 'doc_1', name: 'Physics_Chapter_5.pdf', size: '2.4 MB', date: 'Today' },
    { id: 'doc_2', name: 'Math_Formula_Sheet.pdf', size: '1.1 MB', date: 'Yesterday' },
    { id: 'doc_3', name: 'Biology_Notes_Final.pdf', size: '3.5 MB', date: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <FileText className="text-blue-600" />
        সুরক্ষিত নোটস লাইব্রেরি
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {AVAILABLE_FILES.map(file => {
          const isDownloaded = downloadedFiles.some(f => f.id === file.id);
          
          return (
            <Card key={file.id} className="p-4 flex items-center justify-between group hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{file.name}</h3>
                  <p className="text-xs text-slate-500">Size: {file.size} • Uploaded: {file.date}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {isDownloaded ? (
                  <>
                    <button 
                      onClick={() => handleView(file.id)}
                      className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <EyeOff size={16} />
                      <span className="hidden sm:inline">পড়ুন</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(file.id)}
                      className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleDownload(file.id, file.name, 'https://example.com')}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">ডাউনলোড</span>
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex gap-3">
        <Lock className="shrink-0 mt-0.5" size={16} />
        <p>
          এই ফাইলগুলো এনক্রিপ্ট করা এবং শুধুমাত্র অ্যাপের মধ্যেই খোলা যাবে। ফাইল ম্যানেজার বা গ্যালারিতে এগুলো দেখা যাবে না।
        </p>
      </div>
    </div>
  );
}
