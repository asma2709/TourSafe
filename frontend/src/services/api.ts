import api from '@/lib/api';

import type {
  Tourist,
  SosAlert,
  SafetyZone,
  RescueResponse,
  Product,
  Account,
  Transaction,
  Budget,
} from '@/types';

export const touristService = {
  getAll: () => api.get('/api/tourists').then((r) => r.data),
  create: (data: Partial<Tourist>) =>
    api.post('/api/tourists', data).then((r) => r.data),
};

export const sosService = {
  getAll: () =>
    api.get('/api/tourists/active-sos').then((r) => r.data),

  create: (data: Partial<SosAlert>) =>
    api.post('/api/tourists/sos', data).then((r) => r.data),
};

export const safetyZoneService = {
  getAll: () =>
    api.get('/api/safety-zones').then((r) => r.data),

  create: (data: Partial<SafetyZone>) =>
    api.post('/api/safety-zones', data).then((r) => r.data),

  checkGeofence: (touristId: number, lat: number, lng: number) =>
    api
      .get(
        `/api/geo-fencing/check?touristId=${touristId}&lat=${lat}&lng=${lng}`
      )
      .then((r) => r.data),
};

export const rescueService = {
  getAll: () =>
    api.get('/api/rescue-responses').then((r) => r.data),

  create: (data: Partial<RescueResponse>) =>
    api.post('/api/rescue-responses', data).then((r) => r.data),
};

export const productService = {
  getAll: () =>
    api.get('/api/products').then((r) => r.data),

  create: (data: Partial<Product>) =>
    api.post('/api/products', data).then((r) => r.data),
};

export const accountService = {
  getAll: () =>
    api.get('/api/accounts').then((r) => r.data),

  create: (data: Partial<Account>) =>
    api.post('/api/accounts', data).then((r) => r.data),
};

export const transactionService = {
  getAll: () =>
    api.get('/api/transactions').then((r) => r.data),

  create: (data: Partial<Transaction>) =>
    api.post('/api/transactions', data).then((r) => r.data),
};

export const budgetService = {
  getAll: () =>
    api.get('/api/budgets').then((r) => r.data),

  create: (data: Partial<Budget>) =>
    api.post('/api/budgets', data).then((r) => r.data),
};

export const reportService = {
  getFinancial: () =>
    api.get('/api/reports/financial').then((r) => r.data),
};