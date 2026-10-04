import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  demoDashboardData,
  isDemoModeEnabled,
  getDashboardData,
} from '../../lib/demo/dashboard-data.ts';

describe('Dashboard Demo Mode Fixtures & Environment Control', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DEMO_MODE;

  afterEach(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = originalEnv;
  });

  it('provides structured typed demo fixtures with Indian business context', () => {
    assert.strictEqual(demoDashboardData.isDemoMode, true);
    assert.ok(demoDashboardData.workspaceName.includes('Demo Workspace'));

    // Metric validation
    assert.ok(demoDashboardData.metrics.monthlyRevenue.startsWith('₹'));
    assert.ok(demoDashboardData.metrics.stockValuation.startsWith('₹'));
    assert.strictEqual(typeof demoDashboardData.metrics.openOrders, 'number');
    assert.strictEqual(typeof demoDashboardData.metrics.lowStockAlerts, 'number');

    // Recent activity validation
    assert.ok(Array.isArray(demoDashboardData.recentActivity));
    assert.strictEqual(demoDashboardData.recentActivity.length, 5);
    for (const activity of demoDashboardData.recentActivity) {
      assert.ok(activity.id);
      assert.ok(activity.type);
      assert.ok(activity.reference);
      assert.ok(activity.title);
      assert.ok(activity.description);
      assert.ok(activity.timestamp);
    }

    // Low stock items validation
    assert.ok(Array.isArray(demoDashboardData.lowStockItems));
    assert.strictEqual(demoDashboardData.lowStockItems.length, 5);
    for (const item of demoDashboardData.lowStockItems) {
      assert.ok(item.id);
      assert.ok(item.name);
      assert.ok(item.sku);
      assert.ok(item.category);
      assert.ok(typeof item.currentStock === 'number');
      assert.ok(typeof item.reorderPoint === 'number');
      assert.ok(item.currentStock < item.reorderPoint);
    }
  });

  it('enables demo mode when NEXT_PUBLIC_DEMO_MODE is true', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
    assert.strictEqual(isDemoModeEnabled(), true);
    const data = getDashboardData();
    assert.notStrictEqual(data, null);
    assert.strictEqual(data?.isDemoMode, true);
  });

  it('disables demo mode when NEXT_PUBLIC_DEMO_MODE is false or unset', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
    assert.strictEqual(isDemoModeEnabled(), false);
    assert.strictEqual(getDashboardData(), null);

    delete process.env.NEXT_PUBLIC_DEMO_MODE;
    assert.strictEqual(isDemoModeEnabled(), false);
    assert.strictEqual(getDashboardData(), null);
  });
});
