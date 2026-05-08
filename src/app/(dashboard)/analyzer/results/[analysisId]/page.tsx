"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAnalysis } from '@/src/hooks/useAnalysis';
import ScoreCard from '@/components/resume/ScoreCard';
import ProgressBar from '@/components/resume/ProgressBar';
import KeywordTags from '@/components/resume/KeywordTags';
import SuggestionsList from '@/components/resume/SuggestionsList';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGenerateCoverLetterMutation } from '@/redux/api/resumeApi';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hooks';
import GeneratedCoverLetter from '@/components/cover-letter/GeneratedCoverLetter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { Copy, Download } from 'lucide-react';

export default function ResultsPage() {
  const { analysisId } = useParams();
  const router = useRouter();
  const { analysis, isLoading, error, refetch } = useAnalysis(analysisId as string);
  const [generateCoverLetter, { isLoading: isGenerating }] = useGenerateCoverLetterMutation();
  const [coverLetter, setCoverLetter] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'results' | 'cover-letter'>('results');
  const [tone, setTone] = React.useState<string>("PROFESSIONAL");
  const [length, setLength] = React.useState<string>("MEDIUM");
  const user = useAppSelector((state) => state.auth.user);

  const handleGenerateCoverLetter = async () => {
    try {
      const response = await generateCoverLetter({
        analysisId: analysisId as string,
        tone,
        length
      }).unwrap();
      setCoverLetter(response.data.content);
      setActiveTab('cover-letter');
      toast.success("Cover letter generated!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to generate cover letter");
    }
  };



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-[#6B5FD3] animate-spin" />
        <p className="text-gray-500 font-medium">Crunching your data...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="text-gray-500 font-medium">Failed to load analysis results.</p>
        <Button onClick={() => refetch()} variant="outline">Try Again</Button>
      </div>
    );
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
          <p className="text-gray-500 text-sm">Review your resume performance for <span className="text-[#6B5FD3] font-semibold">{analysis.jobTitle || "the target role"}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-[8px]"
            onClick={() => router.push('/analyzer')}
          >
            <RefreshCw className="w-4 h-4" />
            New Upload
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => router.push('/analyzer')}
          className="px-6 py-3 text-sm font-medium transition-colors relative text-gray-500 hover:text-gray-700"
        >
          Upload
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'results' ? 'text-[#6B5FD3]' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Results
          {activeTab === 'results' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B5FD3]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('cover-letter')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'cover-letter' ? 'text-[#6B5FD3]' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Cover Letter
          {activeTab === 'cover-letter' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B5FD3]" />
          )}
        </button>
      </div>

      {activeTab === 'results' ? (
        <>
          {/* Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScoreCard
              score={analysis.atsScore}
              label="ATS Score"
              color="#6B5FD3"
              subtext={getScoreStatus(analysis.atsScore)}
            />
            <ScoreCard
              score={analysis.formattingScore}
              label="Formatting"
              color="#1D9E75"
              subtext={getScoreStatus(analysis.formattingScore)}
            />
            <ScoreCard
              score={analysis.keywordScore}
              label="Keywords"
              color="#EF9F27"
              subtext={getScoreStatus(analysis.keywordScore)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Progress Bars Section */}
            <Card className="border-none shadow-sm bg-white rounded-[12px]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Match Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProgressBar
                  value={analysis.atsScore}
                  color="#6B5FD3"
                  label="ATS Compatibility"
                />
                <ProgressBar
                  value={analysis.formattingScore}
                  color="#1D9E75"
                  label="Formatting Optimization"
                />
                <ProgressBar
                  value={analysis.keywordScore}
                  color="#EF9F27"
                  label="Keyword Density"
                />
              </CardContent>
            </Card>

            {/* Keywords Section */}
            <Card className="border-none shadow-sm bg-white rounded-[12px]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Keyword Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <KeywordTags
                  foundKeywords={analysis.keywords?.foundKeywords || []}
                  missingKeywords={analysis.keywords?.missingKeywords || []}
                />
              </CardContent>
            </Card>
          </div>

          {/* Suggestions Section */}
          <Card className="border-none shadow-sm bg-white rounded-[12px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">Critical Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <SuggestionsList suggestions={analysis.suggestions || []} />
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-[12px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">Cover Letter Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="CONFIDENT">Confident</SelectItem>
                      <SelectItem value="FRIENDLY">Friendly</SelectItem>
                      <SelectItem value="CREATIVE">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Length</Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHORT">Short (~150 words)</SelectItem>
                      <SelectItem value="MEDIUM">Medium (~250 words)</SelectItem>
                      <SelectItem value="LONG">Long (~400 words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-[8px]"
                  onClick={handleGenerateCoverLetter}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  {coverLetter ? "Regenerate Letter" : "Generate Cover Letter"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {coverLetter ? (
            <GeneratedCoverLetter
              content={coverLetter}
              tone={tone}
              length={length}
              userName={user?.name || "Your Name"}
              userEmail={user?.email || "your.email@example.com"}
              companyName={analysis?.targetCompany || "The Hiring Team"}
              onRegenerate={handleGenerateCoverLetter}
              isGenerating={isGenerating}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <FileText className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Select your preferences and generate your tailored cover letter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
