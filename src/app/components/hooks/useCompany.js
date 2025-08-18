"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { base_url, fetchURL } from "../dataPanel";

export const useCompany = () => {
  return useQuery({
    queryKey: ["company"], // unique cache key
    queryFn: async () => {
      const res = await axios.get(`${fetchURL}/getall`, {
        params: {
          erp_url: base_url,
          doctype_name: "Company",
        //   fields: '["name", "item_code"]',
        //   sid: "3b4eca81cac4cbc6a4d58081a7f3ccf1235f199082ca3970821ddb47",
        //   filters: '[["name", "=", "Z9s Pro"]]',
        //   limit: 5,
        //   page: 1,
        },
      });
      return res.data.data.data;
    },
    staleTime: 1000 * 60 * 60 * 24, 
    refetchOnWindowFocus: false,
  });
};
