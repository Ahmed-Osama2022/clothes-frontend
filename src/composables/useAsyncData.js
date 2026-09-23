import { ref } from 'vue';

// ======= USE ASYNC DATA =======
// Shared pattern for any component that WILL fetch from the backend later
// (GET /api/home, /api/products, /api/categories/{slug}, /api/home -> ... see
// apis.md). Today most views read src/data/*.js synchronously, so `loading`
// defaults to false and skeletons stay hidden. Once a view swaps its data
// source for a real (or fake async) fetcher, pass it here and the skeleton
// placeholders light up automatically.
//
//   const { loading, data, error } = useAsyncData(() => getProducts(locale));
//   ...<template> <ProductCardSkeleton v-if="loading" /> <grid v-else /> </template>
//
// `loading` / `data` / `error` are reactive refs; `execute()` re-runs fetcher.
export const useAsyncData = (fetcher, { immediate = false } = {}) => {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const execute = async (...args) => {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fetcher(...args);
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
    return data.value;
  };

  if (immediate) execute();

  return { data, loading, error, execute };
};