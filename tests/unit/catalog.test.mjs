import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Catalog Domain Validation & Business Rules', () => {
  test('validates SKU format constraints', () => {
    const skuRegex = /^[A-Za-z0-9-_.]+$/;

    assert.ok(skuRegex.test('BRG-6204-2RS'));
    assert.ok(skuRegex.test('SKU_123.45'));
    assert.ok(skuRegex.test('ITEM-001'));
    assert.equal(skuRegex.test('ITEM 001'), false); // No spaces allowed
    assert.equal(skuRegex.test('ITEM#001'), false); // No special symbols
    assert.equal(skuRegex.test('ITEM/001'), false); // No slashes
  });

  test('validates price constraints & non-negativity', () => {
    function validatePrices(costPrice, sellingPrice) {
      if (typeof costPrice !== 'number' || costPrice < 0) return false;
      if (typeof sellingPrice !== 'number' || sellingPrice < 0) return false;
      return true;
    }

    assert.ok(validatePrices(100.5, 150.0));
    assert.ok(validatePrices(0, 0));
    assert.equal(validatePrices(-10, 100), false);
    assert.equal(validatePrices(50, -5), false);
  });

  test('validates GST rate constraints', () => {
    function validateGstRate(rate) {
      if (typeof rate !== 'number' || isNaN(rate)) return false;
      return rate >= 0 && rate <= 100;
    }

    assert.ok(validateGstRate(0));
    assert.ok(validateGstRate(5));
    assert.ok(validateGstRate(12));
    assert.ok(validateGstRate(18));
    assert.ok(validateGstRate(28));
    assert.equal(validateGstRate(-1), false);
    assert.equal(validateGstRate(101), false);
  });
});
