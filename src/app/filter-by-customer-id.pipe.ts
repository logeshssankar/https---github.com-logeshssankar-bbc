import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from './employee/transaction/transaction.component';

@Pipe({
  name: 'filterByCustomerId'
})
export class FilterByCustomerIdPipe implements PipeTransform {

  transform(transactions: Transaction[], searchText: string): Transaction[] {
    if (!transactions || !searchText) {
      return transactions;
    }
    return transactions.filter(t => 
      t.customer?.customer_id.toString().includes(searchText)
    );
  }

}
