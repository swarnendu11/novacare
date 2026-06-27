import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pharmacyApi = createApi({
  reducerPath: 'pharmacyApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/pharmacy/' }),
  endpoints: (builder) => ({
    getInventory: builder.query({
      query: () => 'inventory',
    }),
    addMedicine: builder.mutation({
      query: (medicine) => ({
        url: 'inventory',
        method: 'POST',
        body: medicine,
      }),
    }),
    updateMedicine: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `inventory/${id}`,
        method: 'PUT',
        body: patch,
      }),
    }),
    getPharmacyStats: builder.query({
      query: () => 'stats',
    }),
    getPrescriptions: builder.query({
      query: () => 'prescriptions',
    }),
    processSale: builder.mutation({
      query: (sale) => ({
        url: 'sales',
        method: 'POST',
        body: sale,
      }),
    }),
    updatePrescriptionStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `prescriptions/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useAddMedicineMutation,
  useUpdateMedicineMutation,
  useGetPharmacyStatsQuery,
  useGetPrescriptionsQuery,
  useProcessSaleMutation,
  useUpdatePrescriptionStatusMutation,
} = pharmacyApi;
