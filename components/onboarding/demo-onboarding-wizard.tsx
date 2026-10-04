'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  FlaskConical,
  Package,
  Users,
  Building2,
  Tags,
  Boxes,
  ShoppingCart,
  Truck,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { completeDemoOnboardingAction } from '@/lib/onboarding/actions';

export function DemoOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  const handleFinish = () => {
    startTransition(async () => {
      // Save local storage for fast client check
      try {
        localStorage.setItem('innvntory_demo_onboarding_completed', 'true');
      } catch {
        // Storage guard
      }
      await completeDemoOnboardingAction();
      router.push('/app/dashboard');
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <FlaskConical className="h-3.5 w-3.5" />
            DEMO PREVIEW WALKTHROUGH
          </span>
          <span>STEP {step} OF 3</span>
        </div>
        <div className="w-full h-1 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content Card */}
      <div className="rounded-xl border border-border-subtle bg-surface p-6 sm:p-8 shadow-sm">
        {/* STEP 1: WELCOME TO DEMO */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                Live Demo Environment
              </div>
              <h1 className="text-2xl font-bold font-heading text-text-primary tracking-tight">
                Welcome to the Innvntory Demo
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                This public demo workspace is pre-populated with a complete, interconnected Indian retail and distribution dataset across 17 database domains.
              </p>
            </div>

            <div className="rounded-lg border border-border-subtle bg-background-subtle p-4 space-y-2 text-xs text-text-muted">
              <p>
                • <strong className="text-text-primary font-medium">Real PostgreSQL Records:</strong> Zero mocked or static numbers. All dashboard KPIs and charts calculate live from database tables.
              </p>
              <p>
                • <strong className="text-text-primary font-medium">Automated 2-Hour Reset:</strong> Any exploratory records you create will be automatically reset to the pristine canonical baseline.
              </p>
              <p>
                • <strong className="text-text-primary font-medium">Viewer Sandbox Role:</strong> Safe read and workflow testing permissions without risk to production data.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={handleFinish}
                disabled={isPending}
                className="text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
              >
                Skip to Dashboard
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-background hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EXPLORE BUSINESS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold font-heading text-text-primary tracking-tight">
                Explore the Business
              </h2>
              <p className="text-xs text-text-muted">
                The demo workspace includes complete master catalogs and counterparty records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-text-muted" />
                  <h3 className="text-xs font-semibold text-text-primary font-secondary">50 Products</h3>
                </div>
                <p className="text-[11px] text-text-muted">
                  Full SKUs, barcodes, cost prices, selling prices, and GST tax classifications.
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-text-muted" />
                  <h3 className="text-xs font-semibold text-text-primary font-secondary">8 Categories</h3>
                </div>
                <p className="text-[11px] text-text-muted">
                  Organized by Indian HSN tax codes with 12% and 18% GST rate schedules.
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-text-muted" />
                  <h3 className="text-xs font-semibold text-text-primary font-secondary">20 Customers</h3>
                </div>
                <p className="text-[11px] text-text-muted">
                  B2B wholesale clients and retail accounts across Mumbai, Delhi, and Bengaluru.
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-text-muted" />
                  <h3 className="text-xs font-semibold text-text-primary font-secondary">10 Suppliers</h3>
                </div>
                <p className="text-[11px] text-text-muted">
                  Verified hardware and components distributors with Net 30/45 payment terms.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-background hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span>Continue to Operations</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EXPLORE OPERATIONS */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold font-heading text-text-primary tracking-tight">
                Explore Operations
              </h2>
              <p className="text-xs text-text-muted">
                Navigate live multi-location stock, purchasing, sales, and financial intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-text-muted" />
                  <h3 className="text-xs font-semibold text-text-primary font-secondary">Inventory & Stock</h3>
                </div>
                <p className="text-[11px] text-text-muted">
                  3 active warehouses (Central Hub, City Retail, North Distribution) with 242 movements.
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-text-muted" />
                  <h3 className="text-xs font-semibold text-text-primary font-secondary">Sales & Invoices</h3>
                </div>
                <p className="text-[11px] text-text-muted">
                  50 sales orders, 50 invoices, 44 payments, and 5 returns with reconciled ledgers.
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-text-muted" />
                  <h3 className="text-xs font-semibold text-text-primary font-secondary">Procurement</h3>
                </div>
                <p className="text-[11px] text-text-muted">
                  25 purchase orders, 23 physical receipts, 20 payments, and 4 supplier returns.
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-text-muted" />
                  <h3 className="text-xs font-semibold text-text-primary font-secondary">Live Reports</h3>
                </div>
                <p className="text-[11px] text-text-muted">
                  Live sales velocity, procurement trends, stock valuation, and gross margin cash flow.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-md bg-text-primary px-5 py-2.5 text-xs font-medium text-background hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Open Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
