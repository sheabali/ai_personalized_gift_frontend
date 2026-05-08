"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Upload, FileText, Building2, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUploadResumeMutation, useAnalyzeResumeMutation } from "@/redux/api/resumeApi";

const formSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  targetCompany: z.string().min(2, "Target company is required"),
  jobDescription: z.string().min(10, "Please provide a more detailed job description"),
});

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
  const [analyzeResume, { isLoading: isAnalyzing }] = useAnalyzeResumeMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      targetCompany: "",
      jobDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      toast.error("Please upload your resume first");
      return;
    }

    try {
      // 1. Upload Resume
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobTitle", values.jobTitle);
      formData.append("targetCompany", values.targetCompany);

      const uploadResponse = await uploadResume(formData).unwrap();
      const analysisId = uploadResponse.data.analysisId;

      // 2. Start Analysis
      await analyzeResume({
        analysisId,
        jobDescription: values.jobDescription
      }).unwrap();

      toast.success("Analysis complete!");
      router.push(`/analyzer/results/${analysisId}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.data?.message || "Failed to analyze resume");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Resume Analyzer</h1>
        <p className="text-gray-500">Upload your resume and get detailed ATS analysis and job match scores.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors ${file ? "border-[#6B5FD3] bg-[#6B5FD3]/5" : "border-gray-200 hover:border-[#6B5FD3]/50"
              }`}
          >
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center cursor-pointer space-y-2"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${file ? "bg-[#6B5FD3] text-white" : "bg-gray-100 text-gray-400"}`}>
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-gray-700">
                  {file ? file.name : "Click to upload or drag and drop"}
                </span>
                <p className="text-xs text-gray-400">PDF (Max 5MB)</p>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#6B5FD3]" />
                    Job Title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} className="rounded-[8px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#6B5FD3]" />
                    Target Company
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Google" {...field} className="rounded-[8px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6B5FD3]" />
                  Job Description
                </FormLabel>
                <FormControl>
                  <textarea
                    className="w-full min-h-[150px] p-3 rounded-[8px] border border-gray-200 focus:ring-2 focus:ring-[#6B5FD3]/20 focus:border-[#6B5FD3] outline-none text-sm transition-all"
                    placeholder="Paste the job description here for better matching analysis..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isUploading || isAnalyzing}
            className="w-full h-12 bg-[#6B5FD3] hover:bg-[#5A4FC1] text-white rounded-[10px] font-bold text-base transition-all"
          >
            {(isUploading || isAnalyzing) ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {isUploading ? "Uploading Resume..." : "Analyzing Match..."}
              </>
            ) : (
              "Analyze Resume"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
