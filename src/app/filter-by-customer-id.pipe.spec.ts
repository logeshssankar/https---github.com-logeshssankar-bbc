import { FilterByCustomerIdPipe } from './filter-by-customer-id.pipe';

describe('FilterByCustomerIdPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterByCustomerIdPipe();
    expect(pipe).toBeTruthy();
  });
});
