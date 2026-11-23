// RTK Query: estado del SERVIDOR (autos). Cada endpoint genera un hook con cache incluida.
import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosRequestConfig } from "axios";
import { api as http, getErrorMessage } from "../lib/api";
import type { CarFormValues } from "../schemas/car.schema";
import type { Car, CarsQueryParams, Paginated } from "../types/car";

// Usa la misma instancia de axios. El error se guarda ya como string, listo para mostrar.
const axiosBaseQuery: BaseQueryFn<AxiosRequestConfig, unknown, string> = async (config) => {
  try {
    const { data } = await http.request(config);
    return { data };
  } catch (err) {
    return { error: getErrorMessage(err) };
  }
};

export const carsApi = createApi({
  reducerPath: "carsApi",
  baseQuery: axiosBaseQuery,
  // Las queries "proveen" el tag y las mutations lo "invalidan" -> RTK Query vuelve a pedir solo.
  // Asi lo que hace el admin se refleja al toque en la vista publica.
  tagTypes: ["Cars"],
  endpoints: (build) => ({
    getCars: build.query<Paginated<Car>, CarsQueryParams>({
      query: (params) => ({ url: "/cars", params }),
      providesTags: ["Cars"],
    }),
    getCarById: build.query<Car, string>({
      query: (id) => ({ url: `/cars/${id}` }),
      providesTags: ["Cars"],
    }),
    createCar: build.mutation<Car, CarFormValues>({
      query: (data) => ({ url: "/cars", method: "POST", data }),
      invalidatesTags: ["Cars"],
    }),
    updateCar: build.mutation<Car, { id: string; values: Partial<CarFormValues> }>({
      query: ({ id, values }) => ({ url: `/cars/${id}`, method: "PUT", data: values }),
      invalidatesTags: ["Cars"],
    }),
    // hard = false -> baja logica; hard = true -> baja fisica
    deleteCar: build.mutation<void, { id: string; hard: boolean }>({
      query: ({ id, hard }) => ({ url: `/cars/${id}`, method: "DELETE", params: hard ? { hard: "true" } : undefined }),
      invalidatesTags: ["Cars"],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carsApi;
