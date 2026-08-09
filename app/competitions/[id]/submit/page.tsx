'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Info,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ImageUploader } from '@/components/forms/ImageUploader';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';
import {
  MOCK_COMPETITIONS,
  MOCK_SUBMISSIONS,
  CURRENT_USER,
} from '@/lib/mock-data';

export default function SubmitPhotoPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;

  const competition = MOCK_COMPETITIONS.find((c) => c.id === id || c.slug === id);

  // Check if current user already submitted
  const existingSubmission = MOCK_SUBMISSIONS.find(
    (sub) => sub.competitionId === competition?.id && sub.userId === CURRENT_USER.id
  );

  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [camera, setCamera] = useState('');
  const [lens, setLens] = useState('');
  const [focalLength, setFocalLength] = useState('85mm');
  const [aperture, setAperture] = useState('f/2.8');
  const [shutterSpeed, setShutterSpeed] = useState('1/1000s');
  const [iso, setIso] = useState('200');
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageUploaded = (previewUrl: string, autoExif?: any) => {
    setImageUrl(previewUrl);
    if (autoExif) {
      setCamera(autoExif.camera || 'Sony Alpha 1');
      setLens(autoExif.lens || 'Sony FE 70-200mm f/2.8 GM OSS II');
      setFocalLength(autoExif.focalLength || '135mm');
      setAperture(autoExif.aperture || 'f/2.8');
      setShutterSpeed(autoExif.shutterSpeed || '1/2000s');
      setIso(String(autoExif.iso || 250));
      showToast('EXIF Data Extracted', 'Camera settings auto-populated from file metadata.', 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      showToast('Image Required', 'Please upload a photograph before submitting.', 'error');
      return;
    }
    if (!agreedToRules) {
      showToast('Agreement Required', 'You must agree to contest rules and single-entry limits.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Entry Submitted Successfully! 🚀', 'Your photograph has been entered into preliminary AI evaluation.', 'success');
    }, 1200);
  };

  if (!competition) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold">Competition Not Found</h2>
          <Link href="/competitions" className="mt-4">
            <Button variant="primary">Browse Competitions</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-primary-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-10">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3">
          <Link
            href={`/competitions/${competition.id}`}
            className="text-xs text-primary-300 hover:text-primary-200 transition-colors flex items-center gap-1 font-mono"
          >
            ← Back to {competition.title}
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-primary-300 border border-white/20">
              {competition.category}
            </span>
            <span className="text-xs text-zinc-400">Prize Pool: {competition.prizePool}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Submit Photograph
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Enter your photograph for <span className="text-white font-semibold">{competition.title}</span>.
          </p>
        </div>

        {/* Existing Submission Check Warning */}
        {existingSubmission ? (
          <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">Submission Already Registered</h3>
              <p className="text-xs text-zinc-300">
                You have already submitted &quot;{existingSubmission.title}&quot; to this competition.
                Under platform rules, only 1 submission is permitted per entrant.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link href={`/dashboard/submissions/${existingSubmission.id}`}>
                <Button variant="gold">View My Existing Entry</Button>
              </Link>
              <Link href="/competitions">
                <Button variant="outline">Browse Other Contests</Button>
              </Link>
            </div>
          </div>
        ) : isSubmitted ? (
          /* Submission Complete State */
          <div className="p-8 sm:p-12 rounded-3xl bg-[#09090b] border border-white/[0.08] text-center space-y-6 animate-in zoom-in-95 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-2xl font-bold text-white">Entry Successfully Submitted!</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Your photograph &ldquo;{title || 'Untitled'}&rdquo; has been queued for initial AI vision analysis and EXIF confirmation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-white/[0.08] max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Competition:</span>
                <span className="text-white font-medium">{competition.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className="text-primary-300 font-mono font-bold">Queued for AI Evaluation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Jury Notification:</span>
                <span className="text-zinc-300 font-mono">Upon Shortlist Threshold</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/dashboard/submissions">
                <Button variant="primary">Go to My Submissions</Button>
              </Link>
              <Link href="/competitions">
                <Button variant="outline">Explore More Competitions</Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Main Submission Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Upload Photograph */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-6 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-white/10 text-primary-300 text-xs font-bold font-mono flex items-center justify-center">
                  01
                </span>
                <h3 className="text-lg font-bold text-white">Upload Photograph</h3>
              </div>

              <ImageUploader onImageSelected={handleImageUploaded} />
            </div>

            {/* Step 2: Photograph Details */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-6 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-white/10 text-primary-300 text-xs font-bold font-mono flex items-center justify-center">
                  02
                </span>
                <h3 className="text-lg font-bold text-white">Artwork & Location Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Photograph Title *"
                    placeholder="e.g. Whispers of the High Alpine"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <Textarea
                    label="Artistic Concept & Narrative *"
                    placeholder="Describe the moment, creative intent, atmospheric conditions, or background story..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Capture Location"
                    placeholder="e.g. Banff National Park, Canada"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="Contest Category"
                    value={competition.category}
                    disabled
                    helperText="Fixed to current competition theme."
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Camera & EXIF Specifications */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-6 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-white/10 text-primary-300 text-xs font-bold font-mono flex items-center justify-center">
                  03
                </span>
                <h3 className="text-lg font-bold text-white">Camera Gear & Technical Settings</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2 lg:col-span-2">
                  <Input
                    label="Camera Body"
                    placeholder="e.g. Sony Alpha 1"
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="Lens Model"
                    placeholder="e.g. 70-200mm f/2.8"
                    value={lens}
                    onChange={(e) => setLens(e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="Aperture"
                    placeholder="e.g. f/2.8"
                    value={aperture}
                    onChange={(e) => setAperture(e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="Shutter Speed"
                    placeholder="e.g. 1/2000s"
                    value={shutterSpeed}
                    onChange={(e) => setShutterSpeed(e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="ISO Sensitivity"
                    placeholder="e.g. 200"
                    value={iso}
                    onChange={(e) => setIso(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Rules Agreement */}
            <div className="p-6 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-4 shadow-xl">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-zinc-700 bg-black text-primary-600 focus:ring-primary-500"
                />
                <div className="text-xs text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-white">
                    I confirm that I own 100% original copyright to this photograph.
                  </span>{' '}
                  I acknowledge that I am submitting maximum 1 photograph to this competition, and that this entry will be evaluated through AI preliminary vision analysis and master jury review.
                </div>
              </label>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between gap-4">
              <Link href={`/competitions/${competition.id}`}>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Submit Official Entry
              </Button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
