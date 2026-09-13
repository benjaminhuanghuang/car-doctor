import { describe, it, expect } from 'vitest';
import { carSchema } from './schemas';

// Guards the @car-doctor/shared wiring: the web form schema is the shared one.
describe('carSchema', () => {
  it('accepts a valid car', () => {
    const result = carSchema.safeParse({ brand: 'Toyota', carModel: 'Corolla', year: 2020 });
    expect(result.success).toBe(true);
  });

  it('rejects a missing brand', () => {
    const result = carSchema.safeParse({ brand: '', carModel: 'Corolla', year: 2020 });
    expect(result.success).toBe(false);
  });

  it('rejects a year before the first automobile', () => {
    const result = carSchema.safeParse({ brand: 'Toyota', carModel: 'Corolla', year: 1800 });
    expect(result.success).toBe(false);
  });

  it('treats color as optional', () => {
    const result = carSchema.safeParse({ brand: 'Toyota', carModel: 'Corolla', year: 2020 });
    expect(result.success && result.data.color).toBeUndefined();
  });
});
