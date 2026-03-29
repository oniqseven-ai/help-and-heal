'use client';

import { Clock, XCircle, RotateCcw, FileText } from 'lucide-react';
import Link from 'next/link';

interface Props {
  status: string | null;
  rejectionReason: string | null;
}

export default function ProviderOnboardingStatus({ status, rejectionReason }: Props) {
  if (!status) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <FileText className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-xl font-bold">Complete Your Application</h2>
        <p className="mt-2 text-text-light">You haven&apos;t submitted a provider application yet.</p>
        <Link href="/provider-apply" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
          Apply Now
        </Link>
      </div>
    );
  }

  if (status === 'SUBMITTED' || status === 'UNDER_REVIEW') {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Application {status === 'UNDER_REVIEW' ? 'Under Review' : 'Submitted'}</h2>
        <p className="mt-2 text-text-light">
          Our team is reviewing your application. This typically takes 2-3 business days.
          We&apos;ll notify you once a decision is made.
        </p>
        <div className="mt-6 rounded-xl bg-primary/5 p-4 text-sm text-text-light">
          <strong>What happens next?</strong>
          <ol className="mt-2 list-decimal list-inside space-y-1 text-left">
            <li>Credential verification</li>
            <li>Background check</li>
            <li>Platform training assignment</li>
            <li>Profile goes live!</li>
          </ol>
        </div>
      </div>
    );
  }

  if (status === 'REJECTED' || status === 'RESUBMISSION_REQUESTED') {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
          <XCircle className="h-8 w-8 text-error" />
        </div>
        <h2 className="text-xl font-bold">
          {status === 'REJECTED' ? 'Application Rejected' : 'Resubmission Requested'}
        </h2>
        {rejectionReason && (
          <div className="mt-4 rounded-xl border border-error/20 bg-error/5 p-4 text-left text-sm">
            <strong className="text-error">Reason:</strong>
            <p className="mt-1 text-text-light">{rejectionReason}</p>
          </div>
        )}
        <Link href="/provider-apply" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
          <RotateCcw className="h-4 w-4" /> Resubmit Application
        </Link>
      </div>
    );
  }

  return null;
}
