import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { base_url, fetchURL } from '../dataPanel';


const useAllWebsiteItem = () => {
  const { data: webItmData, refetch } = useQuery({
    queryKey: ['webItmData'],
    queryFn: async () => {
      const res = await axios.get(
        `${fetchURL}/getall-website-items?erp_url=${base_url}`
      );

      // Keep the same structure as your old version
      return {
        ...res.data,
        data: res.data.data // backend already filtered published/disabled
      };
    }
  });

  return { webItmData, refetch };
};

export default useAllWebsiteItem;
