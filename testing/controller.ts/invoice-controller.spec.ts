const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockSend = jest.fn();

// Mock the producer module
jest.mock('../../src/kafka', () => {
  return {
    kafka: {
      producer: () => ({
        connect: mockConnect,
        disconnect: mockDisconnect,
        send: mockSend,
      })
    }
  }
});

import { InvoiceController } from '../../src/controller/invoice.controller';
import { validBatchInvoice } from '../data/valid-batch-invoice';
import { validInvoiceData } from '../data/valid-invoice'


describe('InvoiceController', () => {
  let invoiceController: InvoiceController;

  beforeEach(() => {
    invoiceController = new InvoiceController();
  });

  test('Duplicated Invoice', () => {
    let result = invoiceController.doValidateInvoice(validInvoiceData);

    result = invoiceController.doValidateInvoice(validInvoiceData);
    if (result?.length) {
      expect(result[0]).not.toBe(null)
      expect(result[0].message).toBe('Invoice was duplicated');
    }
  });

  test('Duplicated Batch Invoice', () => {
    let result = invoiceController.doValidateBatchInvoices(validBatchInvoice);

    result = invoiceController.doValidateBatchInvoices(validBatchInvoice);
    if (result?.length) {
      expect(result[0]).not.toBe(null)
      expect(result[0].message).toBe('Batches Invoice was duplicated');
    }
  });
});