'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Boxes,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
  TrendingUp,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FullOnboardingData, BusinessSetupData, InventorySetupData } from '@/lib/onboarding/types';
import { saveOnboardingStepAction, completeOnboardingAction } from '@/lib/onboarding/actions';

interface NormalOnboardingWizardProps {
  initialStep?: number;
  initialData?: Partial<FullOnboardingData>;
  defaultOrgName?: string;
}

export function NormalOnboardingWizard({
  initialStep = 1,
  initialData = {},
  defaultOrgName = 'My Business',
}: NormalOnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<number>(Math.min(Math.max(initialStep, 1), 4));
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [businessData, setBusinessData] = useState<BusinessSetupData>({
    businessName: initialData.business?.businessName || defaultOrgName,
    industry: initialData.business?.industry || 'retail',
    country: initialData.business?.country || 'India',
    currency: initialData.business?.currency || 'INR',
  });

  const [inventoryData, setInventoryData] = useState<InventorySetupData>({
    warehouseName: initialData.inventory?.warehouseName || 'Main Warehouse',
    warehouseCity: initialData.inventory?.warehouseCity || 'Mumbai',
    skuCountRange: initialData.inventory?.skuCountRange || '50-500',
    gstRegistered: initialData.inventory?.gstRegistered ?? true,
  });

  const industries: { id: BusinessSetupData['industry']; label: string }[] = [
    { id: 'retail', label: 'Retail & Multi-Store' },
    { id: 'wholesale', label: 'Wholesale & B2B Distribution' },
    { id: 'electronics', label: 'Consumer Electronics & IT' },
    { id: 'apparel', label: 'Apparel & Footwear' },
    { id: 'manufacturing', label: 'Assembly & Manufacturing' },
    { id: 'fmcg', label: 'FMCG & Packaged Goods' },
    { id: 'other', label: 'General Trading' },
  ];

  const skuRanges: { id: InventorySetupData['skuCountRange']; label: string }[] = [
    { id: '1-50', label: '1 – 50 SKUs' },
    { id: '50-500', label: '50 – 500 SKUs' },
    { id: '500-5000', label: '500 – 5,000 SKUs' },
    { id: '5000+', label: '5,000+ SKUs' },
  ];

  const handleNext = (nextStep: number) => {
    setErrorMessage(null);

    // Step 2 validation
    if (step === 2 && (!businessData.businessName.trim() || businessData.businessName.length < 2)) {
      setErrorMessage('Please enter a valid business name (at least 2 characters).');
      return;
    }

    // Step 3 validation
    if (step === 3 && (!inventoryData.warehouseName.trim() || !inventoryData.warehouseCity.trim())) {
      setErrorMessage('Please provide a warehouse name and city location.');
      return;
    }

    startTransition(async () => {
      const draft = { business: businessData, inventory: inventoryData };
      await saveOnboardingStepAction(nextStep, draft);
      setStep(nextStep);
    });
  };

  const handleSkip = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const defaultData: FullOnboardingData = {
        business: {
          businessName: defaultOrgName || 'My Business',
          industry: 'retail',
          country: 'India',
          currency: 'INR',
        },
        inventory: {
          warehouseName: 'Main Warehouse',
          warehouseCity: 'Mumbai',
          skuCountRange: '50-500',
          gstRegistered: true,
        },
      };
      const res = await completeOnboardingAction(defaultData);
      if (res.success) {
        router.push('/app/dashboard');
      } else {
        setErrorMessage(res.error || 'Failed to complete setup.');
      }
    });
  };

  const handleFinish = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const fullData: FullOnboardingData = {
        business: businessData,
        inventory: inventoryData,
      };
      const res = await completeOnboardingAction(fullData);
      if (res.success) {
        router.push('/app/dashboard');
      } else {
        setErrorMessage(res.error || 'Failed to complete setup.');
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar & Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
          <span>SETUP WIZARD</span>
          <span>STEP {step} OF 4</span>
        </div>
        <div className="w-full h-1 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-text-primary transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step Content Container */}
      <div className="rounded-xl border border-border-subtle bg-surface p-6 sm:p-8 shadow-sm">
        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-surface-muted border border-border-subtle px-2.5 py-1 text-[11px] font-mono text-text-muted">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                Innvntory Operating System
              </div>
              <h1 className="text-2xl font-bold font-heading text-text-primary tracking-tight">
                Welcome to Innvntory
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                Let’s get your workspace ready. We’ll configure your business profile and initial warehouse in just a few quick steps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2">
              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1.5">
                <Boxes className="h-4 w-4 text-text-muted" />
                <h3 className="text-xs font-semibold text-text-primary font-secondary">Inventory & Stock</h3>
                <p className="text-[11px] text-text-muted leading-snug">
                  Multi-warehouse stock balances, ledger movements, and low-stock alerts.
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1.5">
                <FileCheck2 className="h-4 w-4 text-text-muted" />
                <h3 className="text-xs font-semibold text-text-primary font-secondary">GST Invoicing</h3>
                <p className="text-[11px] text-text-muted leading-snug">
                  Compliant B2B sales orders, invoices, and purchase receipt workflows.
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 space-y-1.5">
                <TrendingUp className="h-4 w-4 text-text-muted" />
                <h3 className="text-xs font-semibold text-text-primary font-secondary">Live Reports</h3>
                <p className="text-[11px] text-text-muted leading-snug">
                  Real-time sales, purchasing, inventory valuation, and cash flow analytics.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isPending}
                className="text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
              >
                Skip setup
              </button>

              <button
                type="button"
                onClick={() => handleNext(2)}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-background hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BUSINESS SETUP */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold font-heading text-text-primary tracking-tight">
                Business Profile
              </h2>
              <p className="text-xs text-text-muted">
                Enter your company information and primary operational currency.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-xs font-medium text-text-secondary mb-1.5">
                  Business / Company Name *
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={businessData.businessName}
                  onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                  placeholder="e.g. Apex Retail Private Limited"
                  className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-xs text-text-primary placeholder:text-text-disabled focus:border-text-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Primary Industry / Sector *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setBusinessData({ ...businessData, industry: ind.id })}
                      className={cn(
                        'flex items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition-colors cursor-pointer',
                        businessData.industry === ind.id
                          ? 'border-text-primary bg-surface-muted text-text-primary font-medium'
                          : 'border-border-subtle bg-surface text-text-secondary hover:border-border'
                      )}
                    >
                      <span>{ind.label}</span>
                      {businessData.industry === ind.id && <CheckCircle2 className="h-3.5 w-3.5 text-text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-xs font-medium text-text-secondary mb-1.5">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={businessData.country}
                    onChange={(e) => setBusinessData({ ...businessData, country: e.target.value })}
                    className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-xs text-text-primary focus:border-text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="currency" className="block text-xs font-medium text-text-secondary mb-1.5">
                    Operating Currency
                  </label>
                  <input
                    id="currency"
                    type="text"
                    value={businessData.currency}
                    onChange={(e) => setBusinessData({ ...businessData, currency: e.target.value })}
                    className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-xs text-text-primary focus:border-text-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => handleNext(3)}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-background hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Continue to Inventory</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INVENTORY SETUP */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold font-heading text-text-primary tracking-tight">
                Inventory & Warehouse Setup
              </h2>
              <p className="text-xs text-text-muted">
                Create your primary stock location and estimated catalog volume.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="warehouseName" className="block text-xs font-medium text-text-secondary mb-1.5">
                    Primary Warehouse / Store Name *
                  </label>
                  <input
                    id="warehouseName"
                    type="text"
                    value={inventoryData.warehouseName}
                    onChange={(e) => setInventoryData({ ...inventoryData, warehouseName: e.target.value })}
                    placeholder="e.g. Central Warehouse"
                    className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-xs text-text-primary placeholder:text-text-disabled focus:border-text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="warehouseCity" className="block text-xs font-medium text-text-secondary mb-1.5">
                    Location / City *
                  </label>
                  <input
                    id="warehouseCity"
                    type="text"
                    value={inventoryData.warehouseCity}
                    onChange={(e) => setInventoryData({ ...inventoryData, warehouseCity: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-xs text-text-primary placeholder:text-text-disabled focus:border-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Approximate Product SKU Volume
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {skuRanges.map((range) => (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => setInventoryData({ ...inventoryData, skuCountRange: range.id })}
                      className={cn(
                        'rounded-md border p-2.5 text-center text-xs transition-colors cursor-pointer',
                        inventoryData.skuCountRange === range.id
                          ? 'border-text-primary bg-surface-muted text-text-primary font-medium'
                          : 'border-border-subtle bg-surface text-text-secondary hover:border-border'
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border-subtle bg-background-subtle p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-text-primary block">GST Tax Structure</span>
                  <span className="text-[11px] text-text-muted">
                    Enable standard Indian HSN/SAC GST rates (5%, 12%, 18%, 28%).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={inventoryData.gstRegistered}
                  onChange={(e) => setInventoryData({ ...inventoryData, gstRegistered: e.target.checked })}
                  className="h-4 w-4 rounded border-border-subtle text-text-primary focus:ring-text-primary cursor-pointer"
                />
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
                onClick={() => handleNext(4)}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-background hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Review & Finish</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: READY */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Setup Complete
              </div>
              <h2 className="text-2xl font-bold font-heading text-text-primary tracking-tight">
                Your workspace is ready.
              </h2>
              <p className="text-xs text-text-muted">
                Here is a summary of your configured operational environment.
              </p>
            </div>

            <div className="rounded-lg border border-border-subtle bg-background-subtle p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-text-muted">Business Entity</span>
                <span className="font-semibold text-text-primary font-mono">{businessData.businessName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-text-muted">Industry</span>
                <span className="text-text-primary capitalize">{businessData.industry}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-text-muted">Primary Warehouse</span>
                <span className="font-mono text-text-primary">{inventoryData.warehouseName} ({inventoryData.warehouseCity})</span>
              </div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-text-muted">Catalog Volume</span>
                <span className="text-text-primary">{inventoryData.skuCountRange}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Currency & Region</span>
                <span className="text-text-primary font-mono">{businessData.currency} ({businessData.country})</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setStep(3)}
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
                <span>Go to Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
